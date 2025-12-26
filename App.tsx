
import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './views/Home';
import { Browse } from './views/Browse';
import { Upload } from './views/Upload';
import { AdminDashboard } from './views/AdminDashboard';
import { Requests } from './views/Requests';
import { Leaderboard } from './views/Leaderboard';
import { About } from './views/About';
import { Legal } from './views/Legal';
import { Contact } from './views/Contact';
import { Dashboard } from './views/Dashboard';
import { ExamCenter } from './views/ExamCenter';
import { SyllabusLibrary } from './views/SyllabusLibrary';
import { DB } from './services/db';
import { auth, googleProvider, signInWithPopup, isFirebaseConfigured } from './services/firebase';

import * as firebaseAuth from 'firebase/auth';
const { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} = firebaseAuth as any;

import { User, Note, NoteRequest, StreamType } from './types';
import { Button } from './components/Button';
import { X, Settings, Zap, Bell, LogIn, Mail } from 'lucide-react';

const SetupGuide: React.FC = () => (
  <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
    <div className="max-w-2xl w-full bg-white rounded-[3rem] p-12 shadow-2xl animate-fade-in">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Settings className="h-10 w-10 animate-spin-slow" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4">Connect Firebase</h1>
        <p className="text-slate-500">To launch NotesNation live, you need to connect your own Firebase project.</p>
      </div>
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <p className="text-sm text-slate-600">Please check <code>services/firebase.ts</code> to configure your API keys.</p>
      </div>
    </div>
  </div>
);

