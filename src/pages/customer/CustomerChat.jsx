import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Check, CheckCheck, Clock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useRepairs } from '../../context/RepairContext';

const CustomerChat = () => {
  const { currentUser } = useAuth();
  const { messages, sendMessage } = useRepairs();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
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
      senderRole: 'Customer',
      senderName: currentUser?.name || 'Customer',
    });

    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-bg-light/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-sm">
            MF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-primary-text text-sm">Mixer Fix Service Center</h2>
              <span className="flex items-center gap-1 text-[10px] text-brand-primary bg-brand-accent px-2 py-0.5 rounded-full font-medium">
                <ShieldCheck className="w-3 h-3" /> Verified Shop
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Online • Typically replies in 5 mins
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-50/40">
        <div className="text-center my-2">
          <span className="px-3 py-1 bg-gray-200/60 rounded-full text-[11px] text-secondary-text">
            End-to-end encrypted repair consultation
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderRole === 'Customer';

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div className="w-7 h-7 rounded-full bg-brand-secondary text-white flex items-center justify-center text-xs font-bold shrink-0 mb-1">
                  SO
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
                    {msg.senderName} (Shop Owner)
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
                <div className="w-7 h-7 rounded-full bg-brand-accent text-brand-primary flex items-center justify-center text-xs font-bold shrink-0 mb-1">
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto text-xs">
        <button
          onClick={() => setInputText('What is the current status of my mixer repair?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-bg-light hover:bg-gray-200 text-secondary-text text-[11px] transition"
        >
          🔍 Status inquiry
        </button>
        <button
          onClick={() => setInputText('Can you provide an estimated completion date?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-bg-light hover:bg-gray-200 text-secondary-text text-[11px] transition"
        >
          ⏱ Completion estimate
        </button>
        <button
          onClick={() => setInputText('How much will the spare parts cost?')}
          className="whitespace-nowrap px-3 py-1 rounded-full bg-bg-light hover:bg-gray-200 text-secondary-text text-[11px] transition"
        >
          💰 Spare parts cost
        </button>
      </div>

      {/* Message Input Bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message to the repair shop..."
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

export default CustomerChat;
