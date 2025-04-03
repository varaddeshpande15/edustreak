"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import { X, MessageSquareDot } from 'lucide-react';

export default function ChatBotComponent() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to manage component visibility

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", text: message };
    setChat((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      if (data.response) {
        const botMessage = { role: "bot", text: data.response };
        setChat((prev) => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-4 bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
      >
        <MessageSquareDot size={24} />
      </button>
      {isOpen && createPortal(
        <div className="fixed inset-0 bg-white bg-opacity-90 z-50 p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <h1 className="text-2xl font-bold text-center mb-4">AI Chatbot</h1>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-lg mx-auto h-96 overflow-y-auto">
            {chat.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-2 rounded-lg w-fit ${
                  msg.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-300 text-black mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <p className="text-gray-500">Thinking...</p>}
          </div>

          <div className="flex mt-4 max-w-lg mx-auto">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown} // 👈 Handles Enter key press
              placeholder="Type your question..."
              className="flex-1 p-2 border rounded-l-lg"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
