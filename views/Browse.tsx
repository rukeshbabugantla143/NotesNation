
import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronDown, BookOpen, X, Clock, TrendingUp } from 'lucide-react';
import { NoteCard } from '../components/NoteCard';
import { Note, StreamType, StateType } from '../types';
import { HIERARCHY, STREAMS, STATES, MATERIAL_TYPES } from '../constants';
import { Button } from '../components/Button';

interface BrowseProps {
  notes: Note[];
  onDownload: (id: string) => void;
  onLike: (id: string) => void;
  onToggleBookmark: (id: string, isBookmarked: boolean) => void;
  userBookmarks: string[];
  initialStream?: StreamType | '';
}

export const Browse: React.FC<BrowseProps> = ({ 
  notes, 
  onDownload, 
  onLike, 
  onToggleBookmark,
  userBookmarks,
  initialStream = '' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: '' as StateType | '',
    stream: initialStream as StreamType | '',
    course: '',
    materialType: '',
    sortBy: 'latest' as 'latest' | 'popular' | 'likes'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredNotes = useMemo(() => {
    return notes
      .filter(n => n.status === 'Approved')
      .filter(n => {
        const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             n.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesState = filters.state ? n.state === filters.state : true;
        const matchesStream = filters.stream ? n.stream === filters.stream : true;
        const matchesCourse = filters.course ? n.course === filters.course : true;
        const matchesMaterial = filters.materialType ? n.materialType === filters.materialType : true;
        
        return matchesSearch && matchesState && matchesStream && matchesCourse && matchesMaterial;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'latest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (filters.sortBy === 'popular') return b.downloads - a.downloads;
        if (filters.sortBy === 'likes') return b.likes - a.likes;
        return 0;
      });
  }, [notes, searchTerm, filters]);

  const activeFiltersCount = Object.values(filters).filter(v => v !== '' && v !== 'latest').length;

  const clearFilters = () => {
    setFilters({
      state: '',
      stream: '',
      course: '',
      materialType: '',
      sortBy: 'latest'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <aside className="hidden md:block w-64 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-blue-600" /> Filters
            </h3>
            {activeFiltersCount > 0 && (
              <button onClick={clearFilters} className="text-xs text-blue-600 font-medium hover:underline">Clear all</button>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">State</label>
              <select 
                value={filters.state} 
                onChange={(e) => setFilters({...filters, state: e.target.value as StateType})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All States</option>
                {STATES.map(s => <option key={s} value={s}>{s === 'AP' ? 'Andhra Pradesh' : 'Telangana'}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Stream</label>
              <select 
                value={filters.stream} 
                onChange={(e) => setFilters({...filters, stream: e.target.value as StreamType, course: ''})}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Streams</option>
                {STREAMS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>

            {filters.stream && (HIERARCHY as any)[filters.stream]?.courses && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Course</label>
                <select 
                  value={filters.course} 
                  onChange={(e) => setFilters({...filters, course: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">All Courses</option>
                  {(HIERARCHY as any)[filters.stream].courses.map((c: string) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Material Type</label>
              <div className="flex flex-col space-y-2">
                {MATERIAL_TYPES.slice(0, 6).map(type => (
                  <label key={type} className="flex items-center group cursor-pointer">
                    <input 
                      type="radio" 
                      name="material" 
                      checked={filters.materialType === type}
                      onChange={() => setFilters({...filters, materialType: type})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" 
                    />
                    <span className="ml-2 text-sm text-slate-600 group-hover:text-blue-600 transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div className="relative flex-grow max-w-lg">
              <input 
                type="text" 
                placeholder="Search subjects or topics..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select 
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                  className="bg-transparent text-sm font-medium outline-none text-slate-600"
                >
                  <option value="latest">Latest</option>
                  <option value="popular">Popular</option>
                  <option value="likes">Liked</option>
                </select>
              </div>
              
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden bg-white border border-slate-200 p-2.5 rounded-xl text-slate-600 flex items-center"
              >
                <SlidersHorizontal className="h-5 w-5" />
                {activeFiltersCount > 0 && (
                  <span className="ml-1 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map(note => (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-300">
              <div className="bg-slate-50 p-6 rounded-full mb-6">
                <BookOpen className="h-12 w-12 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 text-center">No notes found</h3>
              <p className="text-slate-500 mb-8 max-w-xs text-center">Try adjusting your filters or searching for something else.</p>
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-slide-in-right">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-slate-900">Filters</h3>
               <button onClick={() => setIsSidebarOpen(false)}><X className="h-6 w-6 text-slate-400" /></button>
             </div>

             <div className="space-y-8 flex-grow">
                {/* Reusing desktop filter fields for mobile drawer */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">State</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATES.map(s => (
                      <button 
                        key={s} 
                        onClick={() => setFilters({...filters, state: s})}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border ${filters.state === s ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Stream</label>
                  <div className="flex flex-wrap gap-2">
                    {STREAMS.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setFilters({...filters, stream: s.id as any, course: ''})}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border ${filters.stream === s.id ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-200 text-slate-600'}`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">Material</label>
                   <div className="grid grid-cols-1 gap-1">
                      {MATERIAL_TYPES.slice(0, 8).map(type => (
                        <button 
                          key={type}
                          onClick={() => setFilters({...filters, materialType: type})}
                          className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${filters.materialType === type ? 'bg-blue-600 text-white' : 'hover:bg-slate-50 text-slate-600'}`}
                        >
                          {type}
                        </button>
                      ))}
                   </div>
                </div>
             </div>

             <div className="pt-6 border-t border-slate-100 flex gap-4">
                <Button variant="outline" fullWidth onClick={clearFilters}>Reset</Button>
                <Button fullWidth onClick={() => setIsSidebarOpen(false)}>Apply</Button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
