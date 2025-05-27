import os
import openai
from dotenv import load_dotenv

# ✅ Carregar variáveis do .env
load_dotenv()

# ✅ Configuração via variáveis de ambiente
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# ✅ Função principal com prompt ideal para Radha
async def gerar_resposta(prompt, id_assistant=None):
    client = openai.AsyncOpenAI(
        api_key=openai.api_key,
        base_url=openai.api_base
    )

    system_prompt = (
        "Você é um especialista da Radha Ambientes Planejados, focado em criar conteúdos sofisticados e personalizados. "
        "Em TODAS as respostas, inclua hashtags relevantes no final. Responda de forma clara, objetiva e emocional, transmitindo "
        "os valores de exclusividade, sofisticação e personalização da Radha."
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]

    if id_assistant:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7,
            user=id_assistant
        )
    else:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=messages,
            temperature=0.7
        )

    return response.choices[0].message.content.strip()