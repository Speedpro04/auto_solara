from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from pydantic import BaseModel
from typing import Optional
from database import supabase
from auth import get_current_store_id
import os

router = APIRouter()

# Limites de upload
MAX_UPLOAD_BYTES = 50 * 1024 * 1024  # 50 MB
ALLOWED_UPLOAD_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "video/mp4", "video/quicktime",
}


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
async def get_dashboard(store_id: str = Depends(get_current_store_id)):
    """Resumo da loja: veículos, valor em estoque, ticket médio, leads e views"""

    # Total de veículos
    vehicles_response = supabase.table("vehicles").select("id", count="exact").eq("store_id", store_id).execute()
    total_vehicles = vehicles_response.count

    # Veículos disponíveis (com preços para valor em estoque e ticket médio)
    available_response = supabase.table("vehicles").select("price").eq("store_id", store_id).eq("status", "available").execute()
    available_data = available_response.data or []
    available_vehicles = len(available_data)
    prices = [float(v["price"]) for v in available_data if v.get("price") is not None]
    total_portfolio_value = sum(prices)
    average_price = (total_portfolio_value / len(prices)) if prices else 0

    # Total de views
    views_response = supabase.table("vehicle_views").select("id", count="exact").eq("store_id", store_id).execute()
    total_views = views_response.count

    # Total de contatos (= leads de WhatsApp)
    contacts_response = supabase.table("vehicle_contacts").select("id", count="exact").eq("store_id", store_id).execute()
    total_contacts = contacts_response.count

    return {
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "total_views": total_views,
        "total_contacts": total_contacts,
        "total_leads": total_contacts,
        "total_portfolio_value": total_portfolio_value,
        "average_price": average_price,
    }


@router.get("/reports")
async def get_reports(period: str = "30D", store_id: str = Depends(get_current_store_id)):
    """Analytics reais da loja para a tela de Relatórios."""
    from datetime import datetime, timedelta, timezone
    from collections import defaultdict

    days_map = {"7D": 7, "15D": 15, "30D": 30, "90D": 90}
    days = days_map.get(period, 30)
    start_iso = (datetime.now(timezone.utc) - timedelta(days=days)).isoformat()

    views = (supabase.table("vehicle_views").select("vehicle_id, viewed_at")
             .eq("store_id", store_id).gte("viewed_at", start_iso).execute().data) or []
    contacts = (supabase.table("vehicle_contacts").select("vehicle_id, contacted_at")
                .eq("store_id", store_id).gte("contacted_at", start_iso).execute().data) or []
    vehicles = (supabase.table("vehicles").select("id, title, type, status")
                .eq("store_id", store_id).execute().data) or []

    vehicle_by_id = {v["id"]: v for v in vehicles}

    # Série diária: visitas e leads por dia
    day_views, day_leads = defaultdict(int), defaultdict(int)
    for v in views:
        day_views[(v.get("viewed_at") or "")[:10]] += 1
    for c in contacts:
        day_leads[(c.get("contacted_at") or "")[:10]] += 1
    all_days = sorted(d for d in set(list(day_views) + list(day_leads)) if d)
    traffic = [{"day": d[5:], "visitas": day_views.get(d, 0), "leads": day_leads.get(d, 0)} for d in all_days]

    total_views = len(views)
    total_leads = len(contacts)
    conversion = round(total_leads / total_views * 100, 1) if total_views else 0
    active_vehicles = sum(1 for v in vehicles if v.get("status") == "available")

    # Leads por categoria de veículo
    label_map = {"carro": "Carros", "moto": "Motos"}
    type_leads = defaultdict(int)
    for c in contacts:
        veh = vehicle_by_id.get(c["vehicle_id"])
        type_leads[veh["type"] if veh else "outros"] += 1
    leads_by_type = [{"name": label_map.get(k, k.title()), "leads": v}
                     for k, v in sorted(type_leads.items(), key=lambda x: -x[1])]

    # Top 4 veículos por visitas
    veh_views, veh_leads = defaultdict(int), defaultdict(int)
    for v in views:
        veh_views[v["vehicle_id"]] += 1
    for c in contacts:
        veh_leads[c["vehicle_id"]] += 1
    top_ids = sorted(vehicle_by_id, key=lambda vid: -veh_views.get(vid, 0))[:4]
    top_vehicles = []
    for vid in top_ids:
        vis, lds = veh_views.get(vid, 0), veh_leads.get(vid, 0)
        top_vehicles.append({
            "id": vid,
            "name": vehicle_by_id[vid]["title"],
            "visits": vis,
            "leads": lds,
            "conversion": f"{round(lds / vis * 100, 1)}%" if vis else "0%",
        })

    return {
        "summary": {
            "total_views": total_views,
            "total_leads": total_leads,
            "active_vehicles": active_vehicles,
            "conversion": conversion,
        },
        "traffic": traffic,
        "leads_by_type": leads_by_type,
        "top_vehicles": top_vehicles,
    }


