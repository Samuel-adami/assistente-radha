import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import NovaCampanha from "./pages/NovaCampanha";
import NovaPublicacao from "./pages/NovaPublicacao";
import PublicosAlvo from "./pages/PublicosAlvo";
import Login from "./pages/Login";

function App() {
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const ProtectedRoute = ({ children }) => {
    return usuarioLogado ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Assistente Radha - Painel</h1>

        {usuarioLogado && (
          <nav className="space-x-4 mb-6">
            <Link to="/" className="text-blue-500 hover:underline">Chat</Link>
            <Link to="/nova-campanha" className="text-blue-500 hover:underline">Nova Campanha</Link>
            <Link to="/nova-publicacao" className="text-blue-500 hover:underline">Nova Publicação</Link>
            <Link to="/publicos-alvo" className="text-blue-500 hover:underline">Públicos Alvo</Link>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login setUsuarioLogado={setUsuarioLogado} />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Chat usuarioLogado={usuarioLogado} />
            </ProtectedRoute>
          } />
          <Route path="/nova-campanha" element={
            <ProtectedRoute>
              <NovaCampanha usuarioLogado={usuarioLogado} />
            </ProtectedRoute>
          } />
          <Route path="/nova-publicacao" element={
            <ProtectedRoute>
              <NovaPublicacao usuarioLogado={usuarioLogado} />
            </ProtectedRoute>
          } />
          <Route path="/publicos-alvo" element={
            <ProtectedRoute>
              <PublicosAlvo usuarioLogado={usuarioLogado} />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;