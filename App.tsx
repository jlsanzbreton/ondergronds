import React, { useState } from 'react';
import { Tab } from './types';
import { vocabulary } from './data';
import { WordList } from './components/WordList';
import { Flashcards } from './components/Flashcards';
import { Quiz } from './components/Quiz';
import { AiChat } from './components/AiChat';
import { ImageGenerator } from './components/ImageGenerator';
import { BookOpen, Copy, BrainCircuit, MessageCircle, Image as ImageIcon } from 'lucide-react';

// Custom header component specifically for API key connection in sandbox
const ApiKeyConnect: React.FC = () => {
    const handleConnect = async () => {
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
            window.location.reload(); // Reload to ensure key is picked up in env
        } else {
            alert("Deze knop werkt alleen in de specifieke testomgeving.");
        }
    };
    return (
        <button 
            onClick={handleConnect}
            className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
        >
            API Sleutel Instellen
        </button>
    );
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LIST);

  const renderContent = () => {
    switch (activeTab) {
      case Tab.LIST:
        return <WordList words={vocabulary} />;
      case Tab.FLASHCARDS:
        return <Flashcards words={vocabulary} />;
      case Tab.QUIZ:
        return <Quiz words={vocabulary} />;
      case Tab.CHAT:
        return <AiChat />;
      case Tab.IMAGE:
        return <ImageGenerator />;
      default:
        return <WordList words={vocabulary} />;
    }
  };

  const navItems = [
    { tab: Tab.LIST, icon: <BookOpen size={20} />, label: 'Woorden' },
    { tab: Tab.FLASHCARDS, icon: <Copy size={20} />, label: 'Oefenen' },
    { tab: Tab.QUIZ, icon: <BrainCircuit size={20} />, label: 'Quiz' },
    { tab: Tab.CHAT, icon: <MessageCircle size={20} />, label: 'Vraag de Mol' },
    { tab: Tab.IMAGE, icon: <ImageIcon size={20} />, label: 'Plaatjes' },
  ];

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 shadow-lg sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
             <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
                🦡 De Ondergrondse Wereld
             </h1>
             <p className="text-amber-100 text-sm mt-1">Leer alles voor je examen!</p>
          </div>
          <div className="hidden md:block">
              <ApiKeyConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4 md:p-8 animate-fade-in">
        {renderContent()}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden z-50">
        <div className="flex justify-around p-2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors w-full ${
                activeTab === item.tab 
                  ? 'text-amber-600 bg-amber-50' 
                  : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold mt-1">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Desktop Side Navigation (Alternative to top nav, but keeping top simple) 
          Let's implement a secondary top-sub-nav for Desktop inside main if needed, 
          but actually a sticky sidebar or just a pill menu is nice.
      */}
      <div className="hidden md:flex justify-center gap-4 mb-8 mt-4 sticky top-24 z-40">
         <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md border border-stone-200 flex gap-2">
          {navItems.map((item) => (
            <button
              key={item.tab}
              onClick={() => setActiveTab(item.tab)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                activeTab === item.tab 
                  ? 'bg-amber-500 text-white shadow-md transform scale-105' 
                  : 'text-stone-500 hover:bg-stone-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
         </div>
      </div>
    </div>
  );
};

export default App;