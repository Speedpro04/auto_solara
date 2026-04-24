from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from database import supabase
from config import get_settings

router = APIRouter()
settings = get_settings()

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    store_name: str
    phone: str

class RecoverPasswordRequest(BaseModel):
    email: str

@router.post("/login")
async def login(request: LoginRequest):
    """
    Autentica o usuário no Supabase Auth e retorna os dados do usuário e da loja.
    """
    try:
        # Autenticar com Supabase
        auth_response = supabase.auth.sign_in_with_password({
            "email": request.email,
            "password": request.password
        })
        
        if not auth_response.user:
            raise HTTPException(status_code=401, detail="Credenciais inválidas")

        # Buscar dados do usuário e sua loja
        user_id = auth_response.user.id
        user_response = supabase.table("store_users").select("store_id, role, email").eq("id", user_id).execute()
        
        if not user_response.data:
            # Caso seja um usuário do Supabase mas não esteja na tabela store_users
            # Pode ser um super admin ou erro de cadastro
            return {
                "success": True,
                "access_token": auth_response.session.access_token,
                "refresh_token": auth_response.session.refresh_token,
                "user": {
                    "id": user_id,
                    "email": auth_response.user.email
                }
            }

        store_user = user_response.data[0]
        store_id = store_user["store_id"]

        # Buscar dados da loja
        store_response = supabase.table("stores").select("*").eq("id", store_id).execute()
        store = store_response.data[0] if store_response.data else None

        return {
            "success": True,
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user": {
                "id": user_id,
                "email": auth_response.user.email,
                "role": store_user["role"]
            },
            "store": store
        }

    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/register")
async def register(request: RegisterRequest):
    """
    Registra um novo parceiro, cria a loja e o usuário associado.
    """
    try:
        # 1. Cadastrar usuário no Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": request.email,
            "password": request.password
        })

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Não foi possível criar o usuário no Supabase Auth.")

        user_id = auth_response.user.id

        # 2. Gerar slug a partir do nome da loja
        import re
        base_slug = re.sub(r'[^a-z0-9]+', '-', request.store_name.lower()).strip('-')
        slug = base_slug
        
        # Lidar com slugs duplicados (básico)
        existing_slug = supabase.table("stores").select("id").eq("slug", slug).execute()
        if existing_slug.data:
            slug = f"{base_slug}-{user_id[:6]}"

        # 3. Criar a loja (stores)
        store_data = {
            "name": request.store_name,
            "slug": slug,
            "phone": request.phone,
            "plan": "basic",
            "active": True
        }
        store_response = supabase.table("stores").insert(store_data).execute()
        
        if not store_response.data:
            raise HTTPException(status_code=500, detail="Erro ao criar registro da loja.")
            
        store_id = store_response.data[0]["id"]

        # 4. Criar vínculo de usuário e loja (store_users)
        user_data = {
            "id": user_id,
            "store_id": store_id,
            "role": "owner",
            "email": request.email
        }
        supabase.table("store_users").insert(user_data).execute()

        return {
            "success": True,
            "message": "Conta criada com sucesso.",
            "user_id": user_id,
            "store_slug": slug
        }

    except Exception as e:
        # Detalhes do erro para debug
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/recover-password")
async def recover_password(request: RecoverPasswordRequest):
    """
    Envia um email de recuperação de senha via Supabase.
    """
    try:
        response = supabase.auth.reset_password_email(request.email)
        return {
            "success": True,
            "message": "Email de recuperação enviado com sucesso."
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail="Erro ao enviar email de recuperação.")

