from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from middleware import tenant_middleware
from routes import public_routes, admin_routes, auth_routes, payment_routes, auto_video_routes, superadmin_routes
from config import get_settings
from dotenv import load_dotenv
import os
import re

load_dotenv()

settings = get_settings()

app = FastAPI(
    title="Solara Auto API",
    description="API para plataforma SaaS de revenda de veículos",
    version="1.0.0"
)

# CORS Configuration
# Em dev: libera apenas localhost (qualquer porta) — wildcard "*" é inválido com credentials.
# Em prod: o domínio base e seus subdomínios (lojas).
if settings.ENVIRONMENT == "development":
    allowed_origins = []
    allowed_origin_regex = r"^http://(localhost|127\.0\.0\.1)(:\d+)?$"
else:
    allowed_origins = [f"https://{settings.BASE_DOMAIN}"]
    allowed_origin_regex = rf"^https://([a-z0-9-]+\.)?{re.escape(settings.BASE_DOMAIN)}$"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Tenant Middleware
app.middleware("http")(tenant_middleware)

os.makedirs("outputs", exist_ok=True)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

# Routes
app.include_router(public_routes.router, prefix="/api/v1", tags=["public"])
app.include_router(admin_routes.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(auth_routes.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(payment_routes.router, tags=["payments"])
app.include_router(auto_video_routes.router, prefix="/api/v1/auto-video", tags=["auto-video"])
app.include_router(superadmin_routes.router, prefix="/api/v1/superadmin", tags=["superadmin"])


@app.get("/health")
async def health_check():
    from services.auto_video import job_store
    if job_store.is_redis_enabled():
        job_backend = "redis" if job_store.ping() else "redis-unreachable"
    else:
        job_backend = "memory"
    return {"status": "ok", "version": "1.0.0", "job_store": job_backend}


# ============================================
# Servir o frontend buildado (deploy monorepo num serviço só).
# Só ativa se a pasta existir — não afeta o desenvolvimento local.
# ============================================
FRONTEND_DIST = os.getenv(
    "FRONTEND_DIST",
    os.path.join(os.path.dirname(__file__), "static"),
)

if os.path.isdir(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Não intercepta a API / health / outputs (já roteados acima).
        if full_path.startswith(("api/", "health", "outputs/", "docs", "redoc", "openapi.json")):
            return FileResponse(os.path.join(FRONTEND_DIST, "index.html"), status_code=404)
        # Normaliza e garante que o arquivo resolvido fica DENTRO do dist
        # (evita path traversal do tipo ../../etc/passwd).
        candidate = os.path.normpath(os.path.join(FRONTEND_DIST, full_path))
        dist_root = os.path.abspath(FRONTEND_DIST)
        if (
            full_path
            and os.path.abspath(candidate).startswith(dist_root + os.sep)
            and os.path.isfile(candidate)
        ):
            return FileResponse(candidate)
        # SPA fallback: qualquer rota do React devolve o index.html
        return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
