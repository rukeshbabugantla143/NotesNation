
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, AlertCircle, ChevronRight, GraduationCap, School } from 'lucide-react';
import { ExamAlert, StreamType } from '../types';

const EXAM_DATA: ExamAlert[] = [
  { id: '1', university: 'JNTU-H', examName: 'B.Tech R22 Sem 1-1', date: '2025-04-15', stream: 'Engineering' },
  { id: '2', university: 'BIEAP', examName: 'IPE Inter 2nd Year', date: '2025-03-01', stream: 'Intermediate' },
  { id: '3', university: 'TSBIE', examName: 'IPE Inter 1st Year', date: '2025-02-28', stream: 'Intermediate' },
  { id: '4', university: 'Osmania University', examName: 'Degree Sem 3 CBCS', date: '2025-05-10', stream: 'Degree' },
  { id: '5', university: 'JNTU-GV', examName: 'B.Tech Sem 2-2 Reg/Sup', date: '2025-04-20', stream: 'Engineering' }
];

const CountdownTimer: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        clearInterval(timer);
      } else {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((diff % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) return <span className="text-red-500 font-black">EXAM STARTED / ENDED</span>;

  return (
    <div className="flex gap-2">
      <TimerUnit val={timeLeft.d} unit="Days" />
      <TimerUnit val={timeLeft.h} unit="Hrs" />
      <TimerUnit val={timeLeft.m} unit="Min" />
    </div>
  );
};

const TimerUnit = ({ val, unit }: { val: number, unit: string }) => (
  <div className="flex flex-col items-center bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 min-w-[50px]">
    <span className="text-lg font-black leading-none">{val}</span>
    <span className="text-[8px] font-black uppercase tracking-widest text-blue-200">{unit}</span>
  </div>
);

export const ExamCenter: React.FC = () => {
  const [filter, setFilter] = useState<StreamType | 'All'>('All');

  const filteredExams = EXAM_DATA.filter(e => filter === 'All' || e.stream === filter);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
            <Clock className="h-4 w-4 mr-2" /> Live Countdown Center
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">Exam Radar</h1>
          <p className="text-slate-500 text-lg font-medium">Verified exam dates for Universities across AP & TS.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {['All', 'Engineering', 'Intermediate', 'Degree'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                filter === f ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredExams.map(exam => (
            <div key={exam.id} className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group hover:-translate-y-1 transition-all shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/30 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/10 rounded-2xl text-blue-400">
                  {exam.stream === 'Engineering' ? <GraduationCap className="h-6 w-6" /> : <School className="h-6 w-6" />}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Target Date</div>
                  <div className="text-lg font-black">{new Date(exam.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                </div>
              </div>

              <h3 className="text-2xl font-black mb-1 group-hover:text-blue-400 transition-colors">{exam.examName}</h3>
              <p className="text-slate-400 font-bold text-sm mb-8 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-slate-600" /> {exam.university}
              </p>

              <div className="flex items-end justify-between">
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">T-Minus</div>
                   <CountdownTimer targetDate={exam.date} />
                </div>
                <button className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-blue-600 hover:border-blue-500 transition-all">
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-center gap-6">
          <div className="p-4 bg-white rounded-[2rem] shadow-sm text-blue-600">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-lg">Official Notice</h4>
            <p className="text-slate-500 text-sm font-medium">Dates are sourced from official university circulars. Always cross-verify with your college hall ticket notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
