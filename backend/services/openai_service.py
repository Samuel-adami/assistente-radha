import os
from dotenv import load_dotenv
import openai

# ✅ Carregar variáveis de ambiente
load_dotenv()

# ✅ Configuração da API
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# ✅ ID do Assistant padrão (caso não seja informado na requisição)
DEFAULT_ASSISTANT_ID = os.getenv("DEFAULT_ASSISTANT_ID", "asst-xxxxxx")  # <<<<< Troque aqui se quiser fixar!

# ✅ Função de geração de resposta
async def gerar_resposta(prompt, id_assistant=None):
    if not id_assistant:
        id_assistant = DEFAULT_ASSISTANT_ID

    try:
        response = await openai.ChatCompletion.acreate(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um especialista da Radha Ambientes Planejados, especializado em criar conteúdos para móveis planejados."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            user=id_assistant
        )
        return response.choices[0].message.content.strip()
    
    except Exception as e:
        print(f"Erro ao gerar resposta: {e}")
        return "Erro ao gerar resposta. Tente novamente mais tarde."
