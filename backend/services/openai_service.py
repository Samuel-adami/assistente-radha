import os
import openai

# ✅ Configuração via variáveis de ambiente
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# ✅ Função principal
async def gerar_resposta(prompt, id_assistant=None):
    client = openai.AsyncOpenAI(
        api_key=openai.api_key,
        base_url=openai.api_base
    )

    if id_assistant:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um especialista da Radha Ambientes Planejados."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            user=id_assistant
        )
    else:
        response = await client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )

    return response.choices[0].message.content.strip()
