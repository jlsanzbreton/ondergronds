import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Send, Bot, User, Loader2 } from 'lucide-react';

export const AiChat: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { role: 'model', text: 'Hoi! Ik ben de Mol. Ik weet alles over de wereld onder de grond. Heb je een vraag over de moeilijke woorden?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initChat = () => {
    if (!process.env.API_KEY) {
      console.error("API Key not found");
      return null;
    }
    
    // We try to reuse the chat instance if it exists
    if (chatRef.current) return chatRef.current;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `Je bent een vrolijke, behulpzame tutor genaamd "De Mol" voor een kind van 9 jaar oud. 
        De gebruiker leert Nederlandse woordenschat over het thema "Ondergronds" (Les 1 en 5).
        Je antwoordt altijd in het Nederlands. 
        Hou je antwoorden kort, simpel en bemoedigend. 
        Als het kind een woord niet snapt, leg het uit met een simpel voorbeeld.
        Gebruik af en toe een emoji gerelateerd aan grond, mollen, tunnels of stenen.`,
      },
    });
    chatRef.current = chat;
    return chat;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chat = initChat();
      if (!chat) {
          setMessages(prev => [...prev, { role: 'model', text: 'Oeps! Ik kan even geen verbinding maken. (Geen API Key gevonden)' }]);
          setIsLoading(false);
          return;
      }

      const response: GenerateContentResponse = await chat.sendMessage({ message: userMessage });
      const responseText = response.text || "Sorry, ik begreep dat niet helemaal.";

      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'model', text: 'Oei, mijn bril is beslagen! Ik kan even niet antwoorden. Probeer het later nog eens.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[70vh] flex flex-col bg-white rounded-2xl shadow-lg border-4 border-stone-200 overflow-hidden">
      <div className="bg-amber-500 p-4 text-white flex items-center gap-3">
        <div className="p-2 bg-white rounded-full text-amber-600">
          <Bot size={24} />
        </div>
        <div>
          <h3 className="font-bold text-lg">Vraag het de Mol</h3>
          <p className="text-xs text-amber-100">Je slimme ondergrondse vriendje</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-amber-200 text-amber-800' : 'bg-stone-200 text-stone-600'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div 
              className={`p-3 rounded-2xl max-w-[80%] text-sm md:text-base leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-amber-100 text-stone-800 rounded-tr-none' 
                  : 'bg-white text-stone-700 shadow-sm border border-stone-100 rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center shrink-0">
               <Bot size={16} />
             </div>
             <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-stone-100">
               <Loader2 className="animate-spin text-stone-400" size={20} />
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-stone-200">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Typ hier je vraag..."
            className="flex-1 p-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};