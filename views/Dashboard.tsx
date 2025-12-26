
import React, { useState } from 'react';
import { User, Note } from '../types';
import { FileText, Award, TrendingUp, Clock, CheckCircle2, AlertCircle, Bookmark, Heart, ThumbsUp } from 'lucide-react';
import { Button } from '../components/Button';
import { NoteCard } from '../components/NoteCard';

interface DashboardProps {
  user: User;
  notes: Note[]; // All notes uploaded by the user
  allNotes: Note[]; // All available notes to filter for bookmarks
  onDownload: (id: string) => void;
  onLike: (id: string) => void;
  onToggleBookmark: (id: string, isBookmarked: boolean) => void;
  onNav: (view: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  notes, 
  allNotes, 
  onDownload, 
  onLike, 
  onToggleBookmark,
  onNav
}) => {
  const [activeTab, setActiveTab] = useState<'uploads' | 'saved'>('uploads');
  
  const approvedCount = notes.filter(n => n.status === 'Approved').length;
  const pendingCount = notes.filter(n => n.status === 'Pending').length;
  const totalLikes = notes.reduce((acc, note) => acc + note.likes, 0);
  
  const savedNotes = allNotes.filter(n => user.bookmarks.includes(n.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      {/* Profile Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
           <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="h-24 w-24 rounded-[2rem] bg-blue-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-blue-200">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl font-black text-slate-900 mb-2">{user.name || 'User'}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center">
                    <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
                    {user.mobileNumber}
                  </span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full hidden md:block"></span>
                  <span className="flex items-center capitalize"><Award className="h-4 w-4 mr-2 text-amber-500" /> {user.role}</span>
                </div>
              </div>
           </div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
              <StatBox label="Total Points" value={user.points} color="text-blue-600" />
              <StatBox label="Total Likes" value={totalLikes} color="text-red-600" />
              <StatBox label="Approved" value={approvedCount} color="text-green-600" />
              <StatBox label="Pending" value={pendingCount} color="text-amber-600" />
           </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl flex flex-col items-center justify-center text-center border border-white/10 group">
           <Award className={`h-20 w-20 mb-6 transition-transform group-hover:scale-110 ${user.badge === 'Gold' ? 'text-yellow-400' : user.badge === 'Silver' ? 'text-slate-300' : 'text-amber-600'}`} />
           <h3 className="text-2xl font-black mb-2">Rank: {user.badge || 'Newbie'}</h3>
           <p className="text-slate-400 text-sm font-medium px-4">Keep uploading to earn badges and unlock exclusive community features.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 mb-8 bg-slate-100 p-1 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('uploads')}
          className={`flex items-center px-6 py-2.5 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'uploads' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <FileText className="h-4 w-4 mr-2" /> My Uploads
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={`flex items-center px-6 py-2.5 text-sm font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'saved' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Bookmark className="h-4 w-4 mr-2" /> Saved Notes
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'uploads' ? (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900">Your Contribution History</h2>
             <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{notes.length} Files Total</span>
          </div>
          
          {notes.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {notes.map(note => (
                <div key={note.id} className="p-6 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-2xl mr-4 ${note.status === 'Approved' ? 'bg-green-50 text-green-600' : note.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{note.title}</h4>
                      <p className="text-xs text-slate-400 font-medium">{note.subject} • {new Date(note.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                     <div className="text-center">
                        <div className="font-black text-slate-700">{note.likes}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Likes</div>
                     </div>
                     <div className="text-center">
                        <div className="font-black text-slate-700">{note.downloads}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Downloads</div>
                     </div>
                     <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center ${
                       note.status === 'Approved' ? 'bg-green-100 text-green-600' : 
                       note.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 
                       'bg-red-100 text-red-600'
                     }`}>
                       {note.status === 'Approved' ? <CheckCircle2 className="h-3 w-3 mr-2" /> : <Clock className="h-3 w-3 mr-2" />}
                       {note.status}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-10 w-10 text-slate-200" />
               </div>
               <h3 className="text-xl font-bold text-slate-400">No uploads yet</h3>
               <p className="text-slate-500 mb-8 max-w-xs mx-auto">Start contributing to earn points and help your fellow students.</p>
               <Button variant="outline" onClick={() => onNav('upload')}>Upload First Note</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="animate-fade-in">
          {savedNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedNotes.map(note => (
                <NoteCard 
                  key={note.id} 
                  note={note} 
                  onDownload={onDownload} 
                  onLike={onLike} 
                  onToggleBookmark={onToggleBookmark}
                  isBookmarked={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl py-24 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bookmark className="h-10 w-10 text-slate-200" />
               </div>
               <h3 className="text-xl font-bold text-slate-400">Your bookshelf is empty</h3>
               <p className="text-slate-500 mb-8 max-w-xs mx-auto">Save high-quality notes from the library to access them quickly here.</p>
               <Button variant="outline" onClick={() => onNav('browse')}>Browse Materials</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatBox = ({ label, value, color }: { label: string, value: number, color: string }) => (
  <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100 transition-all hover:shadow-lg hover:-translate-y-1">
    <div className={`text-2xl font-black mb-0.5 ${color}`}>{value}</div>
    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);
