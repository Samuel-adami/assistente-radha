# routes/conhecimento.py
from fastapi import APIRouter, Request
from services.embedding_service import buscar_contexto
from openai import OpenAI
import os

router = APIRouter()

@router.post("/perguntar-sara")
async def perguntar_sara(request: Request):
    dados = await request.json()
    pergunta = dados.get("pergunta")
    contexto = buscar_contexto(pergunta)

    resposta = OpenAI().chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Você é a Sara, assistente especialista da Radha."},
            {"role": "user", "content": f"Com base neste contexto:\n{contexto}\n\nResponda: {pergunta}"}
        ]
    )

    return {"resposta": resposta.choices[0].message.content.strip()}