
import React, { useState } from 'react';
/* Added Zap to lucide-react imports to fix 'Cannot find name Zap' error */
import { HelpCircle, Plus, Search, MessageSquare, Clock, CheckCircle, ChevronRight, X, Zap } from 'lucide-react';
import { Button } from '../components/Button';
import { NoteRequest, StreamType, User } from '../types';
import { STREAMS } from '../constants';

interface RequestsProps {
  requests: NoteRequest[];
  user: User | null;
  onRequest: (data: Partial<NoteRequest>) => void;
  onOpenLogin: () => void;
  onNav: (view: any) => void;
}

export const Requests: React.FC<RequestsProps> = ({ requests, user, onRequest, onOpenLogin, onNav }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', subject: '', stream: 'Engineering' as StreamType, description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRequest(formData);
    setShowModal(false);
    setFormData({ title: '', subject: '', stream: 'Engineering', description: '' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Note Requests</h1>
          <p className="text-slate-500">Can't find what you're looking for? Ask the community!</p>
        </div>
        <Button size="lg" onClick={() => user ? setShowModal(true) : onOpenLogin()} className="shadow-xl shadow-blue-100">
          <Plus className="h-5 w-5 mr-2" /> Post a Request
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {requests.length > 0 ? (
            requests.map((req) => (
              <div key={req.id} className="bg-white rounded-[2rem] border border-slate-100 p-6 md:p-8 hover:shadow-xl hover:border-blue-100 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 mb-2 border border-blue-100">
                      {req.stream}
                    </span>
                    <h3 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">{req.title}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${req.status === 'Open' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                    {req.status}
                  </div>
                </div>
                
                <p className="text-slate-600 mb-8 line-clamp-2 font-medium relative z-10">{req.description || `Missing study material for ${req.subject}. If you have notes for this subject, please help by uploading them.`}</p>
                
                <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-xs text-slate-400 font-bold">
                      <Clock className="h-3.5 w-3.5 mr-2 text-blue-500" />
                      {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-xs text-slate-400 font-bold">
                      <MessageSquare className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                      By {req.requesterName}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => user ? onNav('upload') : onOpenLogin()}
                    className="text-blue-600 font-black uppercase tracking-widest text-[10px]"
                  >
                    Fulfill Request <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-200 p-20 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                <HelpCircle className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">No active requests</h3>
              <p className="text-slate-500 font-medium">Every student is happy! Check back later or post your own.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-32 -mt-32 transition-transform group-hover:scale-110"></div>
             <div className="relative z-10">
               <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7 text-yellow-400" />
               </div>
               <h3 className="text-2xl font-black mb-4">Earn Extra Points!</h3>
               <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                 Helping a peer by fulfilling a request earns you <span className="font-black text-blue-400 text-lg">25 points</span> and a special Contributor Badge.
               </p>
               <div className="space-y-4">
                  <div className="flex items-center text-xs font-bold text-slate-300">
                     <CheckCircle className="h-4 w-4 mr-3 text-green-500" /> 
                     Instant Point Bonus
                  </div>
                  <div className="flex items-center text-xs font-bold text-slate-300">
                     <CheckCircle className="h-4 w-4 mr-3 text-green-500" /> 
                     Verified Badge Boost
                  </div>
               </div>
             </div>
          </div>
          
          <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
             <h4 className="font-black text-slate-900 mb-4 flex items-center">
                <HelpCircle className="h-5 w-5 mr-2 text-blue-600" /> Need Help?
             </h4>
             <p className="text-sm text-slate-600 font-medium leading-relaxed">
                Contact our support if you're facing issues with posting or fulfilling requests.
             </p>
             <button 
                onClick={() => onNav('contact')}
                className="mt-4 text-blue-600 text-xs font-black uppercase tracking-widest hover:underline"
             >
                Contact Support
             </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 animate-pop-in shadow-2xl border border-slate-100">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-3xl font-black text-slate-900">Post Request</h2>
                   <p className="text-slate-500 font-medium mt-1">Tell us what you're looking for.</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <X className="h-6 w-6" />
                </button>
             </div>

             <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Request Title</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g., Unit 3 Discrete Math notes"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Subject</label>
                    <input 
                      required 
                      type="text" 
                      placeholder="e.g., Math-III"
                      value={formData.subject}
                      onChange={e => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Stream</label>
                    <select 
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium cursor-pointer"
                      value={formData.stream}
                      onChange={e => setFormData({...formData, stream: e.target.value as StreamType})}
                    >
                      {STREAMS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Description (Optional)</label>
                  <textarea 
                    rows={3}
                    placeholder="Details like branch, regulation, or specific topics..."
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium resize-none"
                  ></textarea>
                </div>
                
                <div className="pt-6 flex gap-4">
                  <Button variant="outline" fullWidth type="button" onClick={() => setShowModal(false)} className="rounded-2xl">Cancel</Button>
                  <Button fullWidth type="submit" className="rounded-2xl shadow-xl shadow-blue-100">Post Now</Button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};