export type AppView = 'home' | 'browse' | 'dashboard' | 'admin' | 'upload' | 'requests' | 'leaderboard' | 'about' | 'privacy' | 'terms' | 'disclaimer' | 'cookies' | 'contact' | 'exams' | 'syllabus';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [initialStream, setInitialStream] = useState<StreamType | ''>('');
  const [user, setUser] = useState<User | null>(null);
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allRequests, setAllRequests] = useState<NoteRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authData, setAuthData] = useState({ name: '', mobile: '', email: '', password: '' });
  const [notification, setNotification] = useState<{message: string, type: 'info' | 'success' | 'error' | 'admin'} | null>(null);
  
  const lastNotifIdRef = useRef<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view]);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setIsLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser: any) => {
      if (fbUser) {
        try {
          const userData = await DB.getUser(fbUser.uid);
          setUser(userData);
        } catch (e: any) {
          console.error("Auth user fetching error", e);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const unsubscribeNotes = DB.listenToNotes(setAllNotes);
    const unsubscribeUsers = DB.listenToUsers(setAllUsers);
    const unsubscribeRequests = DB.listenToRequests(setAllRequests);

    return () => {
      unsubscribeAuth();
      unsubscribeNotes();
      unsubscribeUsers();
      unsubscribeRequests();
    };
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') {
      const unsubscribeNotifs = DB.listenToAdminNotifications((notifs) => {
        const latest = notifs[0];
        if (latest && !latest.read && latest.id !== lastNotifIdRef.current) {
          lastNotifIdRef.current = latest.id;
          showNotification(latest.title, 'admin');
        }
      });
      return () => unsubscribeNotifs();
    }
  }, [user]);

  if (!isFirebaseConfigured) return <SetupGuide />;

  const showNotification = (message: string, type: 'info' | 'success' | 'error' | 'admin') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('home');
    showNotification("Logged out successfully", "info");
  };

  const handleDownload = async (id: string) => {
    const note = allNotes.find(n => n.id === id);
    if (!note) return;
    showNotification("Preparing direct download...", "info");
    try {
      await DB.trackDownload(id);
      const response = await fetch(note.filePath);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = note.title.toLowerCase().endsWith('.pdf') ? note.title : `${note.title}.pdf`;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      showNotification("Direct download started!", "success");
    } catch (err) {
      window.open(note.filePath, '_blank');
      showNotification("Download started in new tab", "info");
    }
  };

  const handleReportNote = async (id: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const note = allNotes.find(n => n.id === id);
    if (!note) return;
    await DB.reportNote(id, note.title, user.name);
    showNotification("Material reported for review", "info");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthProcessing(true);
    try {
      let loginIdentifier = authData.mobile.trim();
      let email = loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier.replace(/\+/g, '').replace(/\s/g, '')}@notesnation.com`;
      await signInWithEmailAndPassword(auth, email, authData.password);
      setIsLoginModalOpen(false);
      setAuthData({ name: '', mobile: '', email: '', password: '' });
      showNotification("Welcome back!", "success");
    } catch (err: any) {
      showNotification("Login failed: " + err.message, "error");
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthProcessing(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      
      let userData = await DB.getUser(fbUser.uid);
      if (!userData) {
        userData = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Google Student',
          mobileNumber: fbUser.phoneNumber || '',
          email: fbUser.email || '',
          role: 'student',
          points: 0,
          badge: null,
          status: 'active',
          joinedAt: new Date().toISOString(),
          bookmarks: []
        };
        await DB.createUser(userData);
      }
      
      setUser(userData);
      setIsLoginModalOpen(false);
      showNotification(`Welcome, ${userData.name}!`, "success");
    } catch (err: any) {
      showNotification("Google login failed: " + err.message, "error");
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthProcessing(true);
    try {
      const email = authData.email || `${authData.mobile.replace(/\+/g, '').trim()}@notesnation.com`;
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), authData.password.trim());
      const newUser: User = {
        id: cred.user.uid,
        name: authData.name.trim(),
        mobileNumber: authData.mobile.trim(),
        email: email.trim(),
        role: 'student',
        points: 0,
        badge: null,
        status: 'active',
        joinedAt: new Date().toISOString(),
        bookmarks: []
      };
      await DB.createUser(newUser);
      setIsLoginModalOpen(false);
      setAuthData({ name: '', mobile: '', email: '', password: '' });
      showNotification("Account created!", "success");
    } catch (err: any) {
      showNotification("Registration failed: " + err.message, "error");
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handlePostRequest = async (data: Partial<NoteRequest>) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    try {
      const newRequest: Omit<NoteRequest, 'id'> = {
        title: data.title || '',
        subject: data.subject || '',
        stream: data.stream || 'Engineering',
        description: data.description || '',
        requestedBy: user.id,
        requesterName: user.name,
        status: 'Open',
        createdAt: new Date().toISOString()
      };
      await DB.postRequest(newRequest);
      showNotification("Request posted successfully!", "success");
    } catch (err) {
      showNotification("Failed to post request", "error");
    }
  };

  const renderView = () => {
    const commonProps = {
      onDownload: handleDownload,
      onLike: (id: string) => user ? DB.likeNote(id) : setIsLoginModalOpen(true),
      onToggleBookmark: (id: string, isBookmarked: boolean) => user ? DB.toggleBookmark(user.id, id, isBookmarked) : setIsLoginModalOpen(true),
      onReport: handleReportNote,
      onNav: setView,
      userBookmarks: user?.bookmarks || []
    };

    switch (view) {
      case 'home':
        return <Home featuredNotes={allNotes.filter(n => n.status === 'Approved').slice(0, 10)} onExplore={(stream) => { setInitialStream(stream || ''); setView('browse'); }} onUpload={() => user ? setView('upload') : setIsLoginModalOpen(true)} {...commonProps} />;
      case 'browse':
        return <Browse initialStream={initialStream} notes={allNotes} {...commonProps} />;
      case 'exams':
        return <ExamCenter />;
      case 'syllabus':
        return <SyllabusLibrary />;
      case 'dashboard':
        return user ? <Dashboard user={user} notes={allNotes.filter(n => n.uploadedBy === user.id)} allNotes={allNotes} {...commonProps} onNav={setView} /> : null;
      case 'admin':
        return user?.role === 'admin' ? (
          <AdminDashboard 
            notes={allNotes} 
            users={allUsers} 
            requests={allRequests}
            onApprove={(id) => {
              const uploaderId = allNotes.find(n => n.id === id)?.uploadedBy || '';
              DB.updateNoteStatus(id, 'Approved', uploaderId, user);
              showNotification("Note Approved", "success");
            }}
            onReject={(id) => { DB.updateNoteStatus(id, 'Rejected', '', user); showNotification("Note Rejected", "info"); }}
            onDeleteNote={async (id) => { await DB.deleteNote(id, user); showNotification("Material moved to bin", "info"); }}
            onRestoreNote={async (id) => { await DB.restoreNote(id, user); showNotification("Material restored", "success"); }}
            onDeleteNotePermanently={async (id, name) => { if (window.confirm(`PERMANENTLY delete "${name}"?`)) { await DB.deleteNotePermanently(id, name, user); showNotification("Material purged", "error"); } }}
            onDeleteRequest={async (id) => { await DB.deleteRequest(id, user); showNotification("Request moved to bin", "info"); }}
            onRestoreRequest={async (id) => { await DB.restoreRequest(id, user); showNotification("Request restored", "success"); }}
            onDeleteRequestPermanently={async (id, name) => { if (window.confirm(`PERMANENTLY delete request "${name}"?`)) { await DB.deleteRequestPermanently(id, name, user); showNotification("Request purged", "error"); } }}
            onBlockUser={async (id, name) => {
              const targetUser = allUsers.find(u => u.id === id);
              if (!targetUser) return;
              const nextStatus = targetUser.status === 'active' ? 'blocked' : 'active';
              await DB.updateUserStatus(id, nextStatus, name, user);
              showNotification(`User ${nextStatus === 'blocked' ? 'Suspended' : 'Activated'}`, "info");
            }}
            onDownload={handleDownload}
          />
        ) : null;
      case 'upload':
        return user ? <Upload userId={user.id} userName={user.name} onUploadComplete={() => setView('browse')} onCancel={() => setView('browse')} /> : null;
      case 'requests':
        return <Requests requests={allRequests.filter(r => r.status !== 'Deleted')} user={user} onRequest={handlePostRequest} onOpenLogin={() => setIsLoginModalOpen(true)} onNav={setView} />;
      case 'leaderboard':
        return <Leaderboard users={allUsers} />;
      case 'about':
        return <About onNav={setView} />;
      case 'contact':
        return <Contact onNav={setView} />;
      case 'privacy': case 'terms': case 'disclaimer': case 'cookies':
        return <Legal type={view} onNav={setView} />;
      default:
        return <Home featuredNotes={allNotes.filter(n => n.status === 'Approved').slice(0, 10)} onExplore={(stream) => { setInitialStream(stream || ''); setView('browse'); }} onUpload={() => user ? setView('upload') : setIsLoginModalOpen(true)} {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-['Inter'] relative">
      <Navbar 
        user={user} 
        onLogout={handleLogout} 
        onNav={(v) => { if(v !== 'browse') setInitialStream(''); setView(v); }} 
        onOpenLogin={() => { setAuthMode('login'); setIsLoginModalOpen(true); }}
      />
      <main className="flex-grow bg-slate-50">{renderView()}</main>
      <Footer onNav={(v) => { if(v !== 'browse') setInitialStream(''); setView(v); }} />

      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsLoginModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl animate-pop-in overflow-hidden p-8 md:p-10">
             <div className="flex justify-between items-start mb-8">
                <div>
                   <h2 className="text-3xl font-black text-slate-900">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                   <p className="text-slate-500 text-sm mt-1 font-medium">Join the community of 10k+ students.</p>
                </div>
                <button onClick={() => setIsLoginModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                  <X className="h-6 w-6" />
                </button>
             </div>

             <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-[0.98]"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                  Continue with Google
                </button>

                <div className="relative py-4">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                   <div className="relative flex justify-center text-xs font-black uppercase tracking-widest text-slate-400"><span className="bg-white px-4">Or use mobile / email</span></div>
                </div>

                <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                    {authMode === 'register' && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                        <input required type="text" placeholder="e.g. Rahul Sharma" value={authData.name} onChange={e => setAuthData({...authData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mobile or Email</label>
                      <input required type="text" placeholder="98765 43210" value={authData.mobile} onChange={e => setAuthData({...authData, mobile: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                      <input required type="password" placeholder="••••••••" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                    <Button fullWidth size="lg" type="submit" isLoading={isAuthProcessing} className="py-5 text-lg font-black tracking-wide">
                      {authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </Button>
                </form>
             </div>

             <div className="mt-8 text-center">
                <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
                  {authMode === 'login' ? "New to NotesNation? Sign Up" : "Already have an account? Log In"}
                </button>
             </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-bounce-in ${notification.type === 'admin' ? 'w-full max-w-xs' : ''}`}>
           <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 border ${
             notification.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 
             notification.type === 'error' ? 'bg-red-600 border-red-500 text-white' : 
             notification.type === 'admin' ? 'bg-indigo-700 border-indigo-500 text-white ring-4 ring-indigo-500/30' :
             'bg-blue-600 border-blue-500 text-white'
           }`}>
              {notification.type === 'admin' ? <Bell className="h-5 w-5 fill-current animate-swing" /> : <Zap className="h-5 w-5 fill-current animate-pulse" />}
              <span className="font-bold text-sm tracking-wide uppercase">{notification.message}</span>
           </div>
        </div>
      )}
    </div>
  );
};

export default App;
