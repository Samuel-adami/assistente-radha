from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_service import gerar_resposta

router = APIRouter(prefix="/nova-campanha", tags=["Campanhas"])

class CampanhaInput(BaseModel):
    tema: str
    objetivo: str
    publico_alvo: str
    orcamento: float
    duracao: str
    id_assistant: str = None

@router.post("/")
async def criar_campanha(input: CampanhaInput):
    prompt = (
        f"Crie uma campanha para {input.tema}. "
        f"Objetivo: {input.objetivo}. "
        f"Público: {input.publico_alvo}. "
        f"Orçamento: R${input.orcamento}. "
        f"Duração: {input.duracao}. "
        "Inclua: conteúdos criativos, CTA impactante, roteiros para landing pages, posts e reels."
    )
    resposta = await gerar_resposta(prompt, input.id_assistant, contexto='campanha')
    return {"campanha": resposta}