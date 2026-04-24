import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv("C:\\API_AUTO_S\\.env")

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, key)

try:
    print("Tentando insert de teste para validar owner_id...")
    res = supabase.table("stores").insert({"owner_id": "00000000-0000-0000-0000-000000000000", "name": "Teste"}).execute()
    print("Insert funcionou (inesperado):", res.data)
except Exception as e:
    print("ERRO CAPTURADO NO INSERT:", e)

try:
    print("\nTentando buscar todas as tabelas do schema public...")
    # Tenta usar o RPC nativo do supabase se existir (raro)
    # Mas podemos tentar ler a tabela de schemas via REST se houver permissão
    res = supabase.table("stores").select("*").limit(0).execute()
    print("Tabela 'stores' acessível.")
except Exception as e:
    print("Tabela 'stores' inacessível:", e)
