
import React, { useState } from 'react';
import { Menu, X, BookOpen, LogOut, LayoutDashboard, ShieldCheck, PlusCircle, Search, Upload, Trophy, MessageSquare } from 'lucide-react';
import { User } from '../types';
import { Button } from './Button';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onNav: (view: any) => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onNav, onOpenLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNav = (view: any) => {
    onNav(view);
    setIsOpen(false);
  };

  const userInitial = user?.name?.charAt(0) || 'U';

  return (
    <nav className="sticky top-0 z-50 glass-morphism border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => handleNav('home')}
            >
              <div className="bg-blue-600 p-2 rounded-lg mr-2">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                NotesNation
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1 lg:space-x-4">
              <button onClick={() => handleNav('browse')} className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Browse</button>
              <button onClick={() => handleNav('requests')} className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Requests</button>
              <button onClick={() => handleNav('leaderboard')} className="text-slate-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">Leaderboard</button>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4">
            <button onClick={() => handleNav('browse')} className="p-2 text-slate-500 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" onClick={() => handleNav('upload')}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Upload
                </Button>
                
                <div className="relative group">
                   <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold cursor-pointer border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                    {userInitial}
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="px-4 py-2 border-b border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name || 'User'}</p>
                    </div>
                    <button onClick={() => handleNav('dashboard')} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center">
                      <LayoutDashboard className="h-4 w-4 mr-2 text-slate-400" /> Dashboard
                    </button>
                    {user.role === 'admin' && (
                      <button onClick={() => handleNav('admin')} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-red-500" /> Admin Terminal
                      </button>
                    )}
                    <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center border-t border-slate-50 mt-1">
                      <LogOut className="h-4 w-4 mr-2 text-slate-400" /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button size="sm" onClick={onOpenLogin}>Get Started</Button>
            )}
          </div>

          <div className="sm:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-500 hover:text-slate-700 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100 shadow-xl overflow-y-auto max-h-[calc(100vh-64px)]">
          <div className="px-4 pt-4 pb-8 space-y-2">
            {user && (
              <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                <div className="flex items-center mb-3">
                   <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
                    {userInitial}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{user.name || 'User'}</p>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{user.role} Member</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <button onClick={() => handleNav('dashboard')} className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-slate-200 text-slate-600">
                      <LayoutDashboard className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">Dashboard</span>
                   </button>
                   <button onClick={() => handleNav('upload')} className="flex flex-col items-center justify-center p-3 bg-blue-600 rounded-xl border border-blue-600 text-white shadow-lg shadow-blue-100">
                      <Upload className="h-5 w-5 mb-1" />
                      <span className="text-[10px] font-bold uppercase">Upload</span>
                   </button>
                </div>
              </div>
            )}
            
            <MobileNavLink icon={<Search className="h-4 w-4" />} label="Search Library" onClick={() => handleNav('browse')} />
            <MobileNavLink icon={<MessageSquare className="h-4 w-4" />} label="Note Requests" onClick={() => handleNav('requests')} />
            <MobileNavLink icon={<Trophy className="h-4 w-4" />} label="Leaderboard" onClick={() => handleNav('leaderboard')} />
            
            {!user ? (
              <div className="pt-4 mt-4 border-t border-slate-100">
                 <Button fullWidth onClick={onOpenLogin}>Sign In / Join Now</Button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-slate-100">
                 <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center p-4 text-red-500 font-black text-xs uppercase tracking-[0.2em] hover:bg-red-50 rounded-2xl transition-all"
                 >
                   <LogOut className="h-4 w-4 mr-3" /> Sign Out
                 </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const MobileNavLink = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center p-4 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl transition-all font-bold text-sm"
  >
    <div className="bg-slate-100 p-2 rounded-xl mr-4 group-hover:bg-blue-100 transition-colors">
      {icon}
    </div>
    {label}
  </button>
);
