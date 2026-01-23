# API de Clima - Consulta em Tempo Real
Projeto desenvolvido para consultar dados meteorológicos em tempo real, consumindo a API OpenWeatherMap com backend em Python e frontend responsivo.

## Tecnologias
- **Python 3.8+** / **FastAPI**
- **Uvicorn** (Servidor ASGI)
- **HTML5 / CSS3 / JavaScript**
- **OpenWeatherMap API**

## Como Rodar

### Backend
```bash
cd clima-app/backend
pip install -r requirements.txt
python app.py
```
Teste a API em: http://localhost:8000/clima?cidade=São%20Paulo

### Frontend
```bash
cd clima-app/frontend
python -m http.server 5500
```
Acesse: http://localhost:5500

## Deploy
- **Backend:** https://api-clima-zeta-ten.vercel.app
- **Frontend:** Configure na Vercel com Root Directory `clima-app/frontend`

