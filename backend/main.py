from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import chat, campanha, publicacao, publicos

app = FastAPI(
    title="Radha Executor",
    version="1.0"
)

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://sara.radhadigital.com.br"],  # Em produção: ["https://seudominio.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão das rotas
app.include_router(chat.router)
app.include_router(campanha.router)
app.include_router(publicacao.router)
app.include_router(publicos.router)

@app.get("/")
async def root():
    return {"message": "Radha Executor API funcionando!"}
