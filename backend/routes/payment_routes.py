import os
import uuid
import stripe
from fastapi import APIRouter, HTTPException, Request, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from supabase import create_client
from crypto import encrypt_secret, decrypt_secret
from auth import get_current_store

load_dotenv()

router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE")
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


class CheckoutRequest(BaseModel):
    email: str
    password: str
    store_name: str
    phone: str = ""
    owner_name: str = ""


@router.post("/create-checkout")
async def create_checkout(data: CheckoutRequest, request: Request):
    """
    1. Salva os dados do registro como pendente
    2. Cria um checkout no Stripe (Assinatura R$89,00/mês com 15 dias grátis)
    3. Retorna a URL de pagamento para redirecionar o usuario
    """
    reference_id = f"AUTORACER-{uuid.uuid4().hex[:12].upper()}"

    try:
        pending = supabase.table("pending_registrations").insert({
            "email": data.email,
            "password_hash": encrypt_secret(data.password),
            "store_name": data.store_name,
            "phone": data.phone,
            "owner_name": data.owner_name,
            "reference_id": reference_id,
            "status": "PENDING"
        }).execute()
    except Exception:
        raise HTTPException(status_code=400, detail="Erro ao salvar o registro. Tente novamente.")

    try:
        origin = request.headers.get("origin", "http://localhost:3007")
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'brl',
                    'product_data': {
                        'name': 'Auto Racer — Plano Parceiro',
                    },
                    'unit_amount': 8900,
                    'recurring': {
                        'interval': 'month',
                    },
                },
                'quantity': 1,
            }],
            mode='subscription',
            subscription_data={
                'trial_period_days': 15,
                'metadata': {
                    'reference_id': reference_id,
                },
            },
            success_url=f"{origin}/cadastro-sucesso?ref={reference_id}",
            cancel_url=f"{origin}/cadastro",
            client_reference_id=reference_id,
            customer_email=data.email
        )

        supabase.table("pending_registrations").update({
            "pagbank_checkout_id": session.id
        }).eq("reference_id", reference_id).execute()

        return {
            "checkout_id": session.id,
            "payment_url": session.url,
            "reference_id": reference_id
        }

    except stripe.StripeError:
        raise HTTPException(status_code=502, detail="Erro ao iniciar o pagamento. Tente novamente.")


