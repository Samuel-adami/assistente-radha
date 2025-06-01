import os
from dotenv import load_dotenv
import openai
import asyncio
import logging
from openai import OpenAIError

from services.embedding_service import buscar_contexto as consultar_conhecimento

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

HASHTAGS_TEMATICAS = {
    "fábrica": ["#FabricaDeMoveis", "#FabricaPropria", "#MovelPlanejado"],
    "cozinha": ["#CozinhaPlanejada", "#DesignDeInteriores"],
    "dormitório": ["#QuartoPlanejado", "#AmbientesPersonalizados"],
    "closet": ["#ClosetDosSonhos", "#AmbienteSobMedida"],
    "home office": ["#HomeOffice", "#TrabalhoComEstilo"],
    "banheiro": ["#BanheiroPlanejado", "#DesignDeBanheiros"],
    "corporativo": ["#MoveisCorporativos", "#AmbienteDeTrabalho"],
}

async def gerar_resposta(prompt, id_assistant, contexto='geral', tema=None):
    client = openai.AsyncOpenAI(
        api_key=openai.api_key,
        base_url=openai.api_base
    )

    conhecimento = consultar_conhecimento(prompt)
    if conhecimento:
        prompt = f"{conhecimento}\n\nUsuário: {prompt}"

    if contexto in ["publicacao", "campanha"]:
        partes_prompt = ["Inclua hashtags relacionadas ao tema e que reforcem os diferenciais da Radha."]
        if tema:
            hashtags = []
            for palavra, tags in HASHTAGS_TEMATICAS.items():
                if palavra in tema.lower():
                    hashtags.extend(tags)
            if hashtags:
                partes_prompt.append(f"Inclua também as hashtags: {' '.join(hashtags)}.")
        prompt += " " + " ".join(partes_prompt)

    try:
        thread = await client.beta.threads.create()
        await client.beta.threads.messages.create(thread_id=thread.id, role="user", content=prompt)
        run = await client.beta.threads.runs.create(thread_id=thread.id, assistant_id=id_assistant)

        while True:
            run_status = await client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            if run_status.status == "completed":
                break
            await asyncio.sleep(1)

        messages = await client.beta.threads.messages.list(thread_id=thread.id)
        respostas = [
            msg.content[0].text.value.strip()
            for msg in messages.data if msg.role == "assistant"
        ]
        return "\n\n".join(respostas) if respostas else "Não foi possível obter uma resposta do assistente."

    except OpenAIError as e:
        logging.error(f"Erro na API da OpenAI: {e}")
        return "Estamos passando por instabilidades técnicas no momento. Por favor, tente novamente mais tarde."

# ✅ Geração de imagem com DALL·E 3
async def gerar_imagem(prompt: str) -> str:
    client = openai.AsyncOpenAI(
        api_key=openai.api_key,
        base_url=openai.api_base
    )

    try:
        resposta = await client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1
        )
        return resposta.data[0].url

    except OpenAIError as e:
        logging.error(f"Erro ao gerar imagem com DALL·E: {e}")
        return "Erro ao gerar imagem."