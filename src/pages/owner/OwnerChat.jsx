import React, { useState, useRef, useEffect } from 'react';
import { Send, User, MessageSquare, CheckCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';

const OwnerChat = () => {
  const { currentUser } = useAuth();
  const { messages, sendMessage, repairs } = useRepairs();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendMessage({
      text: inputText,
      senderRole: 'Shop Owner',
      senderName: currentUser?.name || 'Shop Manager',
    });

    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-bg-light/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-secondary text-white flex items-center justify-center font-bold text-sm">
            SO
          </div>
          <div>
            <h2 className="font-bold text-primary-text text-sm">Customer Support Channel</h2>
            <p className="text-[11px] text-secondary-text">
              Direct workshop assistance with active repair ticket owners
            </p>
          </div>
        </div>
        <span className="text-[11px] bg-brand-accent text-brand-primary font-bold px-2.5 py-1 rounded-full">
          Live Desk
        </span>
      </div>

      {/* Messages Scroll */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/40">
        {messages.map((msg) => {
          const isMe = msg.senderRole === 'Shop Owner';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center text-xs font-bold shrink-0 mb-1">
                  {msg.senderName.charAt(0)}
                </div>
              )}

              <div
                className={`max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                  isMe
                    ? 'bg-brand-primary text-white rounded-br-sm'
                    : 'bg-white border border-gray-100 text-primary-text rounded-bl-sm'
                }`}
              >
                {!isMe && (
                  <p className="text-[11px] font-semibold text-brand-primary mb-1">
                    {msg.senderName} ({msg.senderRole})
                  </p>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                <div
                  className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                    isMe ? 'text-white/80' : 'text-gray-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-white/80" />}
                </div>
              </div>

              {isMe && (
                <div className="w-7 h-7 rounded-full bg-brand-secondary text-white flex items-center justify-center text-xs font-bold shrink-0 mb-1">
                  SO
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies for Shop Owner */}
      <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setInputText('Your appliance has been inspected. The motor coupler needs replacement.')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-bg-light hover:bg-gray-200 text-secondary-text text-[11px] transition"
        >
          🔧 Motor diagnosis
        </button>
        <button
          onClick={() => setInputText('The repair is completed and tested! Dispatching via courier today.')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-bg-light hover:bg-gray-200 text-secondary-text text-[11px] transition"
        >
          🚚 Ready for dispatch
        </button>
        <button
          onClick={() => setInputText('Please authorize the updated estimate so we can proceed with genuine parts.')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-bg-light hover:bg-gray-200 text-secondary-text text-[11px] transition"
        >
          💳 Estimate authorization
        </button>
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Reply to customer as Shop Owner..."
          className="flex-1 px-4 py-2.5 bg-bg-light rounded-xl border border-transparent focus:border-brand-primary focus:bg-white text-sm focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 bg-brand-primary text-white rounded-xl hover:bg-opacity-90 disabled:opacity-40 transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default OwnerChat;
