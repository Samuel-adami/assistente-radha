// ✅ Atualizado: PublicosAlvo.jsx com fetchComAuth

import React, { useEffect, useState } from 'react';
import { fetchComAuth } from '../utils/fetchComAuth';

function PublicosAlvo() {
  const [publicos, setPublicos] = useState([]);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregarPublicos = async () => {
      try {
        const resultado = await fetchComAuth('/publicos');
        setPublicos(resultado);
      } catch (err) {
        setErro(err.message);
      }
    };

    carregarPublicos();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Público Alvo</h1>

      {erro && (
        <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
          Erro ao carregar: {erro}
        </div>
      )}

      <ul className="space-y-2">
        {publicos.map((p, index) => (
          <li key={index} className="p-4 bg-white shadow rounded">
            <strong>{p.nome}</strong> - {p.descricao}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PublicosAlvo;
