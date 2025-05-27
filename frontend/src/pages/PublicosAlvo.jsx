import { useState } from 'react';

function PublicosAlvo() {
  const [publicos, setPublicos] = useState([
    { titulo: 'Arquitetos', descricao: 'Profissionais responsáveis por projetos de interiores.' },
    { titulo: 'Designers de Interiores', descricao: 'Especialistas em design de ambientes.' },
    { titulo: 'Clientes finais', descricao: 'Pessoas interessadas em ambientes planejados para residências.' },
    { titulo: 'Empresas', descricao: 'Negócios que buscam mobiliário planejado.' }
  ]);

  const [novoPublico, setNovoPublico] = useState({ titulo: '', descricao: '' });

  const handleAdicionar = () => {
    if (novoPublico.titulo.trim() !== '' && novoPublico.descricao.trim() !== '') {
      setPublicos([...publicos, novoPublico]);
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