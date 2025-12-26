
import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, PenTool, ClipboardList, Lightbulb, 
  Target, GraduationCap, Zap, Search, Brain, History,
  Layout, ArrowRight, Loader2, Share2, CheckCircle2,
  FileText, MessageSquare
} from 'lucide-react';
import { Button } from '../components/Button';
import { AIService } from '../services/ai';

const BRAND_LOGO = "https://yt3.googleusercontent.com/2xTXlSO7Wo-5IuIWw3TfvrnbUjFtUrl8LuSn8YMg5J-3gJp7P8dfUqP8_Kesl58MiA3-zbHNJ0Y=s900-c-k-c0x00ffffff-no-rj";

type ToolType = 'syllabus' | 'concept' | 'quiz' | 'roadmap';

export const StudyLab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolType>('concept');
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('');
  const [stream, setStream] = useState('Engineering');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRunTool = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);

    try {
      let output = "";
      if (activeTool === 'syllabus') {
        output = await AIService.analyzeSyllabus(subject, stream, input);
      } else if (activeTool === 'concept') {
        output = await AIService.explainConcept(input);
      } else if (activeTool === 'quiz') {
        output = await AIService.generateQuiz(input, subject);
      } else if (activeTool === 'roadmap') {
        output = await AIService.analyzeSyllabus(input, stream, "Create a roadmap for this subject");
      }
      setResult(output);
    } catch (err) {
      setResult("AI Lab encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const tools = [
    { id: 'concept', label: 'Concept Deep Dive', desc: 'Detailed explanation with analogies', icon: <Brain />, color: 'bg-purple-500' },
    { id: 'syllabus', label: 'Syllabus Analyzer', desc: 'Difficulty map & time strategy', icon: <Layout />, color: 'bg-indigo-500' },
    { id: 'quiz', label: 'Quiz Generator', desc: 'Generate MCQs for any topic', icon: <ClipboardList />, color: 'bg-blue-500' },
    { id: 'roadmap', label: '7-Day Roadmap', desc: 'Unit-wise study plan', icon: <Target />, color: 'bg-emerald-500' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-white rounded-[2rem] shadow-xl mb-6 transform -rotate-2 border border-slate-100">
            <img src={BRAND_LOGO} alt="LNT" className="w-12 h-12 rounded-xl" />
            <div className="ml-4 mr-6 text-left">
              <h2 className="text-xl font-black text-slate-900 leading-tight">Learn New Things</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">NationAI Lab</p>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tight">AI Study Ecosystem</h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Advanced academic tools powered by Gemini 3 Flash to help you master any subject with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tool Selector */}
          <div className="lg:col-span-4 space-y-4">
             <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-xl">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 ml-2">Available Tools</h3>
                <div className="space-y-3">
                   {tools.map(tool => (
                     <button
                       key={tool.id}
                       onClick={() => { setActiveTool(tool.id as ToolType); setResult(null); }}
                       className={`w-full p-4 rounded-3xl text-left transition-all flex items-center group ${
                         activeTool === tool.id 
                         ? 'bg-blue-600 text-white shadow-2xl shadow-blue-200' 
                         : 'bg-slate-50 text-slate-600 hover:bg-white hover:border-slate-200 border border-transparent'
                       }`}
                     >
                       <div className={`p-3 rounded-2xl mr-4 ${activeTool === tool.id ? 'bg-white/20' : 'bg-white shadow-sm text-slate-400 group-hover:text-blue-600'} transition-colors`}>
                         {tool.icon}
                       </div>
                       <div>
                         <div className="font-black text-sm">{tool.label}</div>
                         <div className={`text-[10px] ${activeTool === tool.id ? 'text-blue-100' : 'text-slate-400'}`}>{tool.desc}</div>
                       </div>
                     </button>
                   ))}
                </div>
             </div>

             <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <Zap className="h-8 w-8 text-yellow-400 mb-4 animate-pulse" />
                <h4 className="text-lg font-black mb-2">Power Mode</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  NationAI is trained on millions of academic documents specifically for the Indian University curriculum.
                </p>
             </div>
          </div>

          {/* Workbench */}
          <div className="lg:col-span-8 space-y-8">
             <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
                <div className="p-8 md:p-12 border-b border-slate-50 bg-slate-50/50">
                   <div className="flex items-center gap-4 mb-8">
                      <div className="p-4 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200">
                        {tools.find(t => t.id === activeTool)?.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900">{tools.find(t => t.id === activeTool)?.label}</h2>
                        <p className="text-sm text-slate-500 font-medium">Refine your knowledge instantly.</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Subject Name</label>
                           <input 
                             type="text" 
                             placeholder="e.g. Thermodynamics, Anatomy..." 
                             value={subject}
                             onChange={e => setSubject(e.target.value)}
                             className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                           />
                        </div>
                        <div>
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">Stream</label>
                           <select 
                             value={stream}
                             onChange={e => setStream(e.target.value)}
                             className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                           >
                             <option value="Engineering">Engineering</option>
                             <option value="Medical">Medical</option>
                             <option value="Degree">Degree</option>
                             <option value="Nursing & Pharmacy">Nursing & Pharmacy</option>
                             <option value="Intermediate">Intermediate</option>
                           </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-2 block">
                          {activeTool === 'syllabus' ? 'Paste Syllabus Content' : 'Topic or Content to Analyze'}
                        </label>
                        <textarea 
                          rows={6}
                          placeholder={activeTool === 'concept' ? 'e.g. Explain how P-N Junction diodes work...' : 'Provide details here...'}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          className="w-full px-8 py-6 bg-white border border-slate-200 rounded-[2rem] outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-600 resize-none"
                        ></textarea>
                      </div>

                      <Button 
                        size="lg" 
                        fullWidth 
                        onClick={handleRunTool} 
                        isLoading={isLoading} 
                        className="py-6 text-xl rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 shadow-2xl shadow-blue-200"
                      >
                         <Sparkles className="h-6 w-6 mr-3" /> Process with AI
                      </Button>
                   </div>
                </div>

                {/* Results Section */}
                <div className="p-8 md:p-12 min-h-[300px] relative">
                   {!result && !isLoading && (
                     <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                        <PenTool className="h-16 w-16 mb-4 text-slate-300" />
                        <h4 className="text-xl font-bold text-slate-400">Workbench Ready</h4>
                        <p className="text-sm font-medium">Input your data above and run the AI tool.</p>
                     </div>
                   )}

                   {isLoading && (
                     <div className="py-20 text-center space-y-6">
                        <div className="relative inline-block">
                           <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                           <Brain className="h-8 w-8 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                        <div className="space-y-2">
                           <h4 className="text-xl font-black text-slate-900 animate-pulse">NationAI is Thinking...</h4>
                           <p className="text-sm text-slate-400 font-medium">Consulting academic databases across AP & TS</p>
                        </div>
                     </div>
                   )}

                   {result && (
                     <div className="animate-pop-in">
                        <div className="flex items-center justify-between mb-8">
                           <h3 className="text-xl font-black text-slate-900 flex items-center">
                              <CheckCircle2 className="h-5 w-5 text-emerald-500 mr-2" /> Study Analysis
                           </h3>
                           <div className="flex gap-2">
                              <button className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"><Share2 className="h-4 w-4"/></button>
                              <button onClick={() => window.print()} className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">Print</button>
                           </div>
                        </div>
                        <div className="prose prose-slate max-w-none prose-p:font-medium prose-p:leading-relaxed prose-headings:font-black">
                           <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-inner">
                              {result}
                           </div>
                        </div>
                        <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center">
                           <div className="p-3 bg-white rounded-xl mr-4 shadow-sm text-blue-600"><Lightbulb className="h-5 w-5" /></div>
                           <p className="text-xs text-blue-800 font-bold">NationAI Pro-Tip: Combined this AI summary with the actual PDF notes for 200% better retention.</p>
                        </div>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
