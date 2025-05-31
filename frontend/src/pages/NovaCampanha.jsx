import React, { useState } from 'react';
import { fetchComAuth } from '../utils/fetchComAuth';

function NovaCampanha() {
  const [tema, setTema] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [publicoAlvo, setPublicoAlvo] = useState('');
  const [orcamento, setOrcamento] = useState('');
  const [duracao, setDuracao] = useState('');
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');

  const enviar = async () => {
    try {
      const dados = {
        tema,
        objetivo,
        publico_alvo: publicoAlvo,
        orcamento: parseFloat(orcamento),
        duracao,
        id_assistant: "asst_OuBtdCCByhjfqPFPZwMK6d9y"
      };

      const resultado = await fetchComAuth('/nova-campanha', {
        method: 'POST',
        body: JSON.stringify(dados)
      });

      setResposta(resultado.campanha);
      setErro('');
    } catch (err) {
      setErro(err.message);
      setResposta('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nova Campanha</h1>

      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Tema da campanha"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Objetivo"
        value={objetivo}
        onChange={(e) => setObjetivo(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Público-alvo"
        value={publicoAlvo}
        onChange={(e) => setPublicoAlvo(e.target.value)}
      />
      <input
        type="number"
        step="0.01"
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Orçamento (R$)"
        value={orcamento}
        onChange={(e) => setOrcamento(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Duração"
        value={duracao}
        onChange={(e) => setDuracao(e.target.value)}
      />

      <button
        onClick={enviar}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Criar Campanha
      </button>

      {resposta && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded whitespace-pre-wrap">
          {resposta}
        </div>
      )}

      {erro && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Erro: {erro}
        </div>
      )}
    </div>
  );
}

export default NovaCampanha;
