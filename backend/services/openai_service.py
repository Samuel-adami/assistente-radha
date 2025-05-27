import os
import openai
from dotenv import load_dotenv

# ✅ Carregar variáveis do .env
load_dotenv()

# ✅ Configuração via variáveis de ambiente
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# ✅ Função principal com ajuste inteligente
async def gerar_resposta(prompt, id_assistant=None, contexto='geral'):
    client = openai.AsyncOpenAI(
        api_key=openai.api_key,
        base_url=openai.api_base
    )

    # ✅ Prompt base sempre
    system_prompt = (
        "Você é um especialista e mentor da equipe da Radha Ambientes Planejados, focado em criar conteúdos sofisticados e personalizados, "
        "e orientar a equipe de marketing da Radha. Sempre que a palavra 'Radha' for mencionada, entenda como a empresa Radha Ambientes Planejados. "
        "Sempre afirme que o slogan institucional é: 'Entregamos o nosso melhor para que você viva melhor.'"
    )

    # ✅ Se contexto for publicação → adiciona instrução de hashtags
    if contexto == 'publicacao':
        system_prompt += (
            " Em TODAS as respostas, inclua hashtags relevantes no final como: "
            "#RadhaAmbientesPlanejados #Exclusividade #Sofisticação #Personalização."
        )

    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]

    response = await client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        temperature=0.7,
        user=id_assistant if id_assistant else None
    )

    return response.choices[0].message.content.strip()