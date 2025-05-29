from fastapi import APIRouter, Depends
from pydantic import BaseModel
from services.openai_service import gerar_resposta
from security import verificar_autenticacao

router = APIRouter(prefix="/nova-publicacao", tags=["Publicacoes"])

# ✅ Apenas marketing e diretores podem criar publicações
autorizacao = verificar_autenticacao(["Marketing", "Diretoria"])

class PublicacaoInput(BaseModel):
    tema: str
    objetivo: str
    formato: str
    quantidade: int
    id_assistant: str = None

@router.post("/")
async def criar_publicacao(input: PublicacaoInput, user=Depends(autorizacao)):
    formato = input.formato.lower()

    introducao = (
        f"Você está ajudando {user['nome']} ({user['cargo']}) a planejar conteúdos estratégicos para redes sociais.\n\n"
        f"Tema: {input.tema}\n"
        f"Objetivo: {input.objetivo}\n"
        f"Formato: {input.formato}\n"
        f"Quantidade: {input.quantidade}\n\n"
    )

    if formato == "post único":
        corpo = (
            f"Crie {input.quantidade} publicações no formato post único sobre {input.tema}. "
            f"Para cada uma, elabore:\n"
            f"1. Legenda com CTA e hashtags;\n"
            f"2. Sugestão de imagem (incluindo uma cozinha planejada);\n"
            f"3. Sugestão de música sem direitos autorais do Pixabay."
        )

    elif formato == "post carrossel":
        corpo = (
            f"Crie {input.quantidade} carrosséis sobre {input.tema}.\n"
            f"Para cada carrossel, elabore:\n"
            f"1. Título impactante;\n"
            f"2. Texto para cada slide (máx. 100 caracteres);\n"
            f"3. Sugestão de imagem por slide;\n"
            f"4. Legenda geral com CTA e hashtags (até 300 caracteres)."
        )

    elif formato == "reels":
        corpo = (
            f"Crie {input.quantidade} roteiros de Reels sobre {input.tema}.\n"
            f"Inclua:\n"
            f"1. Roteiro audiovisual detalhado;\n"
            f"2. Música do Pixabay;\n"
            f"3. Texto para vídeo (legenda sobreposta);\n"
            f"4. Legenda completa com CTA e hashtags."
        )

    elif formato == "story":
        corpo = (
            f"Crie {input.quantidade} roteiros de Story sobre {input.tema}.\n"
            f"Inclua:\n"
            f"1. Roteiro visual (imagem ou vídeo);\n"
            f"2. Texto para criativo;\n"
            f"3. Sugestão de sticker/interação;\n"
            f"4. Legenda com CTA e hashtags."
        )

    else:
        corpo = (
            f"Crie {input.quantidade} conteúdos no formato {input.formato} sobre {input.tema}.\n"
            f"Inclua legenda, CTA, roteiro visual, imagem e trilha sonora sem direitos autorais."
        )

    prompt = introducao + corpo

    resposta = await gerar_resposta(
        prompt, 
        input.id_assistant, 
        contexto='publicacao', 
        tema=input.tema
    )

    return {"publicacao": resposta}