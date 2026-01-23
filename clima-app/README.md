# API de Clima - Consulta em Tempo Real
Projeto desenvolvido para consultar dados meteorológicos em tempo real, consumindo a API OpenWeatherMap com backend em Python e frontend responsivo.

## Tecnologias
- **Python 3.8+** / **FastAPI**
- **Uvicorn** (Servidor ASGI)
- **HTML5 / CSS3 / JavaScript Vanilla**
- **OpenWeatherMap API**

## Diferenciais Aplicados
- **Design Responsivo:** Interface SaaS profissional e minimalista.
- **Detecção Automática de Ambiente:** Frontend detecta localhost ou produção automaticamente.
- **Tratamento de Erros:** Mensagens amigáveis para cidade não encontrada, timeout e falhas de conexão.
- **CORS Configurado:** Backend preparado para requisições cross-origin.

## Como Rodar

### Backend
```bash
cd clima-app/backend
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8000
```

> **Nota:** O comando `python -m pip` garante que o pip correto seja usado. O `--reload` reinicia o servidor automaticamente quando há alterações no código.

**Endpoints disponíveis:**
- API: http://localhost:8000
- Documentação Swagger: http://localhost:8000/docs
- Documentação ReDoc: http://localhost:8000/redoc
- Teste: http://localhost:8000/clima?cidade=São%20Paulo

### Frontend
```bash
cd clima-app/frontend
python -m http.server 5500
```
Acesse: http://localhost:5500

## Configuração da API Key

Para usar a aplicação, você precisa de uma chave da API do OpenWeatherMap:

1. Acesse https://openweathermap.org/api
2. Crie uma conta gratuita
3. Copie sua API Key em "My API Keys"
4. Edite o arquivo `backend/app.py` e substitua o valor da variável `API_KEY`

## Deploy
- **Backend:** https://api-clima-zeta-ten.vercel.app
- **Frontend:** Configure na Vercel com Root Directory `clima-app/frontend`
