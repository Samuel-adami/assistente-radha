
from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_service import gerar_resposta

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatInput(BaseModel):
    mensagem: str
    id_assistant: str = None

@router.post("/")
async def conversar(input: ChatInput):
    resposta = await gerar_resposta(input.mensagem, input.id_assistant)
    return {"resposta": resposta}
