import { useState } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const handleSendMessage = async () => {
    const response = await fetch('http://localhost:8015/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mensagem: userInput,
        id_assistant: 'asst-xxxx'
      })
    });

    const data = await response.json();
    const newMessage = { user: userInput, bot: data.resposta };
    setMessages([...messages, newMessage]);
    setUserInput('');
  };

  const handleDownload = () => {
    const conversation = messages.map(m => `Você: ${m.user}\nGPT: ${m.bot}\n`).join('\n');
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversa_chat.txt';
    a.click();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Chat com GPT</h1>

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