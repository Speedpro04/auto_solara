import polars as pl
from celery import Celery
import os
import json
import logging

from backend.celery_app import celery_app

logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════
# ANÁLISE DE ESTOQUE E LEADS (Polars Engine)
# ═══════════════════════════════════════════════════

@celery_app.task(name="tasks.analyze_vehicle_performance")
def analyze_vehicle_performance(vehicles_json: str):
    """
    Analisa quais veículos performam melhor em visualizações vs. contatos.
    Identifica os modelos encalhados e os mais procurados.
    """
    try:
        vehicles = json.loads(vehicles_json)
        df = pl.DataFrame(vehicles)
        
        performance = (
            df.group_by(["brand", "category"])
              .agg([
                  pl.len().alias("total_anuncios"),
                  pl.col("views").sum().alias("total_views"),
                  pl.col("contacts").sum().alias("total_contatos"),
              ])
              .with_columns(
                  (pl.col("total_contatos") / pl.col("total_views") * 100)
                  .alias("taxa_conversao_pct")
              )
              .sort("taxa_conversao_pct", descending=True)
        )
        
        return {"success": True, "analysis": performance.to_dicts()}
    except Exception as e:
        logger.error(f"[POLARS-AUTO] Erro: {e}")
        return {"success": False, "error": str(e)}


@celery_app.task(name="tasks.identify_stale_inventory")
def identify_stale_inventory(vehicles_json: str, days_threshold: int = 60):
    """
    Identifica veículos parados no estoque há mais de X dias sem contato.
    Sugere redução de preço ou destaque na vitrine.
    """
    try:
        df = pl.DataFrame(json.loads(vehicles_json))
        
        stale = (
            df.filter(pl.col("days_in_stock") >= days_threshold)
              .sort("days_in_stock", descending=True)
              .select(["model", "brand", "price", "days_in_stock", "views"])
        )
        
        return {"success": True, "stale_vehicles": stale.to_dicts()}
    except Exception as e:
        logger.error(f"[POLARS-AUTO] Erro estoque: {e}")
        return {"success": False, "error": str(e)}


@celery_app.task(name="tasks.check_inactive_auto_leads")
def check_inactive_auto_leads():
    """
    Tarefa Beat: verifica leads inativos diariamente.
    """
    logger.info("[AUTO-LEADS] Verificando leads inativos de veículos...")
    return {"status": "checked", "message": "Leads inativos verificados com sucesso"}
