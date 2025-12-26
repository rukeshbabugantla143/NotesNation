
import React, { useState } from 'react';
import { 
  Users, MessageSquare, Megaphone, Trophy, 
  ArrowRight, Heart, MapPin, 
  Bell, Globe, ArrowLeft, Send
} from 'lucide-react';
import { STREAMS } from '../constants';
import { StreamType } from '../types';
import { Button } from '../components/Button';

const BRAND_LOGO = "https://yt3.googleusercontent.com/2xTXlSO7Wo-5IuIWw3TfvrnbUjFtUrl8LuSn8YMg5J-3gJp7P8dfUqP8_Kesl58MiA3-zbHNJ0Y=s900-c-k-c0x00ffffff-no-rj";

export const Communities: React.FC = () => {
  const [selectedStream, setSelectedStream] = useState<StreamType | null>(null);

  if (!selectedStream) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
              <Users className="h-4 w-4 mr-2" /> Student Hubs
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">Join Your Community</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
              Connect with thousands of students from your specific stream across AP & TS. Share insights, get updates, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {STREAMS.map((stream) => (
              <div 
                key={stream.id}
                onClick={() => setSelectedStream(stream.id)}
                className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer group relative overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 ${stream.color}`}></div>
                
                <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white mb-8 shadow-xl shadow-current/20 ${stream.color}`}>
                  {React.cloneElement(stream.icon as React.ReactElement, { className: 'h-8 w-8' } as any)}
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2">{stream.label} Elite</h3>
                <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed">
                  The official community for {stream.label} students. Discussion on syllabus, exams, and resources.
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white">
                      +1.2k
                    </div>
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-2 transition-transform">
                    <ArrowRight className="h-6 w-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                <div className="flex-1">
                   <h2 className="text-3xl font-black mb-4">Can't find your college?</h2>
                   <p className="text-slate-400 font-medium"> We are constantly expanding our community reach. Suggest a specific college community to our admins.</p>
                </div>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 px-8 py-4">Suggest Community</Button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  const currentStream = STREAMS.find(s => s.id === selectedStream);

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      <div className={`h-48 md:h-64 relative overflow-hidden ${currentStream?.color}`}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 h-full flex flex-col justify-center relative z-10">
           <button 
             onClick={() => setSelectedStream(null)}
             className="w-fit flex items-center text-white/80 hover:text-white mb-4 font-black uppercase tracking-widest text-[10px] bg-black/10 px-4 py-2 rounded-full backdrop-blur-md transition-all"
           >
             <ArrowLeft className="h-3 w-3 mr-2" /> Back to Hubs
           </button>
           <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-lg">{selectedStream} Community</h1>
           <div className="flex items-center gap-4 mt-4">
              <span className="flex items-center text-white/90 font-bold text-xs"><Globe className="h-3 w-3 mr-1.5" /> India-Wide Hub</span>
              <span className="w-1 h-1 bg-white/50 rounded-full"></span>
              <span className="flex items-center text-white/90 font-bold text-xs"><Users className="h-3 w-3 mr-1.5" /> 4.2k Active Members</span>
           </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Feed Area */}
          <div className="lg:col-span-8 space-y-8 pb-20">
            {/* Announcement Board */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6">
                  <Megaphone className={`h-12 w-12 opacity-5 ${currentStream?.color.replace('bg-', 'text-')}`} />
               </div>
               <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center">
                 <Bell className="h-5 w-5 text-amber-500 mr-2 animate-swing" /> Community Bulletin
               </h3>
               <div className="space-y-4">
                  <AnnouncementItem 
                    title="JNTU Exam Schedules (AP & TS)" 
                    time="2 hours ago" 
                    tag="Official"
                  />
                  <AnnouncementItem 
                    title="New Engineering Mathematics-III Notes Uploaded" 
                    time="5 hours ago" 
                    tag="Resource"
                  />
               </div>
            </div>

            {/* Simulated Live Lounge */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black text-slate-900 flex items-center">
                    <MessageSquare className="h-5 w-5 text-blue-500 mr-2" /> Live Member Lounge
                  </h3>
                  <div className="flex items-center px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span> 42 Online
                  </div>
               </div>

               <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  <ChatMessage user="Rahul S." message="Does anyone have the previous year papers for Fluid Mechanics?" time="12:45 PM" />
                  <ChatMessage user="Priya K." message="I just uploaded the lab records for CSE 3rd Year. Check them out in the library!" time="12:42 PM" />
                  <ChatMessage user="Sameer" message="Can anyone help with the JNTU R22 syllabus roadmap?" time="12:38 PM" />
               </div>

               <div className="mt-8 pt-8 border-t border-slate-50 flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Type a message to the community..." 
                    className="flex-grow bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <button className="p-4 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-100 hover:scale-105 active:scale-95 transition-all">
                    <Send className="h-5 w-5" />
                  </button>
               </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
             {/* Top Contributors for this stream */}
             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                   <Trophy className="h-4 w-4 mr-2 text-yellow-500" /> Stream Leaders
                </h3>
                <div className="space-y-4">
                   {[
                     { name: 'Kiran Babu', pts: 450, rank: 1 },
                     { name: 'Swathi R.', pts: 320, rank: 2 },
                     { name: 'Arjun V.', pts: 280, rank: 3 }
                   ].map(user => (
                     <div key={user.name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500">
                             {user.name.charAt(0)}
                           </div>
                           <span className="font-bold text-sm text-slate-700">{user.name}</span>
                        </div>
                        <span className="text-xs font-black text-blue-600">{user.pts} pts</span>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-3 border-t border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                  View Full Leaderboard
                </button>
             </div>

             <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl border-t-4 border-t-red-500">
                <Heart className="h-8 w-8 text-red-500 mb-4 fill-current opacity-20" />
                <h4 className="text-lg font-black text-slate-900 mb-2">Help the Community</h4>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 font-medium">
                  NotesNation is kept free by student donations. Support our mission to digitize every college's knowledge.
                </p>
                <Button fullWidth size="sm" variant="outline" className="text-red-600 border-red-100 hover:bg-red-50">
                  Contribute Now
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnnouncementItem = ({ title, time, tag }: { title: string, time: string, tag: string }) => (
  <div className="group p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">
            {tag}
          </span>
          <span className="text-[10px] text-slate-400 font-bold">{time}</span>
        </div>
        <p className="text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors leading-snug">
          {title}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100" />
    </div>
  </div>
);

const ChatMessage = ({ user, message, time, isBot = false }: { user: string, message: string, time: string, isBot?: boolean }) => (
  <div className={`flex gap-3 animate-fade-in ${isBot ? 'bg-blue-50/50 p-4 rounded-3xl border border-blue-50' : ''}`}>
    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-xs ${isBot ? 'bg-white shadow-sm' : 'bg-slate-100 text-slate-400'}`}>
      {user.charAt(0)}
    </div>
    <div>
      <div className="flex items-baseline gap-2 mb-0.5">
        <span className={`text-xs font-black ${isBot ? 'text-blue-700' : 'text-slate-900'}`}>{user}</span>
        <span className="text-[8px] text-slate-400 font-bold uppercase">{time}</span>
      </div>
      <p className="text-sm text-slate-600 leading-relaxed font-medium">{message}</p>
    </div>
  </div>
);
