
import React, { useState } from 'react';
import { Library, Search, Download, ExternalLink, GraduationCap, School, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';

const SYLLABUS_DATA = [
  { university: 'JNTU-H', course: 'B.Tech', regulation: 'R22', link: 'https://jntuh.ac.in/syllabus' },
  { university: 'JNTU-H', course: 'B.Tech', regulation: 'R18', link: 'https://jntuh.ac.in/syllabus' },
  { university: 'Osmania University', course: 'Degree', regulation: 'CBCS 2024', link: 'https://osmania.ac.in/syllabi' },
  { university: 'SBTET (AP)', course: 'Diploma', regulation: 'C23', link: 'http://sbtet.ap.gov.in' },
  { university: 'SBTET (TS)', course: 'Diploma', regulation: 'C24', link: 'http://sbtet.telangana.gov.in' },
  { university: 'Andhra University', course: 'B.Tech', regulation: 'R23', link: 'https://andhrauniversity.edu.in' }
];

export const SyllabusLibrary: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = SYLLABUS_DATA.filter(s => 
    s.university.toLowerCase().includes(search.toLowerCase()) || 
    s.regulation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
              <Library className="h-4 w-4 mr-2" /> Official Document Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Syllabus Repository</h1>
            <p className="text-slate-500 font-medium mt-2">Download official syllabus structures directly from University sources.</p>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search JNTU, OU, AU..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-3xl outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl shadow-slate-200/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <BookOpen className="h-24 w-24 text-indigo-900" />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                   {item.course === 'B.Tech' ? <GraduationCap className="h-6 w-6" /> : <School className="h-6 w-6" />}
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.university}</div>
                   <div className="text-lg font-black text-slate-900">{item.course} Syllabus</div>
                </div>
              </div>

              <div className="mb-8">
                 <span className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black tracking-widest">
                   {item.regulation} REGULATION
                 </span>
              </div>

              <div className="flex gap-3">
                 <Button fullWidth onClick={() => window.open(item.link, '_blank')} className="rounded-2xl shadow-indigo-100">
                    <Download className="h-4 w-4 mr-2" /> PDF Link
                 </Button>
                 <a 
                   href={item.link} 
                   target="_blank" 
                   rel="noopener"
                   className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-colors border border-slate-100"
                 >
                    <ExternalLink className="h-5 w-5" />
                 </a>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-[3rem] p-24 text-center border-2 border-dashed border-slate-100">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-slate-200" />
             </div>
             <h3 className="text-2xl font-black text-slate-800">No syllabus found</h3>
             <p className="text-slate-500 font-medium">Try searching for a specific regulation like "R22" or "C23".</p>
          </div>
        )}
      </div>
    </div>
  );
};
