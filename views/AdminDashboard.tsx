
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldCheck, Check, X, AlertCircle, Users, FileText, 
  BarChart3, Trash2, ShieldAlert, TrendingUp, Search, 
  Filter, MessageSquare, ExternalLink, MoreVertical, 
  MapPin, GraduationCap, Clock, CheckCircle2, AlertTriangle,
  Settings, ArrowUpDown, Calendar, Download, Eye, RefreshCw,
  Bell, UserPlus, Info, History, ClipboardList
} from 'lucide-react';
import { Note, User, NoteRequest, NoteStatus, AdminNotification, AdminAuditLog } from '../types';
import { Button } from '../components/Button';
import { STREAMS } from '../constants';
import { DB } from '../services/db';

// Helper components
const QuickStat = ({ label, value, trend, icon, color }: { label: string, value: string | number, trend?: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between transition-all hover:shadow-lg hover:-translate-y-1">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-xl bg-slate-50 ${color}`}>{icon}</div>
      {trend && <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{trend}</span>}
    </div>
    <div>
      <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
    </div>
  </div>
);

const SectionHeader = ({ title, count }: { title: string, count: number }) => (
  <div className="flex items-center gap-4">
    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
    <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-inner">
      {count} Records
    </span>
  </div>
);

const EmptyState = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white rounded-[3rem] p-16 md:p-24 text-center border-2 border-dashed border-slate-100">
    <div className="flex justify-center mb-6">{icon}</div>
    <h3 className="text-2xl font-black text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 font-medium">{desc}</p>
  </div>
);

const AnalyticsCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col">
    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
      <h3 className="text-xl font-black text-slate-900 flex items-center">
        <span className="p-2 bg-slate-50 rounded-xl mr-3">{icon}</span> {title}
      </h3>
      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical className="h-5 w-5"/></button>
    </div>
    <div className="p-8 flex-grow">
      {children}
    </div>
  </div>
);

interface AdminDashboardProps {
  notes: Note[];
  users: User[];
  requests: NoteRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onRestoreNote: (id: string) => void;
  onDeleteNotePermanently: (id: string, name: string) => void;
  onDeleteRequest: (id: string) => void;
  onRestoreRequest: (id: string) => void;
  onDeleteRequestPermanently: (id: string, name: string) => void;
  onBlockUser: (id: string, name: string) => void;
  onDownload: (id: string) => void;
}

