import { useState } from 'react';

function Chat() {
  const RADHA_ASSISTANT_ID = 'asst_OuBtdCCByhjfqPFPZwMK6d9y';  // ✅ ID real

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    const contextualPrompt = `Por favor, responda como especialista da Radha Ambientes Planejados: ${userInput}`;

    const API_URL = process.env.REACT_APP_API_URL;
    const response = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensagem: contextualPrompt,
        id_assistant: RADHA_ASSISTANT_ID
      })
    });

    const data = await response.json();
    const newMessage = { user: userInput, bot: data.resposta };
    setMessages([...messages, newMessage]);
    setUserInput('');
  };

  const handleDownload = () => {
    const conversation = messages.map(m => `Você: ${m.user}\nAssistente Radha: ${m.bot}\n`).join('\n');
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversa_chat.txt';
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Chat com a Assistente Sara</h1>

      <div className="space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className="p-2 border-b">
            <p><strong>Você:</strong> {m.user}</p>
            <p><strong>Assistente Radha:</strong> {m.bot}</p>
          </div>
        ))}
      </div>

      <textarea
        className="w-full border p-2 rounded"
        rows="3"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        placeholder="Digite sua mensagem..."
      />

      <div className="flex space-x-2">
        <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded">
          Enviar
        </button>
        <button onClick={handleDownload} className="bg-gray-600 text-white px-4 py-2 rounded">
          Baixar conversa
        </button>
      </div>
    </div>
  );
}

export default Chat;