# ============================================
# Vehicles CRUD
# ============================================

@router.get("/vehicles")
async def list_admin_vehicles(store_id: str = Depends(get_current_store_id)):
    """Lista todos os veículos da loja (admin)"""

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
async def get_admin_vehicle(vehicle_id: str, store_id: str = Depends(get_current_store_id)):
    """Detalhes de um veículo (admin)"""

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
async def create_vehicle(vehicle: VehicleCreate, store_id: str = Depends(get_current_store_id)):
    """Cadastrar novo veículo"""
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
async def update_vehicle(vehicle_id: str, vehicle: VehicleUpdate, store_id: str = Depends(get_current_store_id)):
    """Editar veículo"""

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
async def delete_vehicle(vehicle_id: str, store_id: str = Depends(get_current_store_id)):
    """Remover veículo"""

    # Verificar se veículo existe e pertence à loja
    existing = supabase.table("vehicles").select("id").eq("id", vehicle_id).eq("store_id", store_id).execute()
    if not existing.data:
        raise HTTPException(status_code=404, detail="Veículo não encontrado")

    supabase.table("vehicles").delete().eq("id", vehicle_id).execute()

    return {"message": "Veículo removido com sucesso"}


@router.post("/upload")
async def upload_file(file: UploadFile = File(...), store_id: str = Depends(get_current_store_id)):
    """Upload de arquivo para o Supabase Storage"""

    # Ler conteúdo do arquivo
    file_content = await file.read()

    # Validação de tamanho e tipo
    if len(file_content) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Arquivo muito grande (máx 50MB)")
    if file.content_type not in ALLOWED_UPLOAD_TYPES:
        raise HTTPException(status_code=415, detail="Tipo de arquivo não permitido")

    file_ext = os.path.splitext(file.filename)[1]
    
    # Gerar path único: stores/{store_id}/{uuid}{ext}
    import uuid
    file_path = f"{store_id}/{uuid.uuid4()}{file_ext}"
    
    # Upload para o Supabase Storage (bucket: autoracer_media)
    try:
        # Nota: O cliente supabase-py as vezes precisa do storage_client diretamente
        response = supabase.storage.from_("autoracer_media").upload(
            path=file_path,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        # Obter URL pública
        url_response = supabase.storage.from_("autoracer_media").get_public_url(file_path)
        
        return {"url": url_response, "path": file_path}
    except Exception:
        raise HTTPException(status_code=500, detail="Erro ao enviar o arquivo. Tente novamente.")


# ============================================
# Media Management
# ============================================

@router.post("/vehicles/{vehicle_id}/media")
async def upload_media(vehicle_id: str, media: MediaCreate, store_id: str = Depends(get_current_store_id)):
    """Adicionar mídia a um veículo"""

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
async def delete_media(media_id: str, store_id: str = Depends(get_current_store_id)):
    """Remover mídia"""

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
async def get_store_profile(store_id: str = Depends(get_current_store_id)):
    """Obter dados da loja (admin)"""

    response = supabase.table("stores").select(
        "id, slug, name, logo_url, phone, city, plan, active, created_at"
    ).eq("id", store_id).execute()

    if not response.data:
        raise HTTPException(status_code=404, detail="Loja não encontrada")

    return response.data[0]


@router.put("/store")
async def update_store_profile(store: StoreUpdate, store_id: str = Depends(get_current_store_id)):
    """Atualizar dados e logo da loja"""

    update_data = store.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="Nenhum dado para atualizar")

    response = supabase.table("stores").update(update_data).eq("id", store_id).execute()

    return response.data[0] if response.data else None
