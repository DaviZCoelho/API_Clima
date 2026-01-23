# API de Clima - Consulta em Tempo Real
Projeto desenvolvido para consultar dados meteorológicos em tempo real, consumindo a API OpenWeatherMap com backend em Python e frontend responsivo.

## Tecnologias
- **Python 3.8+** / **FastAPI**
- **Uvicorn** (Servidor ASGI)
- **HTML5 / CSS3 / JavaScript Vanilla**
- **OpenWeatherMap API**

## Como Rodar

### Backend
```bash
cd clima-app/backend
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

### Frontend
```bash
cd clima-app/frontend
python -m http.server 5500
```
Acesse: http://localhost:5500
