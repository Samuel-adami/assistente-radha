import os
from dotenv import load_dotenv
import openai
import asyncio

# ✅ Carregar variáveis do .env
load_dotenv()

# ✅ Configuração via variáveis de ambiente
openai.api_key = os.getenv("OPENAI_API_KEY")
openai.api_base = os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1")

# ✅ Função principal com Assistants API e prompts separados
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
        "Telefone e WhatsApp: (51) 3041-3284. "
        "Telefone da Logística: (51) 99611-6899. "
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

    # ✅ Criação e execução via Assistants API
    thread = await client.beta.threads.create()

    await client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=prompt
    )

    run = await client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=id_assistant,
        instructions=selected_prompt
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
    resposta = messages.data[0].content[0].text.value.strip()

    return resposta
