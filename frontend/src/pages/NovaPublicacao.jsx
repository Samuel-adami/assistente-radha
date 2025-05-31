import React, { useState } from 'react';
import { fetchComAuth } from '../utils/fetchComAuth';

function NovaPublicacao() {
  const [tema, setTema] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [formato, setFormato] = useState('post único');
  const [quantidade, setQuantidade] = useState(1);
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');

  const enviar = async () => {
    try {
      const dados = {
        tema,
        objetivo,
        formato,
        quantidade: parseInt(quantidade),
        id_assistant: "asst_OuBtdCCByhjfqPFPZwMK6d9y"
      };

      const resultado = await fetchComAuth('/nova-publicacao', {
        method: 'POST',
        body: JSON.stringify(dados)
      });

      setResposta(resultado.publicacao);
      setErro('');
    } catch (err) {
      setErro(err.message);
      setResposta('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nova Publicação</h1>

      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Tema"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
      />

      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Objetivo"
        value={objetivo}
        onChange={(e) => setObjetivo(e.target.value)}
      />

      <select
        className="w-full border rounded px-3 py-2 mb-2"
        value={formato}
        onChange={(e) => setFormato(e.target.value)}
      >
        <option>post único</option>
        <option>post carrossel</option>
        <option>reels</option>
        <option>story</option>
        <option>outro</option>
      </select>

      <input
        type="number"
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Quantidade"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        min="1"
      />

      <button
        onClick={enviar}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Criar Publicação
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

export default NovaPublicacao;
