import os
import openai

openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

async def gerar_resposta(prompt, id_assistant=None):
    if id_assistant:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "Você é um especialista da Radha."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            user=id_assistant
        )
    else:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=0.7
        )
    
    return response.choices[0].message.content.strip()
