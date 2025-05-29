import { useState } from 'react';

function NovaPublicacao({ usuarioLogado }) {
  const RADHA_ASSISTANT_ID = 'asst_OuBtdCCByhjfqPFPZwMK6d9y';

  const [form, setForm] = useState({
    tema: '',
    objetivo: '',
    formato: '',
    quantidade: 1
  });
  const [resposta, setResposta] = useState('');
  const [descricaoFormato, setDescricaoFormato] = useState('');

  const objetivos = [
    'Gerar leads',
    'Agendar visitas ao showroom',
    'Aumentar reconhecimento da marca',
    'Divulgar uma promoção específica'
  ];

  const formatos = ['Post único', 'Post carrossel', 'Reels', 'Story'];

  const descricoes = {
    'Post único': 'Legenda com CTA, hashtags, sugestão de imagem e música.',
    'Post carrossel': 'Título, legenda curta para cada slide, sugestão de imagens e legenda completa.',
    'Reels': 'Roteiro audiovisual, legenda para vídeo, sugestão de música e legenda completa.',
    'Story': 'Roteiro visual, texto para criativo, sugestão de sticker e legenda completa.'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'formato') {
      setDescricaoFormato(descricoes[value] || '');
    }
  };

  const handleCriarPublicacao = async () => {
    const response = await fetch(`/nova-publicacao`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${usuarioLogado.username}:${usuarioLogado.password}`
      },
      body: JSON.stringify({
        ...form,
        quantidade: Number(form.quantidade),
        id_assistant: RADHA_ASSISTANT_ID,
        nome_usuario: usuarioLogado.nome,
        cargo_usuario: usuarioLogado.cargo
      })
    });

    const data = await response.json();
    setResposta(data.publicacao);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">Nova Publicação</h1>

      <input name="tema" placeholder="Tema" className="w-full border p-3 rounded" onChange={handleChange} />

      <select name="objetivo" className="w-full border p-3 rounded" onChange={handleChange}>
        <option value="">Selecione o Objetivo</option>
        {objetivos.map((obj, idx) => (
          <option key={idx} value={obj}>{obj}</option>
        ))}
      </select>

      <select name="formato" className="w-full border p-3 rounded" onChange={handleChange}>
        <option value="">Selecione o Formato</option>
        {formatos.map((fmt, idx) => (
          <option key={idx} value={fmt}>{fmt}</option>
        ))}
      </select>

      {descricaoFormato && (
        <p className="text-sm text-gray-600">Descrição: {descricaoFormato}</p>
      )}

      <input name="quantidade" type="number" min="1" placeholder="Quantidade" className="w-full border p-3 rounded" onChange={handleChange} />

      <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleCriarPublicacao}>
        Criar Publicação
      </button>

      <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{resposta}</div>
    </div>
  );
}

export default NovaPublicacao;
