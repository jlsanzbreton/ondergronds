import React, { useState } from 'react';
import { Word } from '../types';
import { ArrowLeft, ArrowRight, RotateCw } from 'lucide-react';

interface FlashcardsProps {
  words: Word[];
}

export const Flashcards: React.FC<FlashcardsProps> = ({ words }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Shuffle functionality could be added, but keeping it simple ordered for now
  const currentWord = words[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 200);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
    }, 200);
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full text-center mb-4 text-stone-500 font-bold">
        Kaart {currentIndex + 1} van {words.length}
      </div>

      <div 
        onClick={handleFlip}
        className="group perspective w-full h-80 cursor-pointer"
        style={{ perspective: '1000px' }}
      >
        <div 
          className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d shadow-xl rounded-3xl border-b-8 border-stone-200 ${isFlipped ? 'rotate-y-180' : ''}`}
          style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {/* Front */}
          <div 
            className="absolute w-full h-full backface-hidden bg-white rounded-3xl flex flex-col items-center justify-center p-8"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <span className="text-sm font-bold text-amber-500 mb-4 uppercase tracking-wider">Het Woord</span>
            <h2 className="text-4xl font-bold text-stone-800">{currentWord.term}</h2>
            <p className="mt-8 text-stone-400 text-sm">Klik om om te draaien</p>
          </div>

          {/* Back */}
          <div 
            className="absolute w-full h-full backface-hidden bg-amber-100 rounded-3xl flex flex-col items-center justify-center p-8 rotate-y-180"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <span className="text-sm font-bold text-amber-600 mb-4 uppercase tracking-wider">De Betekenis</span>
            <p className="text-2xl font-medium text-stone-800 leading-relaxed">{currentWord.definition}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button 
          onClick={handlePrev}
          className="p-4 bg-white rounded-full shadow-md text-stone-600 hover:bg-stone-100 hover:text-amber-600 transition-all"
        >
          <ArrowLeft size={32} />
        </button>
        <button 
          onClick={handleFlip}
          className="p-4 bg-amber-500 rounded-full shadow-md text-white hover:bg-amber-600 hover:scale-105 transition-all"
        >
          <RotateCw size={32} />
        </button>
        <button 
          onClick={handleNext}
          className="p-4 bg-white rounded-full shadow-md text-stone-600 hover:bg-stone-100 hover:text-amber-600 transition-all"
        >
          <ArrowRight size={32} />
        </button>
      </div>
    </div>
  );
};