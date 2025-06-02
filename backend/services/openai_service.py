import os
import asyncio
import logging
from dotenv import load_dotenv
from openai import AsyncOpenAI, OpenAIError
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import base64
import requests

from services.embedding_service import buscar_contexto as consultar_conhecimento

# 🔄 Variáveis de ambiente
load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
API_BASE = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# 🔧 Cliente OpenAI assíncrono
client = AsyncOpenAI(api_key=API_KEY, base_url=API_BASE)

# 🧠 Hashtags temáticas para enriquecer prompts
HASHTAGS_TEMATICAS = {
    "fábrica": ["#FabricaDeMoveis", "#FabricaPropria", "#MovelPlanejado"],
    "cozinha": ["#CozinhaPlanejada", "#DesignDeInteriores"],
    "dormitório": ["#QuartoPlanejado", "#AmbientesPersonalizados"],
    "closet": ["#ClosetDosSonhos", "#AmbienteSobMedida"],
    "home office": ["#HomeOffice", "#TrabalhoComEstilo"],
    "banheiro": ["#BanheiroPlanejado", "#DesignDeBanheiros"],
    "corporativo": ["#MoveisCorporativos", "#AmbienteDeTrabalho"],
}

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

# 🎯 Geração de texto via Assistente
async def gerar_resposta(prompt, id_assistant, contexto='geral', tema=None):
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
            status = await client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            if status.status == "completed":
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

# 🎨 Geração de imagem com DALL·E 3
async def gerar_imagem(prompt: str) -> str:
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

# 🖼️ Geração de imagem com texto sobreposto manualmente
def gerar_imagem_com_texto(imagem_url: str, texto: str) -> str:
    try:
        response = requests.get(imagem_url)
        imagem = Image.open(BytesIO(response.content))

        draw = ImageDraw.Draw(imagem)
        largura, altura = imagem.size

        fonte = ImageFont.load_default()
        margem = 20

        draw.text((margem, altura - 60), texto, font=fonte, fill="white")

        buffer = BytesIO()
        imagem.save(buffer, format="PNG")
        buffer.seek(0)
        imagem_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")

        return f"data:image/png;base64,{imagem_base64}"

    except Exception as e:
        logging.error(f"Erro ao sobrepor texto: {e}")
        return ""
