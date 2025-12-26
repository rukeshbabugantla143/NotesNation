
import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, RotateCw, ChevronLeft, ChevronRight, CheckCircle2, XCircle, Info, Zap, Trophy } from 'lucide-react';
import { Button } from '../components/Button';
import { AIService } from '../services/ai';

interface Flashcard {
  question: string;
  answer: string;
}

export const Flashcards: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('');
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [masteredCount, setMasteredCount] = useState(0);

  const handleGenerate = async () => {
    if (!topic || !subject) return;
    setIsLoading(true);
    setCards([]);
    setCurrentIndex(0);
    setMasteredCount(0);
    try {
      const data = await AIService.generateFlashcards(topic, subject);
      setCards(data);
    } catch (err) {
      alert("Failed to generate cards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handleMastered = () => {
    setMasteredCount(prev => prev + 1);
    handleNext();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
           <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
             <Brain className="h-4 w-4 mr-2" /> Spaced Repetition
           </div>
           <h1 className="text-4xl font-black text-slate-900 mb-4">NationAI Flashcards</h1>
           <p className="text-slate-500 font-medium">Turn any topic into interactive review cards in seconds.</p>
        </div>

        {cards.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-2xl">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                   <input 
                    type="text" 
                    placeholder="e.g. Operating Systems"
                    value={subject}
                    onChange={e => setSubject(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic</label>
                   <input 
                    type="text" 
                    placeholder="e.g. Process Scheduling"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                   />
                </div>
             </div>
             <Button fullWidth size="lg" onClick={handleGenerate} isLoading={isLoading} className="py-6 rounded-3xl">
                <Sparkles className="h-5 w-5 mr-3" /> Generate Deck
             </Button>
             <div className="mt-8 flex items-center justify-center gap-6">
                <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <Zap className="h-3 w-3 mr-2 text-yellow-400" /> Instant Results
                </div>
                <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   <Trophy className="h-3 w-3 mr-2 text-blue-500" /> Exam Focused
                </div>
             </div>
          </div>
        ) : (
          <div className="space-y-8 animate-pop-in">
            {/* Progress Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
               <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span className="text-slate-400">Mastery Progress</span>
                    <span className="text-indigo-600">{Math.round((masteredCount / cards.length) * 100)}%</span>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                     <div 
                      className="h-full bg-indigo-600 transition-all duration-700" 
                      style={{ width: `${(masteredCount / cards.length) * 100}%` }}
                     />
                  </div>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setCards([])}>Reset</Button>
            </div>

            {/* The Flashcard */}
            <div className="perspective-1000 h-[350px] w-full cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
               <div className={`relative w-full h-full transition-all duration-500 preserve-3d shadow-2xl rounded-[3rem] ${isFlipped ? 'rotate-y-180' : ''}`}>
                  {/* Front */}
                  <div className="absolute inset-0 backface-hidden bg-white rounded-[3rem] p-12 flex flex-col items-center justify-center text-center border-4 border-slate-50">
                     <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Question {currentIndex + 1} of {cards.length}</div>
                     <h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">{cards[currentIndex].question}</h3>
                     <div className="absolute bottom-8 text-indigo-400 font-black text-[10px] uppercase tracking-widest flex items-center animate-pulse">
                        <RotateCw className="h-4 w-4 mr-2" /> Click to Flip
                     </div>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 bg-indigo-600 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center text-white">
                     <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-indigo-200 uppercase tracking-widest">The Explanation</div>
                     <p className="text-lg md:text-xl font-bold leading-relaxed">{cards[currentIndex].answer}</p>
                     <div className="absolute bottom-8 flex gap-4">
                        <button onClick={(e) => { e.stopPropagation(); handleNext(); }} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Still Learning</button>
                        <button onClick={(e) => { e.stopPropagation(); handleMastered(); }} className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/20 transition-all">Got It!</button>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex justify-between items-center text-slate-400 font-bold text-xs uppercase tracking-widest px-4">
               <button onClick={handleNext} className="flex items-center hover:text-indigo-600"><ChevronLeft className="h-4 w-4 mr-2" /> Previous</button>
               <span>{currentIndex + 1} / {cards.length}</span>
               <button onClick={handleNext} className="flex items-center hover:text-indigo-600">Next <ChevronRight className="h-4 w-4 ml-2" /></button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
