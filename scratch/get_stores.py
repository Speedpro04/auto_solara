import requests
try:
    response = requests.get('http://localhost:8000/api/v1/stores')
    print(response.json())
except Exception as e:
    print(f"Erro: {e}")
