from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_service import gerar_resposta
from services.embedding_service import buscar_contexto

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatInput(BaseModel):
    mensagem: str
    id_assistant: str = None

@router.post("/")
async def conversar(input: ChatInput):
    # 🔎 Buscar contexto relevante da base de conhecimento
    documentos = buscar_contexto

    # 📚 Incluir os documentos como parte do prompt
    contexto = "\n\n".join([doc.page_content for doc in documentos])
    prompt_com_contexto = f"""Responda com base nas informações abaixo (caso sejam úteis):

{contexto}

Pergunta: {input.mensagem}"""

    # 🤖 Gerar resposta com base no contexto
    resposta = await gerar_resposta(prompt_com_contexto, input.id_assistant)
    return {"resposta": resposta}