@router.post("/subscribe")
async def create_subscription(request: Request, store=Depends(get_current_store)):
    """
    Cria um checkout de ASSINATURA no Stripe para uma loja JÁ existente (logada).
    Usado quando o trial expira e o lojista quer assinar — NÃO recria a conta/loja
    (resolve o 422 do fluxo antigo, que exigia senha e tentava registrar de novo).
    """
    store_id = store["store_id"]
    origin = request.headers.get("origin", "http://localhost:3007")

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'brl',
                    'product_data': {'name': 'Auto Racer — Plano Parceiro'},
                    'unit_amount': 8900,
                    'recurring': {'interval': 'month'},
                },
                'quantity': 1,
            }],
            mode='subscription',
            subscription_data={'metadata': {'store_id': store_id}},
            success_url=f"{origin}/admin?assinatura=sucesso",
            cancel_url=f"{origin}/admin",
            client_reference_id=f"STORE-{store_id}",
            customer_email=store.get("email"),
        )
        return {"payment_url": session.url, "checkout_id": session.id}
    except stripe.StripeError:
        raise HTTPException(status_code=502, detail="Erro ao iniciar a assinatura. Tente novamente.")


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Webhook chamado pelo Stripe para eventos de assinatura.
    - checkout.session.completed: Cria a conta do usuario e a loja (trial ativo).
    - customer.subscription.deleted: Marca assinatura como cancelada.
    - invoice.payment_succeeded: Renova a assinatura após o trial.
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    event_type = event['type']

    # ─── CHECKOUT COMPLETO (trial iniciado) ───
    if event_type == 'checkout.session.completed':
        session = event['data']['object']
        reference_id = session.get('client_reference_id') or ''
        subscription_id = session.get('subscription', '')
        customer_id = session.get('customer', '')

        # ── Assinatura de loja JÁ existente (conversão pós-trial) ──
        # Não recria conta/loja: só ativa a assinatura e estende a expiração.
        if reference_id.startswith("STORE-"):
            from datetime import datetime, timedelta, timezone
            store_id = reference_id[len("STORE-"):]
            now = datetime.now(timezone.utc)
            period_end = now + timedelta(days=30)

            supabase.table("subscriptions").insert({
                "store_id": store_id,
                "plan": "parceiro",
                "status": "ACTIVE",
                "amount": 8900,
                "pagbank_order_id": subscription_id,
                "pagbank_charge_id": customer_id,
                "current_period_start": now.isoformat(),
                "current_period_end": period_end.isoformat(),
            }).execute()

            supabase.table("stores").update({
                "plan": "parceiro",
                "active": True,
                "subscription_expires_at": period_end.isoformat(),
            }).eq("id", store_id).execute()

            return {"status": "success"}

        # Log da transação
        supabase.table("payment_transactions").insert({
            "reference_id": reference_id,
            "pagbank_order_id": subscription_id,
            "pagbank_charge_id": customer_id,
            "type": "STRIPE_CHECKOUT",
            "status": "TRIAL",
            "amount": 8900,
            "raw_payload": session
        }).execute()

        # Buscar registro pendente
        pending = supabase.table("pending_registrations")\
            .select("*")\
            .eq("reference_id", reference_id)\
            .eq("status", "PENDING")\
            .execute()

        if not pending.data:
            return {"status": "ok", "message": "Registro não encontrado ou já processado"}

        reg = pending.data[0]

        # Criar usuário no Supabase Auth.
        # Idempotência: se o Stripe reenviar o webhook após uma falha parcial
        # (usuário já criado, mas loja falhou), o create_user lança porque o e-mail
        # já existe. Nesse caso, recuperamos o id do usuário existente e seguimos.
        try:
            auth_response = supabase.auth.admin.create_user({
                "email": reg["email"],
                "password": decrypt_secret(reg["password_hash"]),
                "email_confirm": True
            })
            user_id = auth_response.user.id
        except Exception:
            user_id = None
            try:
                existing_users = supabase.auth.admin.list_users()
                for u in (existing_users or []):
                    u_email = getattr(u, "email", None) or (u.get("email") if isinstance(u, dict) else None)
                    if u_email and u_email.lower() == reg["email"].lower():
                        user_id = getattr(u, "id", None) or (u.get("id") if isinstance(u, dict) else None)
                        break
            except Exception:
                user_id = None
            if not user_id:
                raise HTTPException(status_code=500, detail="Falha ao processar a conta. Tente novamente.")

        # Criar loja com trial de 15 dias
        import re
        from datetime import datetime, timedelta, timezone

        base_slug = re.sub(r'[^a-z0-9]+', '-', reg["store_name"].lower()).strip('-')
        slug = base_slug
        
        existing_slug = supabase.table("stores").select("id").eq("slug", slug).execute()
        if existing_slug.data:
            slug = f"{base_slug}-{user_id[:6]}"

        trial_end = (datetime.now(timezone.utc) + timedelta(days=15)).isoformat()

        store_result = supabase.table("stores").insert({
            "name": reg["store_name"],
            "slug": slug,
            "phone": reg.get("phone", ""),
            "plan": "parceiro",
            "active": True,
            "trial_ends_at": trial_end
        }).execute()

        store_id = store_result.data[0]["id"]

        # Vincular usuario à loja (id = auth.users.id, mesmo que user_id)
        supabase.table("store_users").insert({
            "id": user_id,
            "store_id": store_id,
            "role": "owner",
            "email": reg["email"]
        }).execute()

        # Criar assinatura com datas de período e expiração
        from datetime import datetime, timedelta, timezone
        now = datetime.now(timezone.utc)
        period_end = now + timedelta(days=30)

        # Criar assinatura (status TRIALING)
        supabase.table("subscriptions").insert({
            "store_id": store_id,
            "user_id": user_id,
            "plan": "parceiro",
            "status": "TRIALING",
            "amount": 8900,
            "pagbank_order_id": subscription_id,
            "pagbank_charge_id": customer_id,
            "current_period_start": now.isoformat(),
            "current_period_end": period_end.isoformat()
        }).execute()

        # Atualizar loja com data de expiração da assinatura
        supabase.table("stores").update({
            "subscription_expires_at": period_end.isoformat()
        }).eq("id", store_id).execute()

        # Atualizar registro pendente
        supabase.table("pending_registrations").update({
            "status": "PAID"
        }).eq("reference_id", reference_id).execute()

    # ─── PAGAMENTO DA ASSINATURA CONFIRMADO (após trial) ───
    elif event_type == 'invoice.payment_succeeded':
        invoice = event['data']['object']
        subscription_id = invoice.get('subscription', '')
        customer_id = invoice.get('customer', '')
        amount = invoice.get('amount_paid', 8900)

        # Só processar faturas de renovação (não a do trial)
        if invoice.get('billing_reason') == 'subscription_cycle':
            # Atualizar assinatura para ACTIVE
            supabase.table("subscriptions").update({
                "status": "ACTIVE"
            }).eq("pagbank_order_id", subscription_id).execute()

            # Log da transação
            supabase.table("payment_transactions").insert({
                "pagbank_order_id": subscription_id,
                "pagbank_charge_id": customer_id,
                "type": "SUBSCRIPTION_RENEWAL",
                "status": "PAID",
                "amount": amount,
                "raw_payload": invoice
            }).execute()

    # ─── ASSINATURA CANCELADA ───
    elif event_type == 'customer.subscription.deleted':
        subscription = event['data']['object']
        subscription_id = subscription.get('id', '')

        # Marcar assinatura como cancelada
        supabase.table("subscriptions").update({
            "status": "CANCELLED"
        }).eq("pagbank_order_id", subscription_id).execute()

    return {"status": "success"}

@router.get("/check-status/{reference_id}")
async def check_payment_status(reference_id: str):
    """
    Verifica se o pagamento de um registro pendente foi confirmado.
    """
    result = supabase.table("pending_registrations")\
        .select("status, email, store_name")\
        .eq("reference_id", reference_id)\
        .execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Registro não encontrado")

    reg = result.data[0]
    return {
        "status": reg["status"],
        "email": reg["email"],
        "store_name": reg["store_name"],
        "is_paid": reg["status"] == "PAID"
    }
