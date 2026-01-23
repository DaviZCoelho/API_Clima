from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import requests
from typing import Optional
import os

app = FastAPI(
    title="API de Clima",
    description="API para consulta de clima usando OpenWeatherMap",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.environ.get("API_KEY", "Coloque sua key aqui")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def buscar_clima_openweather(cidade: str) -> dict:
    params = {
        "q": cidade,
        "appid": API_KEY,
        "units": "metric",
        "lang": "pt_br"
    }
    
    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        
        if response.status_code == 404:
            raise HTTPException(
                status_code=404,
                detail=f"Cidade '{cidade}' não encontrada. Verifique o nome e tente novamente."
            )
        
        if response.status_code == 401:
            raise HTTPException(
                status_code=500,
                detail="Erro de autenticação com a API. Verifique a chave de API."
            )
        
        response.raise_for_status()
        dados = response.json()
        return formatar_dados_clima(dados)
        
    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="Tempo limite excedido ao consultar o serviço de clima."
        )
    except requests.exceptions.RequestException as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao consultar o serviço de clima: {str(e)}"
        )

def formatar_dados_clima(dados: dict) -> dict:
    return {
        "cidade": dados.get("name", "Desconhecida"),
        "temperatura": round(dados["main"]["temp"], 1),
        "sensacao_termica": round(dados["main"]["feels_like"], 1),
        "umidade": dados["main"]["humidity"],
        "descricao_clima": dados["weather"][0]["description"].capitalize()
    }

@app.get("/")
async def root():
    return {
        "mensagem": "API de Consulta de Clima",
        "versao": "1.0.0",
        "documentacao": "/docs",
        "endpoint_clima": "/clima?cidade=NomeDaCidade"
    }

@app.get("/clima")
async def obter_clima(cidade: Optional[str] = Query(None, description="Nome da cidade")):
    if not cidade or cidade.strip() == "":
        raise HTTPException(
            status_code=400,
            detail="O parâmetro 'cidade' é obrigatório. Exemplo: /clima?cidade=São Paulo"
        )
    
    dados_clima = buscar_clima_openweather(cidade.strip())
    return dados_clima

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "clima-api"}

@app.get("/cidades")
async def buscar_cidades(q: str = Query(..., min_length=2, description="Termo de busca")):
    """
    Busca cidades pelo nome usando a API de Geocoding do OpenWeatherMap.
    Retorna uma lista de cidades com nome, estado e país.
    """
    geo_url = "http://api.openweathermap.org/geo/1.0/direct"
    params = {
        "q": q,
        "limit": 5,
        "appid": API_KEY
    }
    
    try:
        response = requests.get(geo_url, params=params, timeout=5)
        response.raise_for_status()
        dados = response.json()
        
        cidades = []
        for cidade in dados:
            nome = cidade.get("name", "")
            estado = cidade.get("state", "")
            pais = cidade.get("country", "")
            
            # Formatar: "Curitiba - PR, BR" ou "London, GB"
            if estado:
                texto = f"{nome} - {estado}, {pais}"
            else:
                texto = f"{nome}, {pais}"
            
            cidades.append({
                "nome": nome,
                "estado": estado,
                "pais": pais,
                "texto": texto
            })
        
        return cidades
        
    except requests.exceptions.RequestException:
        return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
