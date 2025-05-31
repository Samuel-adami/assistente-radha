import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Chat from "./pages/Chat";
import NovaCampanha from "./pages/NovaCampanha";
import NovaPublicacao from "./pages/NovaPublicacao";
import PublicosAlvo from "./pages/PublicosAlvo";
import Login from "./pages/Login";

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear(); // limpa o storage em cada carregamento
    setUsuarioLogado(null);
    setCarregando(false);
  }, []);

  const possuiPermissao = (rota) => {
    return usuarioLogado?.permissoes?.includes(rota);
  };

  const ProtectedRoute = ({ children, permissao }) => {
    if (!usuarioLogado) return <Navigate to="/login" />;
    if (!usuarioLogado.permissoes?.includes(permissao)) return <Navigate to="/" />;
    return children;
  };

  if (carregando) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!usuarioLogado) {
    return (
      <Routes>
        <Route path="/login" element={<Login setUsuarioLogado={setUsuarioLogado} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4 text-center text-green-900">Radha One</h1>
        <button
          onClick={() => {
            localStorage.clear();
            setUsuarioLogado(null);
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      <nav className="space-x-4 mb-6">
        {possuiPermissao("chat") && <Link to="/" className="bg-[#007b1b] text-[#d1f293] px-3 py-1 rounded hover:opacity-90">Chat</Link>
        {possuiPermissao("campanhas") && <Link to="/" className="bg-[#007b1b] text-[#d1f293] px-3 py-1 rounded hover:opacity-90">Nova Campanha</Link>
        {possuiPermissao("publicacoes") && <Link to="/" className="bg-[#007b1b] text-[#d1f293] px-3 py-1 rounded hover:opacity-90">Nova Publicação</Link>
        {possuiPermissao("publico") && <Link to="/" className="bg-[#007b1b] text-[#d1f293] px-3 py-1 rounded hover:opacity-90">Cadastro de Públicos Alvo</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login setUsuarioLogado={setUsuarioLogado} />} />
        <Route path="/" element={<ProtectedRoute permissao="chat"><Chat usuarioLogado={usuarioLogado} /></ProtectedRoute>} />
        <Route path="/nova-campanha" element={<ProtectedRoute permissao="campanhas"><NovaCampanha usuarioLogado={usuarioLogado} /></ProtectedRoute>} />
        <Route path="/nova-publicacao" element={<ProtectedRoute permissao="publicacoes"><NovaPublicacao usuarioLogado={usuarioLogado} /></ProtectedRoute>} />
        <Route path="/publicos-alvo" element={<ProtectedRoute permissao="publico"><PublicosAlvo usuarioLogado={usuarioLogado} /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
