
import React, { useState } from 'react';
import { Download, ThumbsUp, Calendar, User, Tag, MapPin, Eye, Share2, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { Note } from '../types';
import { STREAMS } from '../constants';

interface NoteCardProps {
  note: Note;
  onDownload: (id: string) => void;
  onLike: (id: string) => void;
  onToggleBookmark?: (id: string, isBookmarked: boolean) => void;
  isBookmarked?: boolean;
}

export const NoteCard: React.FC<NoteCardProps> = ({ 
  note, 
  onDownload, 
  onLike, 
  onToggleBookmark, 
  isBookmarked = false 
}) => {
  const [isShared, setIsShared] = useState(false);
  const streamInfo = STREAMS.find(s => s.id === note.stream);

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const shareUrl = `${window.location.origin}${window.location.pathname}?noteId=${note.id}`;
    const shareData = {
      title: `NotesNation: ${note.title}`,
      text: `Check out these ${note.subject} notes for ${note.course} (${note.groupOrBranch}) on NotesNation! 📚✨`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Share cancelled or failed:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
        alert('Share link: ' + shareUrl);
      }
    }
  };
  
  return (
    <div id={`note-${note.id}`} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group">
      <div className={`h-2 ${streamInfo?.color || 'bg-blue-600'}`} />
      
      <div className="p-5 flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-500 border border-slate-100">
            {note.materialType}
          </span>
          <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <MapPin className="h-3 w-3 mr-1" />
            {note.state} • {note.course}
          </div>
        </div>
        
        <h3 className="text-lg font-black text-slate-800 mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          {note.title}
        </h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm font-medium text-slate-500">
            <Tag className="h-3.5 w-3.5 mr-2 text-blue-500" />
            {note.subject}
          </div>
          <div className="flex items-center text-sm font-medium text-slate-500">
            <User className="h-3.5 w-3.5 mr-2 text-slate-400" />
            {note.isAnonymous ? 'Anonymous' : note.uploaderName}
          </div>
          <div className="flex items-center text-xs font-bold text-slate-400 tracking-tight">
            <Calendar className="h-3 w-3 mr-2" />
            {new Date(note.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
           <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-blue-100/50">{note.groupOrBranch}</span>
           <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-indigo-100/50">{note.semesterOrYear}</span>
           {note.regulation && <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-purple-100/50">{note.regulation}</span>}
        </div>
      </div>
      
      <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => onLike(note.id)}
            className="flex items-center text-slate-400 hover:text-red-500 transition-colors group/like"
          >
            <ThumbsUp className="h-4 w-4 mr-1.5 group-hover/like:scale-110 transition-transform" />
            <span className="text-xs font-black">{note.likes}</span>
          </button>
          <div className="flex items-center text-slate-400">
            <Eye className="h-4 w-4 mr-1.5" />
            <span className="text-xs font-black">{note.downloads}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 relative">
          {onToggleBookmark && (
            <button 
              onClick={() => onToggleBookmark(note.id, isBookmarked)}
              className={`p-2.5 rounded-xl transition-all shadow-sm border ${
                isBookmarked 
                ? 'bg-amber-50 border-amber-200 text-amber-600' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-amber-500 hover:border-amber-200'
              }`}
              title={isBookmarked ? "Remove from Saved" : "Save Note"}
            >
              {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
          )}

          <button 
            onClick={handleShare}
            className={`p-2.5 rounded-xl transition-all relative group/sharebtn ${
              isShared 
              ? 'bg-green-100 text-green-600 scale-110' 
              : 'bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-100'
            }`}
            title="Share Note"
          >
            {isShared ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
            
            {isShared && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap animate-bounce-in shadow-xl z-20">
                Link Copied!
              </div>
            )}
          </button>

          <button 
            onClick={() => onDownload(note.id)}
            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 active:scale-90 transition-all shadow-xl shadow-blue-100 flex items-center justify-center border border-blue-500"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
