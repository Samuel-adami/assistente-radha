
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
        f"Crie {input.quantidade} publicacoes no formato {input.formato} sobre {input.tema}. "
        f"Objetivo: {input.objetivo}. "
        f"Inclua legenda, CTA, roteiro visual, musica sem direitos autorais do Pixabay, "
        f"sugestao de imagens (incluindo uma cozinha planejada)."
    )
    resposta = await gerar_resposta(prompt, input.id_assistant)
    return {"publicacao": resposta}
