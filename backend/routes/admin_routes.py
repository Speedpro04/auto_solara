from fastapi import APIRouter, HTTPException, Request, UploadFile, File
from pydantic import BaseModel
from typing import Optional
from database import supabase
import os

router = APIRouter()


# ============================================
# Models
# ============================================

class VehicleCreate(BaseModel):
    title: str
    slug: Optional[str] = None
    type: str
    brand: str
    year: int
    km: int
    price: float
    description: Optional[str] = ""
    status: str = "available"
    store_id: str


class VehicleUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    type: Optional[str] = None
    brand: Optional[str] = None
    year: Optional[int] = None
    km: Optional[int] = None
    price: Optional[float] = None
    description: Optional[str] = None
    status: Optional[str] = None


class MediaCreate(BaseModel):
    url: str
    type: str
    order: int = 0
    size_bytes: int


class StoreUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    logo_url: Optional[str] = None


# ============================================
# Dashboard
# ============================================

@router.get("/dashboard")
async def get_dashboard(request: Request):
    """Resumo da loja: veículos, views, contatos"""
    store_id = request.state.store_id

    # Total de veículos
    vehicles_response = supabase.table("vehicles").select("id", count="exact").eq("store_id", store_id).execute()
    total_vehicles = vehicles_response.count

    # Veículos disponíveis
    available_response = supabase.table("vehicles").select("id", count="exact").eq("store_id", store_id).eq("status", "available").execute()
    available_vehicles = available_response.count

    # Total de views
    views_response = supabase.table("vehicle_views").select("id", count="exact").eq("store_id", store_id).execute()
    total_views = views_response.count

    # Total de contatos
    contacts_response = supabase.table("vehicle_contacts").select("id", count="exact").eq("store_id", store_id).execute()
    total_contacts = contacts_response.count

    return {
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "total_views": total_views,
        "total_contacts": total_contacts
    }


# ============================================
# Vehicles CRUD
# ============================================

@router.get("/vehicles")
async def list_admin_vehicles(request: Request):
    """Lista todos os veículos da loja (admin)"""
    store_id = request.state.store_id

    response = supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
    ).eq("store_id", store_id).order("created_at", desc=True).execute()

    vehicles = response.data

    # Buscar mídias para cada veículo
    for vehicle in vehicles:
        media_response = supabase.table("vehicle_media").select(
            "id, vehicle_id, store_id, url, type, order, size_bytes"
        ).eq("vehicle_id", vehicle["id"]).order("order").execute()
        vehicle["media"] = media_response.data

    return vehicles


