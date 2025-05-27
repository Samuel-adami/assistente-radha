from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configuração de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://212.85.13.74:37017"],  # Durante os testes, pode liberar geral. Em produção: ["https://seudominio.com"]
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