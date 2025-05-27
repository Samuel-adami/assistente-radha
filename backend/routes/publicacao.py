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
    if input.formato.lower() == "post único":
        prompt = (
            f"Crie um post completo no formato {input.formato} sobre {input.tema}. "
            f"Objetivo: {input.objetivo}. Inclua: \n"
            "- Slide descritivo\n"
            "- Legenda para o slide\n"
            "- Legenda geral com CTA\n"
            "- Hashtags relevantes\n"
            "- Sugestão de imagem (por exemplo, uma cozinha planejada)\n"
            "- Sugestão de música sem direitos autorais (Pixabay)"
        )
    else:
        prompt = (
            f"Crie {input.quantidade} publicações no formato {input.formato} sobre {input.tema}. "
            f"Objetivo: {input.objetivo}. Inclua legenda, CTA, roteiro visual, música sem direitos autorais do Pixabay, "
            f"sugestão de imagens (incluindo uma cozinha planejada)."
        )
    resposta = await gerar_resposta(prompt, input.id_assistant)
    return {"publicacao": resposta}