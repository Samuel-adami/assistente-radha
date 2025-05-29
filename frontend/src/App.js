import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import NovaCampanha from "./pages/NovaCampanha";
import NovaPublicacao from "./pages/NovaPublicacao";
import PublicosAlvo from "./pages/PublicosAlvo";
import Login from "./pages/Login";

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const possuiPermissao = (rota) => {
    return usuarioLogado?.permissoes?.includes(rota);
  };

  const ProtectedRoute = ({ children, permissao }) => {
  if (!usuarioLogado) return <Navigate to="/login" />;
  if (!usuarioLogado.permissoes.includes(permissao)) return <Navigate to="/" />;
  return children;
  };

  return (
    <Router>
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
            <Route path="/" element={
              <ProtectedRoute rota="chat">
                <Chat usuarioLogado={usuarioLogado} />
              </ProtectedRoute>
            } />
          )}

          {possuiPermissao("campanhas") && (
            <Route path="/nova-campanha" element={
              <ProtectedRoute rota="campanhas">
                <NovaCampanha usuarioLogado={usuarioLogado} />
              </ProtectedRoute>
            } />
          )}

          {possuiPermissao("publicacoes") && (
            <Route path="/nova-publicacao" element={
              <ProtectedRoute rota="publicacoes">
                <NovaPublicacao usuarioLogado={usuarioLogado} />
              </ProtectedRoute>
            } />
          )}

          {possuiPermissao("publico") && (
            <Route path="/publicos-alvo" element={
              <ProtectedRoute rota="publico">
                <PublicosAlvo usuarioLogado={usuarioLogado} />
              </ProtectedRoute>
            } />
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;