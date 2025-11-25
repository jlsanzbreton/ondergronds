import React from 'react';
import { Word } from '../types';

interface WordListProps {
  words: Word[];
}

export const WordList: React.FC<WordListProps> = ({ words }) => {
  const lesson1 = words.filter(w => w.lesson === 1);
  const lesson5 = words.filter(w => w.lesson === 5);

  const renderSection = (title: string, list: Word[], colorClass: string) => (
    <div className="mb-8">
      <h3 className={`text-2xl font-bold mb-4 ${colorClass}`}>{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map(word => (
          <div key={word.id} className="bg-white p-4 rounded-xl shadow-sm border-2 border-stone-100 hover:border-amber-200 transition-colors">
            <h4 className="text-xl font-bold text-stone-700 mb-1">{word.term}</h4>
            <p className="text-stone-600">{word.definition}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      {renderSection("Les 1 – Ondergronds (Deel 1)", lesson1, "text-amber-600")}
      {renderSection("Les 5 – Ondergronds (Deel 2)", lesson5, "text-emerald-600")}
    </div>
  );
};