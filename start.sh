#!/bin/bash

# Número de workers do backend. Padrão 1 (seguro mesmo sem Redis).
# Com REDIS_URL configurado, pode subir (ex: WEB_CONCURRENCY=4) para escalar.
WORKERS="${WEB_CONCURRENCY:-1}"

# Sobe o backend (uvicorn) em background e guarda o PID.
cd /app/backend && uvicorn main:app --host 0.0.0.0 --port 8000 --workers "$WORKERS" &
BACKEND_PID=$!

# Sobe o Caddy em background e guarda o PID.
caddy run --config /app/Caddyfile &
CADDY_PID=$!

# Se QUALQUER um dos dois processos morrer, derruba o outro e sai com erro.
# Sem isso, o uvicorn podia morrer silenciosamente e o Caddy seguia de pé
# servindo só o frontend — o container parecia saudável mas a API dava 502.
# Saindo com código != 0, o orquestrador (EasyPanel) reinicia o container.
wait -n
echo "[start.sh] Um processo essencial encerrou — derrubando o container para reiniciar."
kill "$BACKEND_PID" "$CADDY_PID" 2>/dev/null
exit 1
