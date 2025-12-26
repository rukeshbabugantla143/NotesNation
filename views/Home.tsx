
import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Upload, Download, ShieldCheck, Users, BookOpen, Quote, Sparkles, Zap, Megaphone, Bell } from 'lucide-react';
import { Button } from '../components/Button';
import { STREAMS } from '../constants';
import { NoteCard } from '../components/NoteCard';
import { Note, StreamType } from '../types';

interface HomeProps {
  featuredNotes: Note[];
  onExplore: (stream?: StreamType) => void;
  onUpload: () => void;
  onDownload: (id: string) => void;
  onLike: (id: string) => void;
  onToggleBookmark: (id: string, isBookmarked: boolean) => void;
  userBookmarks: string[];
}

const RECENT_UPDATES = [
  "FOLLOW US IN INSTAGRAM",
  "SUBSCRIBE US IN YOUTUBE",
  "JOIN IN OUR TELEGRAM GROUPS FOR MORE UPDATES"
];

const TypingEffect: React.FC<{ text: string; speed?: number; cursor?: boolean }> = ({ text, speed = 40, cursor = true }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <span className="relative">
      {displayedText}
      {cursor && <span className="inline-block w-[2px] h-[1em] bg-blue-500 ml-1 animate-pulse align-middle" />}
    </span>
  );
};

export const Home: React.FC<HomeProps> = ({ 
  featuredNotes, 
  onExplore, 
  onUpload, 
  onDownload, 
  onLike,
  onToggleBookmark,
  userBookmarks
}) => {
  const [currentUpdateIndex, setCurrentUpdateIndex] = useState(0);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      setCurrentUpdateIndex(prev => (prev + 1) % RECENT_UPDATES.length);
    }, 6000);
    return () => clearInterval(updateInterval);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50 -ml-20 -mb-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge Area */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 animate-fade-in">
            {/* UPDATES TYPING BADGE */}
            <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-xl shadow-indigo-500/5 max-w-[90vw] md:max-w-lg overflow-hidden">
              <div className="bg-indigo-600 p-1 rounded-md mr-3">
                 <Bell className="h-3 w-3 text-white fill-current animate-bounce" />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest flex items-center whitespace-nowrap">
                <span className="text-slate-700 truncate inline-block">
                   <TypingEffect text={RECENT_UPDATES[currentUpdateIndex]} speed={30} />
                </span>
              </span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            Share Notes with Your <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              College Community
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 leading-relaxed animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
            The only platform built for Indian students. Search notes specifically for your 
            University or College and help others pass their exams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16 animate-slide-up opacity-0" style={{ animationDelay: '0.6s' }}>
            <div className="relative w-full max-w-md group">
              <input 
                type="text" 
                placeholder="Search your College or Subject..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 focus:border-blue-500 focus:bg-white bg-white outline-none shadow-2xl shadow-blue-600/10 transition-all group-hover:border-slate-200 text-slate-700 placeholder:text-slate-400 font-medium"
                onKeyDown={(e) => e.key === 'Enter' && onExplore()}
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </div>
            <Button size="lg" onClick={() => onExplore()} className="px-10">
              Browse Library <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 max-w-4xl mx-auto animate-fade-in opacity-0" style={{ animationDelay: '0.8s' }}>
            {STREAMS.map((stream, idx) => (
              <div 
                key={stream.id} 
                className="flex flex-col items-center p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group shadow-sm opacity-0 animate-fade-in"
                style={{ animationDelay: `${0.8 + (idx * 0.1)}s` }}
                onClick={() => onExplore(stream.id)}
              >
                <div className={`${stream.color} p-4 rounded-[1.5rem] text-white mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-current/10`}>
                  {React.cloneElement(stream.icon as React.ReactElement, { className: 'h-8 w-8' } as any)}
                </div>
                <span className="text-sm font-black text-slate-800 text-center tracking-tight leading-tight">{stream.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Notes */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Popular Materials</h2>
              <p className="text-slate-500">Highest rated notes from your fellow students</p>
            </div>
            <Button variant="outline" onClick={() => onExplore()}>View All</Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNotes.map((note) => (
              <NoteCard 
                key={note.id} 
                note={note} 
                onDownload={onDownload} 
                onLike={onLike} 
                onToggleBookmark={onToggleBookmark}
                isBookmarked={userBookmarks.includes(note.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Community Impact */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                One PDF can help <br /> 
                <span className="text-blue-600">100+ students</span> in your campus.
              </h2>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                NotesNation is designed for real-time peer learning. When you upload a note, 
                every student in your University gets a notification. Help build the strongest 
                academic community in India.
              </p>
              <div className="space-y-4">
                {[
                  "Verified by Admin moderation team",
                  "Categorized by University & Branch",
                  "Reward points for every contribution",
                  "100% Mobile optimized for quick access"
                ].map((item, i) => (
                  <div key={i} className="flex items-center text-slate-700 font-bold">
                    <div className="bg-blue-100 p-1 rounded-full mr-3">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-100 rounded-[3rem] p-12 relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
               <div className="relative z-10 text-center">
                  <div className="bg-white p-6 rounded-[2rem] shadow-xl inline-block mb-8 transform -rotate-3 group-hover:rotate-0 transition-transform">
                     <BookOpen className="h-24 w-24 text-blue-600 mx-auto" />
                     <div className="mt-4 font-black text-slate-900">STUDY GUIDES</div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Start Sharing Today</h3>
                  <Button size="lg" onClick={onUpload} fullWidth>Upload My Notes</Button>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};