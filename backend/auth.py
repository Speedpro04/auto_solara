from fastapi import Header, HTTPException, Depends
from database import supabase
from config import get_settings


async def get_current_user(authorization: str = Header(None)):
    """
    Valida o token JWT do Supabase enviado no header Authorization.
    Retorna o usuário autenticado (auth.users) ou lança 401.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token de autenticação ausente")

    token = authorization.split(" ", 1)[1]

    try:
        user_response = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    if not user_response or not user_response.user:
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    return user_response.user


async def get_current_store(user=Depends(get_current_user)):
    """
    Resolve a loja do usuário autenticado a partir do user_id do token
    (NUNCA do header X-Store-Slug). Retorna o vínculo em store_users.
    """
    response = (
        supabase.table("store_users")
        .select("store_id, role, email")
        .eq("id", user.id)
        .execute()
    )

    if not response.data:
        raise HTTPException(status_code=403, detail="Usuário não vinculado a nenhuma loja")

    store_user = response.data[0]

    # Verifica se a loja está ativa. Faz o bloqueio do superadmin (active=false)
    # ter efeito real na API — antes o toggle não impedia o acesso.
    store = (
        supabase.table("stores")
        .select("active")
        .eq("id", store_user["store_id"])
        .execute()
    )
    if store.data and store.data[0].get("active") is False:
        raise HTTPException(status_code=403, detail="Loja desativada. Entre em contato com o suporte.")

    return store_user


async def get_current_store_id(store=Depends(get_current_store)) -> str:
    """Atalho que devolve apenas o store_id confiável do usuário autenticado."""
    return store["store_id"]


async def get_superadmin(user=Depends(get_current_user)):
    """Garante que o usuário autenticado é um super admin (lista em SUPERADMIN_EMAILS)."""
    allowed = [
        e.strip().lower()
        for e in (get_settings().SUPERADMIN_EMAILS or "").split(",")
        if e.strip()
    ]
    if not allowed or (user.email or "").lower() not in allowed:
        raise HTTPException(status_code=403, detail="Acesso restrito ao super admin")
    return user
