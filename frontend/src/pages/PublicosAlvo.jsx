import { useState, useEffect } from 'react';

function PublicosAlvo() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [publicos, setPublicos] = useState([]);
  const [novoPublico, setNovoPublico] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/publicos`)
      .then(res => res.json())
      .then(data => setPublicos(data));
  }, []);

  const handleAdicionar = async () => {
    if (novoPublico.trim() !== '') {
      await fetch(`${API_URL}/publicos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: novoPublico })
      });
      setPublicos([...publicos, { nome: novoPublico }]);
      setNovoPublico('');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <h1 className="text-3xl font-semibold text-gray-900">Públicos Alvo</h1>

      <ul className="list-disc pl-5 space-y-1">
        {publicos.map((pub, idx) => (
          <li key={idx}>{pub.nome}</li>
        ))}
      </ul>

      <input
        type="text"
        value={novoPublico}
        onChange={(e) => setNovoPublico(e.target.value)}
        placeholder="Novo público-alvo"
        className="w-full border p-3 rounded"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded" onClick={handleAdicionar}>
        Adicionar
      </button>
    </div>
  );
}

export default PublicosAlvo;