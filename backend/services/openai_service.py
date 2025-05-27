import os
from dotenv import load_dotenv
import openai

# ✅ Carregar variáveis do .env
load_dotenv()

# ✅ Configuração via variáveis de ambiente
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# ✅ Função principal sem função de pesquisa
async def gerar_resposta(prompt, id_assistant=None, contexto='institucional'):
    client = openai.AsyncOpenAI(
        api_key=openai.api_key,
        base_url=openai.api_base
    )

    # ✅ Prompts separados
    prompt_institucional = (
        "Você é Sara, assistente digital e mentora da equipe da Radha Ambientes Planejados. "
        "Fundada em 01/06/2013 por Andréia Bourscheid e Samuel Adami, com mais de 10 anos de experiência. "
        "Endereço: Av. General Flores da Cunha, 3808 - Pq. Brasília - Cachoeirinha/RS. "
        "Telefone: (51) 3041-3284. WhatsApp e Logística: (51) 99611-6899. "
        "Email: comercial@radhamoveis.com.br. Instagram: @radhaambientesplanejados. "
        "Site: www.radhamoveis.com.br. Formas de pagamento: Dinheiro, Pix, Transferência, Boleto, Santander Financiamentos (até 24x). "
        "Sempre que perguntado, o slogan é: 'Entregamos o nosso melhor para que você viva melhor.'"
    )

    prompt_marketing = (
        "Você cria conteúdos sofisticados e personalizados, com roteiros visuais, CTAs impactantes, sugestões de imagens, "
        "músicas livres de direitos autorais, orientando a equipe de marketing da Radha. "
        "Sempre que criar publicações, inclua hashtags: #RadhaAmbientesPlanejados #Exclusividade #Sofisticação #Personalização."
    )

    prompt_processos = (
        "Você orienta sobre processos internos, práticas comerciais, estratégias de vendas, campanhas de marketing e relacionamento com o cliente, "
        "sempre transmitindo os valores de exclusividade, sofisticação e personalização da Radha."
    )

    # ✅ Seleção do prompt conforme contexto
    prompts = {
        'institucional': prompt_institucional,
        'marketing': prompt_marketing,
        'processos': prompt_processos
    }

    selected_prompt = prompts.get(contexto, prompt_institucional)

    # ✅ Chamada ao Assistants API sem função de pesquisa
    response = await client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": selected_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        user=id_assistant if id_assistant else None
    )

    return response.choices[0].message.content.strip()