import { useState, useEffect } from 'react';

function PublicosAlvo({ usuarioLogado }) {
  const [publicos, setPublicos] = useState([]);
  const [novoPublico, setNovoPublico] = useState({ titulo: '', descricao: '' });

  useEffect(() => {
    const fetchPublicos = async () => {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/publicos`, {
        headers: {
          'Authorization': `${usuarioLogado.username}:${usuarioLogado.password}`
        }
      });
      const data = await response.json();
      setPublicos(data);
    };

    fetchPublicos();
  }, [usuarioLogado]);

  const handleAdicionar = async () => {
    if (novoPublico.titulo.trim() === '' || novoPublico.descricao.trim() === '') return;

    const API_URL = process.env.REACT_APP_API_URL;
    const response = await fetch(`${API_URL}/publicos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${usuarioLogado.username}:${usuarioLogado.password}`
      },
      body: JSON.stringify(novoPublico)
    });

    if (response.ok) {
      const novo = await response.json();
      setPublicos([...publicos, novoPublico]); // ou recarrega com novo fetch
      setNovoPublico({ titulo: '', descricao: '' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">Públicos Alvo</h1>

      <ul className="list-disc pl-5 space-y-1">
        {publicos.map((pub, idx) => (
          <li key={idx}>
            <strong>{pub.titulo}:</strong> {pub.descricao}
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={novoPublico.titulo}
        onChange={(e) => setNovoPublico({ ...novoPublico, titulo: e.target.value })}
        placeholder="Novo título de público-alvo"
        className="w-full border p-3 rounded"
      />

      <textarea
        value={novoPublico.descricao}
        onChange={(e) => setNovoPublico({ ...novoPublico, descricao: e.target.value })}
        placeholder="Descrição do público-alvo"
        className="w-full border p-3 rounded"
        rows="3"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={handleAdicionar}>
        Adicionar
      </button>
    </div>
  );
}

export default PublicosAlvo;