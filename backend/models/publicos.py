from fastapi import APIRouter
from typing import List
from models.publicos import PublicoAlvo

router = APIRouter(prefix="/publicos", tags=["Publicos"])

publicos_db: List[PublicoAlvo] = []

@router.post("/")
async def adicionar_publico(publico: PublicoAlvo):
    publicos_db.append(publico)
    return {"mensagem": "Público adicionado com sucesso"}

@router.get("/")
async def listar_publicos():
    return publicos_db