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
    contexto = buscar_contexto(input.mensagem)
    
    print("📚 Contexto carregado:\n", contexto)

    # 🧠 Estilo mais orientador e útil
    prompt_com_contexto = f"""
Você é a Sara, assistente oficial da Radha Ambientes Planejados.

Sua missão é orientar com clareza, simpatia e objetividade tanto os clientes quanto os colaboradores da Radha.

- Se for cliente, ajude com dúvidas sobre atendimento, produtos, serviços ou diferenciais.
- Se for colaborador, oriente de forma prática com base nas informações disponíveis.
- Seja prestativa e mantenha o tom acolhedor, sem hashtags ou promoções comerciais.

Use as informações abaixo como referência (caso sejam úteis):

{contexto}

Pergunta: {input.mensagem}
"""

    resposta = await gerar_resposta(prompt_com_contexto, input.id_assistant)
    return {"resposta": resposta}