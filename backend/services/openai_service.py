import os
from dotenv import load_dotenv
import openai
import asyncio

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# ✅ Dicionário de hashtags contextuais
HASHTAGS_TEMATICAS = {
    "fábrica": ["#FabricaDeMoveis", "#FabricaPropria", "#MovelPlanejado"],
    "cozinha": ["#CozinhaPlanejada", "#DesignDeInteriores"],
    "dormitório": ["#QuartoPlanejado", "#AmbientesPersonalizados"],
    "closet": ["#ClosetDosSonhos", "#AmbienteSobMedida"],
    "home office": ["#HomeOffice", "#TrabalhoComEstilo"],
    "banheiro": ["#BanheiroPlanejado", "#DesignDeBanheiros"],
    "corporativo": ["#MoveisCorporativos", "#AmbienteDeTrabalho"],
}

async def gerar_resposta(prompt, id_assistant, contexto=None, tema=None):
    client = openai.AsyncOpenAI(
        api_key=openai.api_key,
        base_url=openai.api_base
    )

    # ✅ Se for contexto de publicação ou campanha, incluir instrução de hashtags
    if contexto in ["publicacao", "campanha"]:
        prompt += " Inclua hashtags relacionadas ao tema abordado e que reforcem os diferenciais da Radha."

        # ✅ Adiciona hashtags contextuais se tema for informado
        if tema:
            hashtags = []
            for palavra, tags in HASHTAGS_TEMATICAS.items():
                if palavra in tema.lower():
                    hashtags.extend(tags)
            if hashtags:
                prompt += f" Inclua também as hashtags: {' '.join(hashtags)}."

    thread = await client.beta.threads.create()

    await client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=prompt
    )

    run = await client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=id_assistant
    )

    while True:
        run_status = await client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        if run_status.status == "completed":
            break
        await asyncio.sleep(1)

    messages = await client.beta.threads.messages.list(thread_id=thread.id)

    for msg in messages.data:
        if msg.role == "assistant":
            resposta = msg.content[0].text.value.strip()
            return resposta

    return "Não foi possível obter uma resposta do assistente."