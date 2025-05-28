import os
from dotenv import load_dotenv
import openai
import asyncio

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

async def gerar_resposta(prompt, id_assistant):
    client = openai.AsyncOpenAI(
        api_key=openai.api_key,
        base_url=openai.api_base
    )

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

    # ✅ Pegar a última resposta do assistente
    for msg in messages.data:
        if msg.role == "assistant":
            resposta = msg.content[0].text.value.strip()
            return resposta

    return "Não foi possível obter uma resposta do assistente."