type AdminTab = 'moderation' | 'all-notes' | 'requests' | 'users' | 'analytics' | 'logs' | 'bin';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  notes, users, requests, onApprove, onReject, onDeleteNote, onRestoreNote, onDeleteNotePermanently, onDeleteRequest, onRestoreRequest, onDeleteRequestPermanently, onBlockUser, onDownload
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('moderation');
  const [showNotifCenter, setShowNotifCenter] = useState(false);
  const [adminNotifs, setAdminNotifs] = useState<AdminNotification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);
  
  // Filtering & Sorting State
  const [userSearch, setUserSearch] = useState('');
  const [noteSearch, setNoteSearch] = useState('');
  const [uploaderSearch, setUploaderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<NoteStatus | 'All'>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'uploader' | 'downloads'>('date-desc');

  useEffect(() => {
    const unsubscribeNotifs = DB.listenToAdminNotifications(setAdminNotifs);
    const unsubscribeLogs = DB.listenToAuditLogs(setAuditLogs);
    return () => {
      unsubscribeNotifs();
      unsubscribeLogs();
    };
  }, []);

  const unreadNotifCount = adminNotifs.filter(n => !n.read).length;

  const pendingNotes = useMemo(() => {
    let result = notes.filter(n => n.status === 'Pending');
    if (uploaderSearch) result = result.filter(n => n.uploaderName.toLowerCase().includes(uploaderSearch.toLowerCase()));
    return result.sort((a, b) => sortBy === 'date-desc' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [notes, uploaderSearch, sortBy]);

  const filteredAllNotes = useMemo(() => {
    let result = notes.filter(n => n.status !== 'Deleted' && (n.title.toLowerCase().includes(noteSearch.toLowerCase()) || n.subject.toLowerCase().includes(noteSearch.toLowerCase())));
    if (statusFilter !== 'All') result = result.filter(n => n.status === statusFilter);
    if (uploaderSearch) result = result.filter(n => n.uploaderName.toLowerCase().includes(uploaderSearch.toLowerCase()));
    return result.sort((a, b) => sortBy === 'date-desc' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }, [notes, noteSearch, statusFilter, uploaderSearch, sortBy]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) || (u.mobileNumber || '').includes(userSearch));
  }, [users, userSearch]);

  const activeRequests = useMemo(() => {
    return requests.filter(r => r.status !== 'Deleted');
  }, [requests]);

  const deletedNotes = useMemo(() => notes.filter(n => n.status === 'Deleted'), [notes]);
  const deletedRequests = useMemo(() => requests.filter(r => r.status === 'Deleted'), [requests]);

  const stats = {
    totalNotes: notes.filter(n => n.status !== 'Deleted').length,
    totalUsers: users.length,
    activeRequests: activeRequests.filter(r => r.status === 'Open').length,
    approvalRate: Math.round((notes.filter(n => n.status === 'Approved').length / (notes.filter(n => n.status !== 'Deleted').length || 1)) * 100)
  };

  const handleMarkNotifRead = async (id: string) => {
    await DB.markNotificationRead(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in relative">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-12">
        <div className="flex items-center justify-between w-full xl:w-auto">
          <div className="flex items-center">
            <div className="bg-red-600 p-3 rounded-2xl text-white mr-5 shadow-xl shadow-red-200">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Admin Terminal</h1>
              <p className="text-slate-500 font-medium">Governance & audit control center.</p>
            </div>
          </div>
          
          <div className="xl:hidden relative">
            <button 
              onClick={() => setShowNotifCenter(!showNotifCenter)}
              className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 relative hover:bg-slate-50 transition-all"
            >
              <Bell className={`h-6 w-6 ${unreadNotifCount > 0 ? 'animate-swing' : ''}`} />
              {unreadNotifCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">{unreadNotifCount}</span>}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden xl:flex items-center gap-3 mr-4 border-r pr-6 border-slate-200">
             <button 
                onClick={() => setShowNotifCenter(!showNotifCenter)}
                className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:border-blue-300 transition-all relative"
             >
                <Bell className={`h-5 w-5 ${unreadNotifCount > 0 ? 'text-blue-600' : ''}`} />
                <span>Notifications</span>
                {unreadNotifCount > 0 && <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadNotifCount}</span>}
             </button>
          </div>

          <div className="flex flex-wrap items-center bg-slate-100 p-1.5 rounded-[2rem] gap-1 shadow-inner border border-slate-200/50 overflow-x-auto scrollbar-hide">
            {[
              { id: 'moderation', label: 'Moderation', icon: AlertCircle, count: pendingNotes.length },
              { id: 'all-notes', label: 'Library', icon: FileText },
              { id: 'requests', label: 'Requests', icon: MessageSquare },
              { id: 'users', label: 'Students', icon: Users },
              { id: 'analytics', label: 'Stats', icon: BarChart3 },
              { id: 'logs', label: 'Logs', icon: History },
              { id: 'bin', label: 'Bin', icon: Trash2, count: deletedNotes.length + deletedRequests.length },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`flex items-center px-5 py-2.5 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-[1.5rem] transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                  ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && <span className="ml-2 bg-red-500 text-white text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black">{tab.count}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notification Center Popover */}
      {showNotifCenter && (
        <div className="absolute right-4 top-24 xl:top-32 w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 z-[100] animate-pop-in overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center">
                <Bell className="h-4 w-4 mr-2 text-blue-600" /> System Alerts
             </h3>
             <button onClick={() => setShowNotifCenter(false)} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
          </div>
          <div className="max-h-[400px] overflow-y-auto divide-y divide-slate-50">
             {adminNotifs.length > 0 ? adminNotifs.map(notif => (
               <div 
                key={notif.id} 
                onClick={() => handleMarkNotifRead(notif.id)}
                className={`p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notif.read ? 'bg-blue-50/30' : ''}`}
               >
                  <div className={`p-2.5 rounded-xl h-fit ${
                    notif.type === 'note_upload' ? 'bg-blue-100 text-blue-600' :
                    notif.type === 'request_post' ? 'bg-purple-100 text-purple-600' :
                    notif.type === 'report' ? 'bg-red-100 text-red-600' :
                    'bg-emerald-100 text-emerald-600'
                  }`}>
                    {notif.type === 'note_upload' ? <FileText className="h-4 w-4" /> : 
                     notif.type === 'request_post' ? <MessageSquare className="h-4 w-4" /> : 
                     notif.type === 'report' ? <AlertTriangle className="h-4 w-4" /> : 
                     <UserPlus className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 leading-tight mb-1">{notif.title}</p>
                    <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-2">{notif.message}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(notif.timestamp).toLocaleTimeString()}</p>
                  </div>
                  {!notif.read && <div className="absolute top-5 right-5 w-2 h-2 bg-blue-600 rounded-full"></div>}
               </div>
             )) : (
               <div className="p-10 text-center text-slate-400 italic text-sm">No new notifications.</div>
             )}
          </div>
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <QuickStat label="Library Volume" value={stats.totalNotes} icon={<FileText className="h-4 w-4"/>} color="text-blue-600" />
        <QuickStat label="Student Count" value={stats.totalUsers} icon={<Users className="h-4 w-4"/>} color="text-indigo-600" />
        <QuickStat label="Open Requests" value={stats.activeRequests} icon={<MessageSquare className="h-4 w-4"/>} color="text-amber-600" />
        <QuickStat label="Quality Score" value={`${stats.approvalRate}%`} icon={<ShieldCheck className="h-4 w-4"/>} color="text-emerald-600" />
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'moderation' && (
          <div className="space-y-6">
            <SectionHeader title="Materials Awaiting Approval" count={pendingNotes.length} />
            {pendingNotes.length > 0 ? (
              <div className="space-y-4">
                {pendingNotes.map(note => (
                  <div key={note.id} className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:border-blue-200 transition-all group">
                    <div className="flex items-start">
                      <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 mr-6 group-hover:scale-110 transition-transform hidden sm:flex"><FileText className="h-8 w-8" /></div>
                      <div>
                        <div className="flex gap-2 mb-1"><span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-md">{note.stream}</span></div>
                        <h3 className="text-xl font-black text-slate-800">{note.title}</h3>
                        <p className="text-sm text-slate-500 font-medium">{note.subject} • {note.uploaderName}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 border-t lg:border-t-0 pt-4 lg:pt-0">
                      <Button size="sm" variant="outline" onClick={() => window.open(note.filePath, '_blank')}><Eye className="h-4 w-4 mr-2"/>View</Button>
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600" onClick={() => onApprove(note.id)}><Check className="h-4 w-4 mr-2"/>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => onReject(note.id)}><X className="h-4 w-4 mr-2"/>Reject</Button>
                      <Button size="sm" variant="ghost" className="text-red-500" onClick={() => onDeleteNote(note.id)}><Trash2 className="h-4 w-4"/></Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : <EmptyState icon={<CheckCircle2 className="h-16 w-16 text-emerald-400" />} title="Queue Empty" desc="All student uploads have been processed." />}
          </div>
        )}

        {activeTab === 'all-notes' && (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <SectionHeader title="Library Explorer" count={filteredAllNotes.length} />
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Search materials..." value={noteSearch} onChange={e => setNoteSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Material</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Subject</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Stats</th>
                        <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {filteredAllNotes.map(note => (
                        <tr key={note.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-8 py-5">
                              <div className="font-bold text-slate-800">{note.title}</div>
                              <div className="text-xs text-slate-400">{note.uploaderName} • {note.stream}</div>
                           </td>
                           <td className="px-8 py-5 text-sm font-medium text-slate-600">{note.subject}</td>
                           <td className="px-8 py-5 text-center">
                              <div className="text-xs font-black">{note.downloads} DLs</div>
                              <div className="text-xs text-slate-400">{note.likes} Likes</div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <div className="flex justify-end gap-2">
                                 <button onClick={() => onDownload(note.id)} className="p-2 text-slate-400 hover:text-blue-600"><Download className="h-4 w-4"/></button>
                                 <button onClick={() => onDeleteNote(note.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 className="h-4 w-4"/></button>
                              </div>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {activeRequests.map(req => (
               <div key={req.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-md mb-2 inline-block">{req.stream}</span>
                    <h3 className="text-lg font-black text-slate-800">{req.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">{req.subject} • By {req.requesterName}</p>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                     <span className="text-[10px] font-black uppercase text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                     <Button size="sm" variant="danger" onClick={() => onDeleteRequest(req.id)}><Trash2 className="h-4 w-4 mr-2"/>Delete</Button>
                  </div>
               </div>
             ))}
             {activeRequests.length === 0 && <div className="col-span-full"><EmptyState icon={<MessageSquare className="h-16 w-16 text-slate-200" />} title="No Requests" desc="The board is clear." /></div>}
          </div>
        )}

        {activeTab === 'users' && (
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <SectionHeader title="Student Records" count={filteredUsers.length} />
                <div className="relative w-full max-sm">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Search by name/mobile..." value={userSearch} onChange={e => setUserSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                       <tr>
                         <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Name</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Mobile</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-center">Points</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400 text-right">Access</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {filteredUsers.map(u => (
                         <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5">
                               <div className="font-bold text-slate-800 flex items-center">
                                  {u.name || 'User'} {u.role === 'admin' && <ShieldCheck className="h-3 w-3 ml-2 text-blue-500" />}
                               </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-medium text-slate-600">{u.mobileNumber}</td>
                            <td className="px-8 py-5 text-center font-black text-blue-600">{u.points}</td>
                            <td className="px-8 py-5 text-right">
                               <button onClick={() => onBlockUser(u.id, u.name || 'User')} className={`text-xs font-black uppercase tracking-widest ${u.status === 'active' ? 'text-red-500' : 'text-emerald-500'}`}>
                                  {u.status === 'active' ? 'Suspend' : 'Reinstate'}
                               </button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <AnalyticsCard title="Content Distribution" icon={<TrendingUp className="h-5 w-5" />}>
                <div className="space-y-6">
                   {STREAMS.map(s => {
                      const count = notes.filter(n => n.stream === s.id && n.status !== 'Deleted').length;
                      const total = notes.filter(n => n.status !== 'Deleted').length || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={s.id}>
                           <div className="flex justify-between text-xs font-black uppercase mb-2"><span>{s.label}</span><span>{count} files</span></div>
                           <div className="h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${s.color}`} style={{ width: `${pct}%` }}></div></div>
                        </div>
                      )
                   })}
                </div>
             </AnalyticsCard>
             <AnalyticsCard title="Geographic Pulse" icon={<MapPin className="h-5 w-5" />}>
                <div className="flex justify-around items-center h-full">
                   <div className="text-center"><div className="text-4xl font-black text-slate-800">{notes.filter(n => n.state === 'AP' && n.status !== 'Deleted').length}</div><div className="text-xs font-black uppercase text-slate-400">AP Students</div></div>
                   <div className="text-center"><div className="text-4xl font-black text-slate-800">{notes.filter(n => n.state === 'TS' && n.status !== 'Deleted').length}</div><div className="text-xs font-black uppercase text-slate-400">TS Students</div></div>
                </div>
             </AnalyticsCard>
          </div>
        )}

        {activeTab === 'logs' && (
           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-50">
                 <SectionHeader title="Administrative Audit Trail" count={auditLogs.length} />
                 <p className="text-xs text-slate-400 font-medium mt-2">A permanent record of all moderator actions for security and transparency.</p>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                       <tr>
                         <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Timestamp</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Moderator</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Action</th>
                         <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Target Object</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {auditLogs.length > 0 ? auditLogs.map(log => (
                         <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-8 py-5 text-xs font-bold text-slate-500">
                               {new Date(log.timestamp).toLocaleString()}
                            </td>
                            <td className="px-8 py-5">
                               <div className="font-bold text-slate-800 flex items-center">
                                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] mr-2">
                                    {(log.adminName || 'A').charAt(0)}
                                  </div>
                                  {log.adminName || 'Admin'}
                               </div>
                            </td>
                            <td className="px-8 py-5">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                 log.action.includes('Approved') || log.action.includes('Activated') ? 'bg-emerald-50 text-emerald-600' :
                                 log.action.includes('Deleted') || log.action.includes('Suspended') ? 'bg-red-50 text-red-600' :
                                 log.action.includes('Restored') ? 'bg-blue-50 text-blue-600' :
                                 'bg-slate-100 text-slate-600'
                               }`}>
                                  {log.action}
                               </span>
                            </td>
                            <td className="px-8 py-5">
                               <div className="text-sm font-bold text-slate-700 truncate max-w-[200px]" title={log.targetName}>
                                  {log.targetName || 'N/A'}
                               </div>
                               <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{log.category}</div>
                            </td>
                         </tr>
                       )) : (
                         <tr>
                           <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic font-medium">No actions recorded yet.</td>
                         </tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {activeTab === 'bin' && (
           <div className="space-y-10">
              <div className="space-y-4">
                 <SectionHeader title="Material Cemetery" count={deletedNotes.length} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deletedNotes.map(n => (
                       <div key={n.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                          <div className="min-w-0 flex-1 pr-4">
                            <h3 className="font-bold text-slate-800 truncate">{n.title}</h3>
                            <p className="text-xs text-slate-400">{n.uploaderName} • {n.stream}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <button onClick={() => onRestoreNote(n.id)} className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors" title="Restore"><RefreshCw className="h-4 w-4"/></button>
                             <button onClick={() => onDeleteNotePermanently(n.id, n.title)} className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors" title="Purge Forever"><Trash2 className="h-4 w-4"/></button>
                          </div>
                       </div>
                    ))}
                    {deletedNotes.length === 0 && <p className="text-slate-400 italic font-medium text-center py-4 bg-white rounded-3xl border border-dashed">No materials in bin.</p>}
                 </div>
              </div>
              <div className="space-y-4">
                 <SectionHeader title="Discarded Requests" count={deletedRequests.length} />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {deletedRequests.map(r => (
                       <div key={r.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                          <div className="min-w-0 flex-1 pr-4">
                            <h3 className="font-bold text-slate-800 truncate">{r.title}</h3>
                            <p className="text-xs text-slate-400">{r.requesterName} • {r.stream}</p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                             <button onClick={() => onRestoreRequest(r.id)} className="p-2 text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors" title="Restore"><RefreshCw className="h-4 w-4"/></button>
                             <button onClick={() => onDeleteRequestPermanently(r.id, r.title)} className="p-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors" title="Purge Forever"><Trash2 className="h-4 w-4"/></button>
                          </div>
                       </div>
                    ))}
                    {deletedRequests.length === 0 && <p className="text-slate-400 italic font-medium text-center py-4 bg-white rounded-3xl border border-dashed">No requests in bin.</p>}
                 </div>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
