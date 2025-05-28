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
    formato = input.formato.lower()

    if formato == "post único":
        prompt = (
            f"Crie {input.quantidade} publicações no formato {input.formato} sobre {input.tema}. "
            f"Objetivo: {input.objetivo}. "
            f"Para cada uma, elabore: "
            f"1. Legenda completa com CTA e hashtags; "
            f"2. Sugestão de imagem (incluindo uma cozinha planejada); "
            f"3. Sugestão de música sem direitos autorais do Pixabay."
        )

    elif formato == "post carrossel":
        prompt = (
            f"Crie {input.quantidade} publicações no formato {input.formato} sobre {input.tema}. "
            f"Objetivo: {input.objetivo}. "
            f"Para cada carrossel, elabore: "
            f"1. Título impactante; "
            f"2. Legenda curta para cada slide (o que aparece no criativo); "
            f"3. Sugestão de imagem para cada slide, incluindo uma cozinha planejada; "
            f"4. Legenda completa da publicação com CTA e hashtags relevantes."
        )

    elif formato == "reels":
        prompt = (
            f"Crie {input.quantidade} roteiros de Reels sobre {input.tema}. "
            f"Objetivo: {input.objetivo}. "
            f"Para cada Reels, inclua: "
            f"1. Roteiro audiovisual detalhado; "
            f"2. Sugestão de músicas sem direitos autorais do Pixabay; "
            f"3. Legendas curtas que devem aparecer no vídeo (texto sobreposto); "
            f"4. Legenda completa da publicação com CTA e hashtags."
        )

    elif formato == "story":
        prompt = (
            f"Crie {input.quantidade} roteiros de Story sobre {input.tema}. "
            f"Objetivo: {input.objetivo}. "
            f"Para cada Story, elabore: "
            f"1. Roteiro visual (imagem ou vídeo); "
            f"2. Texto para aparecer no criativo; "
            f"3. Sugestão de sticker ou interação; "
            f"4. Legenda completa da publicação com CTA e hashtags."
        )

    else:
        prompt = (
            f"Crie {input.quantidade} publicações no formato {input.formato} sobre {input.tema}. "
            f"Objetivo: {input.objetivo}. "
            f"Inclua legenda completa, CTA, roteiro visual, sugestão de imagem e música sem direitos autorais."
        )

    resposta = await gerar_resposta(prompt, input.id_assistant)
    return {"publicacao": resposta}