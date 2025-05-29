from fastapi import APIRouter
from pydantic import BaseModel
from services.openai_service import gerar_resposta
from services.embedding_service import buscar_contexto
from security import verificar_autenticacao

router = APIRouter(prefix="/chat", tags=["Chat"])

class ChatInput(BaseModel):
    mensagem: str
    id_assistant: str = None
    nome_usuario: str
    cargo_usuario: str
    
@router.post("/")
async def conversar(input: ChatInput):
    # 🔎 Buscar contexto relevante da base de conhecimento
    contexto = buscar_contexto(input.mensagem)
    
    print("📚 Contexto carregado:\n", contexto)

    # 🧭 Prompt com tom mais sóbrio, direto e institucional
    prompt_com_contexto = f"""
Você é a Sara, assistente institucional da Radha Ambientes Planejados.

Sua função é fornecer respostas claras, objetivas e confiáveis com base nas informações disponíveis. Evite qualquer linguagem promocional, chamadas para ação, hashtags ou links.

Este atendimento está sendo feito para: {input.nome_usuario} ({input.cargo_usuario})

Comunique-se de forma sóbria e acolhedora. Ajude tanto clientes quanto colaboradores a compreender os processos, diferenciais e diretrizes da Radha.

Informações disponíveis:
{contexto}

Pergunta: {input.mensagem}
"""

    resposta = await gerar_resposta(prompt_com_contexto, input.id_assistant)
    return {"resposta": resposta}