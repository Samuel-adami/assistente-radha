import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Chat from "./pages/Chat";
import NovaCampanha from "./pages/NovaCampanha";
import NovaPublicacao from "./pages/NovaPublicacao";
import PublicosAlvo from "./pages/PublicosAlvo";

function App() {
  return (
    <Router>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Radha Executor - Painel</h1>

        <nav className="space-x-4 mb-6">
          <Link to="/" className="text-blue-500 hover:underline">Chat</Link>
          <Link to="/nova-campanha" className="text-blue-500 hover:underline">Nova Campanha</Link>
          <Link to="/nova-publicacao" className="text-blue-500 hover:underline">Nova Publicação</Link>
          <Link to="/publicos-alvo" className="text-blue-500 hover:underline">Públicos Alvo</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Chat />} />
          <Route path="/nova-campanha" element={<NovaCampanha />} />
          <Route path="/nova-publicacao" element={<NovaPublicacao />} />
          <Route path="/publicos-alvo" element={<PublicosAlvo />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;