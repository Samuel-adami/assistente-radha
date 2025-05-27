from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_service import gerar_resposta

router = APIRouter(prefix="/nova-publicacao", tags=["Publicacoes"])

class PublicacaoInput(BaseModel):
    tema: str
    objetivo: str
    formato: str
    quantidade: int
    id_assistant: str = None

@router.post("/")
async def criar_publicacao(input: PublicacaoInput):
    prompt = (
        f"Crie {input.quantidade} publicações no formato {input.formato} sobre {input.tema}. "
        f"Objetivo: {input.objetivo}. "
        "Inclua para cada: legenda com CTA, roteiro visual, sugestão de imagem (ex.: cozinha planejada), "
        "música sem direitos autorais do Pixabay e hashtags."
    )
    resposta = await gerar_resposta(prompt, input.id_assistant, contexto='publicacao')
    return {"publicacao": resposta}