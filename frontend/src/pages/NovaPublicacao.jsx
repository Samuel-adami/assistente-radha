import React, { useState } from 'react';
import { fetchComAuth } from '../utils/fetchComAuth';

function NovaPublicacao() {
  const [tema, setTema] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [formato, setFormato] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');

  const enviar = async () => {
    setErro('');
    setResposta('');

    const dados = {
      tema,
      objetivo,
      formato,
      quantidade: parseInt(quantidade) || 1,
      id_assistant: 'asst_OuBtdCCByhjfqPFPZwMK6d9y'
    };

    try {
      const resultado = await fetchComAuth('/nova-publicacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)
      });

      if (!resultado.ok) {
        const erroDetalhado = await resultado.json();
        setErro(`Erro ${resultado.status}: ${erroDetalhado.detail || 'Erro desconhecido.'}`);
        return;
      }

      const dadosResposta = await resultado.json();
      setResposta(dadosResposta.publicacao);
    } catch (err) {
      setErro(`Erro ao enviar a publicação: ${err.message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nova Publicação</h1>

      <input
        type="text"
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Tema"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
      />

      <select
        className="w-full border rounded px-3 py-2 mb-2"
        value={objetivo}
        onChange={(e) => setObjetivo(e.target.value)}
      >
        <option value="">Selecione o Objetivo</option>
        <option value="Engajamento">Engajamento</option>
        <option value="Reconhecimento de Marca">Reconhecimento de Marca</option>
        <option value="Conversões">Conversões</option>
        <option value="Lançamento de Produto">Lançamento de Produto</option>
      </select>

      <select
        className="w-full border rounded px-3 py-2 mb-2"
        value={formato}
        onChange={(e) => setFormato(e.target.value)}
      >
        <option value="">Selecione o Formato</option>
        <option value="post único">Post Único</option>
        <option value="post carrossel">Post Carrossel</option>
        <option value="reels">Reels</option>
        <option value="story">Story</option>
      </select>

      <input
        type="number"
        className="w-full border rounded px-3 py-2 mb-4"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
        min={1}
        placeholder="Quantidade"
      />

      <button
        onClick={enviar}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Criar Publicação
      </button>

      {resposta && (
        <div className="mt-6 p-4 bg-green-100 text-green-900 whitespace-pre-line rounded">
          <strong>Resposta:</strong><br />{resposta}
        </div>
      )}

      {erro && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {erro}
        </div>
      )}
    </div>
  );
}

export default NovaPublicacao;