import os
import httpx
from typing import Optional

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

# Headers para upload binário no Storage (sem Content-Type JSON)
STORAGE_AUTH = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
}

STORAGE_BUCKET = "autoracer_media"


async def upload_video(local_path: str, store_id: str, job_id: str) -> str:
    """Sobe o MP4 renderizado para o Supabase Storage e retorna a URL pública.
    Torna o vídeo durável (sobrevive a restart) e acessível entre workers."""
    object_path = f"{store_id}/videos/{job_id}.mp4"

    with open(local_path, "rb") as fh:
        content = fh.read()

    async with httpx.AsyncClient(timeout=120) as client:
        res = await client.post(
            f"{SUPABASE_URL}/storage/v1/object/{STORAGE_BUCKET}/{object_path}",
            headers={**STORAGE_AUTH, "Content-Type": "video/mp4", "x-upsert": "true"},
            content=content,
        )
        res.raise_for_status()

    return f"{SUPABASE_URL}/storage/v1/object/public/{STORAGE_BUCKET}/{object_path}"


async def list_vehicles(store_id: str) -> list[dict]:
    """Retorna lista de veículos ativos da loja com thumbnail."""
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/vehicles",
            headers=HEADERS,
            params={
                "select": "id,brand,title,year,km,price,status",
                "store_id": f"eq.{store_id}",
                "status": "eq.available",
                "order": "created_at.desc",
                "limit": "50",
            },
        )
        res.raise_for_status()
        veiculos = res.json()

    # Busca primeira foto de cada veículo
    for v in veiculos:
        fotos = await _get_fotos(v["id"], limit=1)
        v["thumbnail"] = fotos[0] if fotos else None

    return veiculos


async def get_vehicle_with_photos(vehicle_id: str, store_id: str) -> Optional[dict]:
    """Retorna dados completos do veículo da loja + URLs das fotos do storage."""
    async with httpx.AsyncClient() as client:
        # Dados do veículo
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/vehicles",
            headers=HEADERS,
            params={
                "id": f"eq.{vehicle_id}",
                "store_id": f"eq.{store_id}",
                "select": "*",
                "limit": "1",
            },
        )
        res.raise_for_status()
        data = res.json()

    if not data:
        return None

    vehicle = data[0]
    vehicle["fotos"] = await _get_fotos(vehicle_id, limit=8)
    return vehicle


async def _get_fotos(vehicle_id: str, limit: int = 8) -> list[str]:
    """
    Busca URLs das fotos do veículo.
    """
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{SUPABASE_URL}/rest/v1/vehicle_media",
            headers=HEADERS,
            params={
                "vehicle_id": f"eq.{vehicle_id}",
                "type": "eq.image",  # só fotos — um vídeo no slideshow quebra o render
                "select": "url,order",
                "order": "order.asc",
                "limit": str(limit),
            },
        )
        res.raise_for_status()
        media_list = res.json()

    # Retorna URLs diretas conforme schema
    return [item["url"] for item in media_list]
