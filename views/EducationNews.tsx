
import React, { useState, useEffect } from 'react';
import { 
  Bell, Globe, RefreshCw, ExternalLink, 
  MapPin, Clock, Calendar, CheckCircle2,
  Newspaper, Info, Sparkles, ShieldCheck, AlertCircle
} from 'lucide-react';
import { Button } from '../components/Button';
import { AIService } from '../services/ai';

const CATEGORIES = ['All', 'Exams', 'Results', 'Admissions', 'Policy'];

export const EducationNews: React.FC = () => {
  const [state, setState] = useState<'AP' | 'TS'>('AP');
  const [category, setCategory] = useState('All');
  const [newsData, setNewsData] = useState<{ text: string; sources: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isKeyRequired, setIsKeyRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    // Check if window.aistudio is available
    if (!(window as any).aistudio) {
      setError("AI Studio environment not detected.");
      return;
    }

    const hasKey = await (window as any).aistudio.hasSelectedApiKey();
    if (!hasKey) {
      setIsKeyRequired(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await AIService.getLatestEducationNews(state, category);
      setNewsData(data);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        setIsKeyRequired(true);
      } else {
        setError("Failed to fetch news. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeySelect = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      // Per rule: assume successful after triggering openSelectKey()
      setIsKeyRequired(false);
      fetchNews();
    } catch (err) {
      console.error("Key selection error:", err);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [state, category]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
               <Globe className="h-4 w-4 mr-2" /> Live News Radar
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Verified Academic Alerts</h1>
            <p className="text-slate-500 font-medium max-w-xl mt-2">
              Stay ahead with real-time official news grounded by NationAI across AP & TS Universities.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-2 rounded-[2rem] border border-slate-200 shadow-sm">
             <button 
               onClick={() => setState('AP')}
               className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${state === 'AP' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Andhra Pradesh
             </button>
             <button 
               onClick={() => setState('TS')}
               className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${state === 'TS' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
             >
               Telangana
             </button>
          </div>
        </div>

        {/* Category Bar */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                category === cat 
                ? 'bg-white border-blue-200 text-blue-600 shadow-lg ring-2 ring-blue-50' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Main Feed */}
           <div className="lg:col-span-8 space-y-6">
              {isLoading ? (
                <div className="bg-white rounded-[3rem] p-24 text-center border border-slate-100 shadow-xl">
                   <div className="relative inline-block mb-6">
                      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <Sparkles className="h-6 w-6 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                   </div>
                   <h3 className="text-xl font-black text-slate-800">NationAI is Grounding...</h3>
                   <p className="text-slate-400 text-sm mt-2">Connecting to official education endpoints across {state}.</p>
                </div>
              ) : isKeyRequired ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32"></div>
                   <div className="relative z-10">
                      <ShieldCheck className="h-16 w-16 text-indigo-500 mx-auto mb-6" />
                      <h3 className="text-2xl font-black text-slate-900 mb-2">Paid API Key Required</h3>
                      <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
                        Grounded search with live citations is an advanced feature. Please select a API key from a paid GCP project to continue.
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button size="lg" onClick={handleKeySelect} className="px-8 py-4">Select API Key</Button>
                        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener" className="inline-flex items-center justify-center px-8 py-4 bg-slate-100 text-slate-600 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-200">
                           Billing Docs <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      </div>
                   </div>
                </div>
              ) : error ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-slate-100 shadow-xl">
                   <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                   <h3 className="text-2xl font-black text-slate-900 mb-2">Oops!</h3>
                   <p className="text-slate-500 font-medium mb-8">{error}</p>
                   <Button variant="outline" onClick={fetchNews}>Try Again</Button>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-xl">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xl font-black text-slate-900 flex items-center">
                           <Newspaper className="h-5 w-5 text-blue-600 mr-2" /> Live Briefing
                         </h3>
                         <button onClick={fetchNews} className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 transition-colors">
                           <RefreshCw className="h-4 w-4" />
                         </button>
                      </div>
                      <div className="prose prose-slate max-w-none">
                         <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-medium bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100/50">
                            {newsData?.text || "No recent updates found for this category."}
                         </div>
                      </div>
                   </div>

                   {/* Grounding Citations */}
                   {newsData?.sources && newsData.sources.length > 0 && (
                     <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" /> Grounding Citations
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           {newsData.sources.map((source, idx) => (
                             <a 
                               key={idx} 
                               href={source.web?.uri || '#'} 
                               target="_blank" 
                               rel="noopener"
                               className="p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all flex items-start gap-4 group"
                             >
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                   {idx + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                   <p className="text-xs font-black text-slate-800 truncate mb-1">{source.web?.title || 'External Source'}</p>
                                   <p className="text-[10px] text-blue-600 font-bold truncate opacity-60">{source.web?.uri}</p>
                                </div>
                                <ExternalLink className="h-3 w-3 text-slate-300 ml-auto group-hover:text-blue-600" />
                             </a>
                           ))}
                        </div>
                     </div>
                   )}
                </div>
              )}
           </div>

           {/* Sidebar Info */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/10 rounded-2xl">
                       <Bell className="h-6 w-6 text-amber-400 animate-swing" />
                    </div>
                    <h4 className="text-lg font-black tracking-tight">Exam Season Alert</h4>
                 </div>
                 <p className="text-slate-400 text-xs leading-relaxed font-medium mb-6">
                    Official bodies typically release hall tickets 7-10 days before exams. Keep your mobile notifications ON for instant state-wide updates.
                 </p>
                 <div className="space-y-3">
                    <AlertItem icon={<Clock className="h-4 w-4" />} text="TS Inter Hall Tickets (Expected: Mar 15)" />
                    <AlertItem icon={<Calendar className="h-4 w-4" />} text="JNTU R22 Sem Results (Out Now)" />
                 </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Quick Links</h4>
                 <div className="grid grid-cols-1 gap-2">
                    <QuickLink label="JNTU-H Portal" uri="https://jntuh.ac.in" />
                    <QuickLink label="JNTU-GV Portal" uri="https://jntugv.edu.in" />
                    <QuickLink label="BIEAP Official" uri="https://bieap.apcfss.in" />
                    <QuickLink label="TSBIE Official" uri="https://tsbie.cgg.gov.in" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const AlertItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl">
     <div className="text-blue-400">{icon}</div>
     <span className="text-[10px] font-bold text-slate-300">{text}</span>
  </div>
);

const QuickLink = ({ label, uri }: { label: string, uri: string }) => (
  <a href={uri} target="_blank" rel="noopener" className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-blue-50 hover:border-blue-200 transition-all group">
     <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600">{label}</span>
     <ExternalLink className="h-3 w-3 text-slate-300 group-hover:text-blue-600" />
  </a>
);
