import os
from celery import Celery
from celery.schedules import crontab

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")

celery_app = Celery(
    "solara_auto_worker",
    broker=redis_url,
    backend=redis_url,
    include=["backend.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="America/Sao_Paulo",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=3600,
    worker_max_tasks_per_child=200,
    task_acks_late=True,
)

celery_app.conf.beat_schedule = {
    "verificar-leads-inativos-diarios": {
        "task": "tasks.check_inactive_auto_leads",
        "schedule": crontab(hour=9, minute=0),
    },
}

if __name__ == "__main__":
    celery_app.start()
