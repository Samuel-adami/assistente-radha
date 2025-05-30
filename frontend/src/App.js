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
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth && !usuarioLogado) {
      const [username] = auth.split(":");
      // Carga básica — em produção idealmente deve buscar backend ou usar token
      const permissaoPadrao = ["chat", "campanhas", "publicacoes", "publico"];
      setUsuarioLogado({
        username,
        nome: username,
        cargo: "Usuário",
        permissoes: permissaoPadrao
      });
    } else if (!auth) {
      navigate("/login");
    }
  }, []);

  const possuiPermissao = (rota) => {
    return usuarioLogado?.permissoes?.includes(rota);
  };

  const ProtectedRoute = ({ children, permissao }) => {
    if (!usuarioLogado) return <Navigate to="/login" />;
    if (!usuarioLogado.permissoes.includes(permissao)) return <Navigate to="/" />;
    return children;
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Assistente Radha - Painel</h1>

      {usuarioLogado && (
        <nav className="space-x-4 mb-6">
          {possuiPermissao("chat") && (
            <Link to="/" className="text-blue-500 hover:underline">Chat</Link>
          )}
          {possuiPermissao("campanhas") && (
            <Link to="/nova-campanha" className="text-blue-500 hover:underline">Nova Campanha</Link>
          )}
          {possuiPermissao("publicacoes") && (
            <Link to="/nova-publicacao" className="text-blue-500 hover:underline">Nova Publicação</Link>
          )}
          {possuiPermissao("publico") && (
            <Link to="/publicos-alvo" className="text-blue-500 hover:underline">Públicos Alvo</Link>
          )}
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login setUsuarioLogado={setUsuarioLogado} />} />

        {possuiPermissao("chat") && (
          <Route path="/" element={<Chat usuarioLogado={usuarioLogado} />} />
        )}
        {possuiPermissao("campanhas") && (
          <Route path="/nova-campanha" element={
            <ProtectedRoute permissao="campanhas">
              <NovaCampanha usuarioLogado={usuarioLogado} />
            </ProtectedRoute>
          } />
        )}
        {possuiPermissao("publicacoes") && (
          <Route path="/nova-publicacao" element={
            <ProtectedRoute permissao="publicacoes">
              <NovaPublicacao usuarioLogado={usuarioLogado} />
            </ProtectedRoute>
          } />
        )}
        {possuiPermissao("publico") && (
          <Route path="/publicos-alvo" element={
            <ProtectedRoute permissao="publico">
              <PublicosAlvo usuarioLogado={usuarioLogado} />
            </ProtectedRoute>
          } />
        )}
      </Routes>
    </div>
  );
}

export default AppWrapper;

