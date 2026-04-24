from fastapi import Request, HTTPException
from database import supabase


async def tenant_middleware(request: Request, call_next):
    """
    Extrai o subdomínio do header Host e injeta store_id no contexto da request.
    """
    # Pular rotas de health check
    if request.url.path in ["/health", "/docs", "/redoc", "/openapi.json"]:
        return await call_next(request)

    # Extrair subdomínio do header Host (removendo a porta se existir)
    host_raw = request.headers.get("host", "")
    host = host_raw.split(":")[0]
    x_store_slug = request.headers.get("X-Store-Slug")

    store_id = None
    store = None

    # Tentar obter store_id do header X-Store-Slug ou do subdomínio
    if x_store_slug:
        response = supabase.table("stores").select("id, slug, active").eq("slug", x_store_slug).execute()
        if response.data:
            store = response.data[0]
            store_id = store["id"]
    else:
        # Extrair do host (ex: loja.solaraauto.com.br -> loja ou loja.localhost -> loja)
        parts = host.split(".")
        subdomain = parts[0] if len(parts) >= 2 else None
        
        # Se for localhost ou não houver subdomínio, forçar a loja 'auto-r' para manutenção
        if not subdomain or subdomain in ["www", "localhost", "127", "0"]:
            subdomain = "auto-r"
            
        response = supabase.table("stores").select("id, slug, active").eq("slug", subdomain).execute()
        if response.data:
            store = response.data[0]
            store_id = store["id"]

    # Injetar store_id no state da request
    request.state.store_id = store_id
    request.state.store = store

    # Para rotas públicas, verificar se a loja existe e está ativa
    # Temporariamente desativado para revisão do usuário
    # if not request.url.path.startswith("/admin") and not request.url.path.startswith("/health"):
    #     if store and not store.get("active"):
    #         raise HTTPException(status_code=403, detail="Loja não está ativa")

    response = await call_next(request)
    return response
