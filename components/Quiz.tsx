import React, { useState, useMemo } from 'react';
import { Word } from '../types';
import { CheckCircle, XCircle, Trophy, RefreshCcw } from 'lucide-react';

interface QuizProps {
  words: Word[];
}

export const Quiz: React.FC<QuizProps> = ({ words }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Randomize questions once on mount
  const questions = useMemo(() => {
    return [...words].sort(() => 0.5 - Math.random()).slice(0, 10);
  }, [words]);

  // Generate options for the current question
  const options = useMemo(() => {
    if (showScore) return [];
    const correct = questions[currentQuestion];
    const others = words
      .filter(w => w.id !== correct.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    return [correct, ...others].sort(() => 0.5 - Math.random());
  }, [currentQuestion, questions, words, showScore]);

  const handleAnswerClick = (term: string) => {
    if (selectedAnswer !== null) return; // Prevent double clicking

    setSelectedAnswer(term);
    const correct = term === questions[currentQuestion].term;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const restartQuiz = () => {
    window.location.reload(); // Simple reload to re-shuffle
  };

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <Trophy size={80} className="text-yellow-400 mb-6 drop-shadow-md" />
        <h2 className="text-3xl font-bold text-stone-800 mb-4">Goed gedaan!</h2>
        <p className="text-xl text-stone-600 mb-8">
          Je hebt <span className="font-bold text-amber-600">{score}</span> van de {questions.length} goed!
        </p>
        <button 
          onClick={restartQuiz}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-full font-bold hover:bg-amber-600 transition-colors"
        >
          <RefreshCcw size={20} />
          Nog een keer
        </button>
      </div>
    );
  }

  const currentWord = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center text-stone-500 font-bold">
        <span>Vraag {currentQuestion + 1}/{questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-md border-b-4 border-stone-200 mb-6 text-center">
        <h3 className="text-lg text-stone-400 mb-2 uppercase tracking-wide">Wat betekent dit?</h3>
        <p className="text-xl md:text-2xl font-medium text-stone-800 leading-relaxed">
          "{currentWord.definition}"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => {
            const isSelected = selectedAnswer === option.term;
            const isActualCorrect = option.id === currentWord.id;
            
            let btnClass = "bg-white border-2 border-stone-200 hover:border-amber-400";
            
            if (selectedAnswer !== null) {
                if (isSelected && isCorrect) btnClass = "bg-green-100 border-green-500 ring-2 ring-green-200";
                else if (isSelected && !isCorrect) btnClass = "bg-red-100 border-red-500 ring-2 ring-red-200";
                else if (isActualCorrect && !isSelected) btnClass = "bg-green-50 border-green-500 border-dashed";
                else btnClass = "bg-stone-50 opacity-50";
            }

            return (
              <button
                key={option.id}
                onClick={() => handleAnswerClick(option.term)}
                disabled={selectedAnswer !== null}
                className={`p-4 rounded-xl text-lg font-bold text-stone-700 transition-all transform ${btnClass} flex items-center justify-between`}
              >
                {option.term}
                {isSelected && isCorrect && <CheckCircle className="text-green-600" />}
                {isSelected && !isCorrect && <XCircle className="text-red-600" />}
              </button>
            );
        })}
      </div>
    </div>
  );
};