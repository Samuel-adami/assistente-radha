// ✅ Atualizado: NovaPublicacao.jsx com fetchComAuth

import React, { useState } from 'react';
import { fetchComAuth } from '../utils/fetchComAuth';

function NovaPublicacao() {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const enviar = async () => {
    try {
      await fetchComAuth('/nova-publicacao', {
        method: 'POST',
        body: JSON.stringify({ titulo, conteudo })
      });
      setSucesso(true);
      setErro('');
    } catch (err) {
      setErro(err.message);
      setSucesso(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nova Publicação</h1>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <textarea
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Conteúdo"
        rows="5"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
      />
      <button
        onClick={enviar}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Publicar
      </button>

      {sucesso && <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">Publicação enviada com sucesso!</div>}
      {erro && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">Erro: {erro}</div>}
    </div>
  );
}

export default NovaPublicacao;
