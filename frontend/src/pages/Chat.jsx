// ✅ Exemplo de uso do fetchComAuth no Chat.jsx

import React, { useState } from 'react';
import { fetchComAuth } from '../utils/fetchComAuth';

function Chat() {
  const [mensagem, setMensagem] = useState('');
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');

  const enviarMensagem = async () => {
    try {
      const resultado = await fetchComAuth('/chat', {
        method: 'POST',
        body: JSON.stringify({ mensagem })
      });
      setResposta(resultado.resposta || JSON.stringify(resultado));
    } catch (err) {
      setErro(err.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <textarea
        className="w-full border rounded p-2 mb-2"
        rows="4"
        value={mensagem}
        onChange={(e) => setMensagem(e.target.value)}
        placeholder="Digite sua mensagem"
      />
      <button
        onClick={enviarMensagem}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Enviar
      </button>

      {resposta && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <strong>Resposta:</strong> {resposta}
        </div>
      )}

      {erro && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          <strong>Erro:</strong> {erro}
        </div>
      )}
    </div>
  );
}

export default Chat;
