import { useState, useEffect } from "react";
import { io } from "socket.io-client";

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:3001");
    setSocket(socket);
    socket.on("message", (message) => {
      setMessages((messages) => [...messages, message]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message !== "" && socket) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full p-3">
      <div className="overflow-auto mb-3">
        {messages.map((message, index) => (
          <div key={index} className="p-1 rounded bg-blue-500 text-white my-1">
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow rounded-l px-3 py-2 outline-none"
        />
        <button type="submit" className="px-3 py-2 bg-blue-500 text-white rounded-r">
          Send
        </button>
      </form>
    </div>
  );
}

export default App;