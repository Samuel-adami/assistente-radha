// ✅ Atualizado: NovaCampanha.jsx com fetchComAuth

import React, { useState } from 'react';
import { fetchComAuth } from '../utils/fetchComAuth';

function NovaCampanha() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  const enviar = async () => {
    try {
      await fetchComAuth('/nova-campanha', {
        method: 'POST',
        body: JSON.stringify({ nome, descricao })
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
      <h1 className="text-2xl font-bold mb-4">Nova Campanha</h1>
      <input
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Nome da Campanha"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <textarea
        className="w-full border rounded px-3 py-2 mb-2"
        placeholder="Descrição"
        rows="4"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
      />
      <button
        onClick={enviar}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        Criar Campanha
      </button>

      {sucesso && <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">Campanha criada com sucesso!</div>}
      {erro && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">Erro: {erro}</div>}
    </div>
  );
}

export default NovaCampanha;