@router.get("/vehicles/{vehicle_id}")
async def get_admin_vehicle(request: Request, vehicle_id: str):
    """Detalhes de um veículo (admin)"""
    store_id = request.state.store_id

    response = supabase.table("vehicles").select(
        "id, store_id, slug, title, type, brand, year, km, price, description, status, created_at"
    ).eq("id", vehicle_id).eq("store_id", store_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    vehicle = response.data[0]

    # Buscar mídias
    media_response = supabase.table("vehicle_media").select(
        "id, vehicle_id, store_id, url, type, order, size_bytes"
    ).eq("vehicle_id", vehicle_id).order("order").execute()

    vehicle["media"] = media_response.data

    return vehicle


@router.post("/vehicles")
async def create_vehicle(request: Request, vehicle: VehicleCreate):
    """Cadastrar novo veículo"""
    store_id = request.state.store_id

    # Validar se store_id corresponde
    if vehicle.store_id != store_id:
        raise HTTPException(status_code=403, detail="Loja inválida")

    # Validar limites do plano (simplificado)
    # Em produção, verificar plano e contar veículos ativos

    import re
    def slugify(s):
        s = s.lower()
        s = re.sub(r'[^\w\s-]', '', s)
        s = re.sub(r'[\s_-]+', '-', s)
        s = re.sub(r'^-+|-+$', '', s)
        return s

    slug = vehicle.slug or slugify(f"{vehicle.brand}-{vehicle.title}-{vehicle.year}")

    response = supabase.table("vehicles").insert({
        "store_id": vehicle.store_id,
        "slug": slug,
        "title": vehicle.title,
        "type": vehicle.type,
        "brand": vehicle.brand,
        "year": vehicle.year,
        "km": vehicle.km,
        "price": vehicle.price,
        "description": vehicle.description,
        "status": vehicle.status
    }).execute()

    return response.data[0] if response.data else None


@router.put("/vehicles/{vehicle_id}")
async def update_vehicle(request: Request, vehicle_id: str, vehicle: VehicleUpdate):
    """Editar veículo"""
    store_id = request.state.store_id

    # Verificar se veículo existe e pertence à loja
    existing = supabase.table("vehicles").select("id").eq("id", vehicle_id).eq("store_id", store_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    # Filtrar campos não nulos
    update_data = vehicle.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    response = supabase.table("vehicles").update(update_data).eq("id", vehicle_id).execute()

    return response.data[0] if response.data else None


@router.delete("/vehicles/{vehicle_id}")
async def delete_vehicle(request: Request, vehicle_id: str):
    """Remover veículo"""
    store_id = request.state.store_id

    # Verificar se veículo existe e pertence à loja
    existing = supabase.table("vehicles").select("id").eq("id", vehicle_id).eq("store_id", store_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    supabase.table("vehicles").delete().eq("id", vehicle_id).execute()

    return {"message": "Veículo removido com sucesso"}


@router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    """Upload de arquivo para o Supabase Storage"""
    store_id = request.state.store_id
    
    # Ler conteúdo do arquivo
    file_content = await file.read()
    file_ext = os.path.splitext(file.filename)[1]
    
    # Gerar path único: stores/{store_id}/{uuid}{ext}
    import uuid
    file_path = f"{store_id}/{uuid.uuid4()}{file_ext}"
    
    # Upload para o Supabase Storage (bucket: solara_media)
    try:
        # Nota: O cliente supabase-py as vezes precisa do storage_client diretamente
        response = supabase.storage.from_("solara_media").upload(
            path=file_path,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        # Obter URL pública
        url_response = supabase.storage.from_("solara_media").get_public_url(file_path)
        
        return {"url": url_response, "path": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no upload: {str(e)}")


# ============================================
# Media Management
# ============================================

@router.post("/vehicles/{vehicle_id}/media")
async def upload_media(request: Request, vehicle_id: str, media: MediaCreate):
    """Adicionar mídia a um veículo"""
    store_id = request.state.store_id

    # Verificar se veículo existe
    vehicle = supabase.table("vehicles").select("id").eq("id", vehicle_id).eq("store_id", store_id).execute()
    if not vehicle.data:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    response = supabase.table("vehicle_media").insert({
        "vehicle_id": vehicle_id,
        "store_id": store_id,
        "url": media.url,
        "type": media.type,
        "order": media.order,
        "size_bytes": media.size_bytes
    }).execute()

    return response.data[0] if response.data else None


@router.delete("/media/{media_id}")
async def delete_media(request: Request, media_id: str):
    """Remover mídia"""
    store_id = request.state.store_id

    # Verificar se mídia existe e pertence à loja
    existing = supabase.table("vehicle_media").select("id, url").eq("id", media_id).eq("store_id", store_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Mídia não encontrada")

    # Deletar do Storage (opcional)
    try:
        url = existing.data[0]["url"]
        # Extrair path do URL
        # Implementar deleção do Supabase Storage
    except:
        pass

    supabase.table("vehicle_media").delete().eq("id", media_id).execute()

    return {"message": "Mídia removida com sucesso"}


# ============================================
# Store Profile
# ============================================

@router.get("/store")
async def get_store_profile(request: Request):
    """Obter dados da loja (admin)"""
    store_id = request.state.store_id

    response = supabase.table("stores").select(
        "id, slug, name, logo_url, phone, city, plan, active, created_at"
    ).eq("id", store_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Loja não encontrada")

    return response.data[0]


@router.put("/store")
async def update_store_profile(request: Request, store: StoreUpdate):
    """Atualizar dados e logo da loja"""
    store_id = request.state.store_id

    update_data = store.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    response = supabase.table("stores").update(update_data).eq("id", store_id).execute()

    return response.data[0] if response.data else None
