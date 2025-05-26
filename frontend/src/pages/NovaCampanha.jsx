import { useState } from 'react';

function NovaCampanha() {
  const [form, setForm] = useState({
    tema: '',
    objetivo: '',
    publico_alvo: '',
    orcamento: '',
    duracao: ''
  });
  const [resposta, setResposta] = useState('');

  const objetivos = [
    'Gerar leads',
    'Agendar visitas ao showroom',
    'Aumentar reconhecimento da marca',
    'Divulgar uma promoção específica'
  ];

  const publicosAlvo = [
    'Arquitetos',
    'Designers de Interiores',
    'Clientes finais',
    'Empresas'
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCriarCampanha = async () => {
    const response = await fetch('http://localhost:8015/nova-campanha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        id_assistant: 'asst-xxxx'
      })
    });

    const data = await response.json();
    setResposta(data.campanha);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">Nova Campanha</h1>

      <input name="tema" placeholder="Tema" className="w-full border p-3 rounded" onChange={handleChange} />

      <select name="objetivo" className="w-full border p-3 rounded" onChange={handleChange}>
        <option value="">Selecione o Objetivo</option>
        {objetivos.map((obj, idx) => (
          <option key={idx} value={obj}>{obj}</option>
        ))}
      </select>

      <select name="publico_alvo" className="w-full border p-3 rounded" onChange={handleChange}>
        <option value="">Selecione o Público-Alvo</option>
        {publicosAlvo.map((pub, idx) => (
          <option key={idx} value={pub}>{pub}</option>
        ))}
      </select>

      <input name="orcamento" placeholder="Orçamento (R$)" className="w-full border p-3 rounded" onChange={handleChange} />
      <input name="duracao" placeholder="Duração (dias)" className="w-full border p-3 rounded" onChange={handleChange} />

      <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleCriarCampanha}>
        Criar Campanha
      </button>

      <div className="bg-gray-100 p-4 rounded">{resposta}</div>
    </div>
  );
}

export default NovaCampanha;