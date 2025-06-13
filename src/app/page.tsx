'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="p-4 border-b dark:border-zinc-800">
        <h1 className="text-xl font-bold">Decision Bot</h1>
      </header>
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-md p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800'
              }`}
            >
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                }
              })}
            </div>
          </div>
        ))}
      </main>
      <footer className="p-4 border-t dark:border-zinc-800">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            className="flex-1 p-2 border rounded-lg dark:bg-zinc-900 dark:border-zinc-800"
            value={input}
            placeholder="Ask a question and get a decision..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
}