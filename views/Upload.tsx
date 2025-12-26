
import React, { useState, useRef } from 'react';
import { Upload as UploadIcon, CheckCircle2, FileText, ChevronRight, ChevronLeft, Loader2, X, CloudUpload, FileCheck, ShieldCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { StreamType, StateType, Note } from '../types';
import { STATES, STREAMS, HIERARCHY, MATERIAL_TYPES } from '../constants';
import { DB } from '../services/db';

interface UploadProps {
  userId: string;
  userName: string;
  onUploadComplete: (note: Note) => void;
  onCancel: () => void;
}

type UploadStage = 'idle' | 'uploading' | 'processing' | 'success';

export const Upload: React.FC<UploadProps> = ({ userId, userName, onUploadComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    state: '' as StateType,
    stream: '' as StreamType,
    course: '',
    regulation: '',
    board: '',
    groupOrBranch: '',
    semesterOrYear: '',
    materialType: '',
    university: '',
    isAnonymous: false,
    file: null as File | null
  });
  const [stage, setStage] = useState<UploadStage>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const uploadTaskRef = useRef<any>(null);

  const nextStep = () => {
    if (step === 1 && (formData.stream === 'Medical' || formData.stream === 'Nursing & Pharmacy')) {
      setFormData(prev => ({ ...prev, groupOrBranch: prev.course }));
    }
    setStep(prev => prev + 1);
  };
  const prevStep = () => setStep(prev => prev - 1);

  const handleCancelUpload = () => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
      uploadTaskRef.current = null;
      setStage('idle');
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) return;
    
    setStage('uploading');
    setUploadProgress(0);
    try {
      const fileName = `${Date.now()}_${formData.file.name.replace(/\s+/g, '_')}`;
      const filePath = `notes/${userId}/${fileName}`;
      
      const { task, promise } = DB.uploadFileWithProgress(formData.file, filePath, (pct) => {
        setUploadProgress(pct);
        if (pct === 100) setStage('processing');
      });

      uploadTaskRef.current = task;
      const downloadUrl = await promise;
      uploadTaskRef.current = null;

      const noteData: Omit<Note, 'id'> = {
        title: formData.title,
        subject: formData.subject,
        state: formData.state,
        stream: formData.stream,
        course: formData.course,
        regulation: formData.regulation || '',
        board: formData.board || '',
        groupOrBranch: formData.groupOrBranch || 'General',
        semesterOrYear: formData.semesterOrYear,
        materialType: formData.materialType,
        university: formData.university || 'Not Specified',
        filePath: downloadUrl,
        uploadedBy: userId,
        uploaderName: userName,
        status: 'Pending',
        downloads: 0,
        likes: 0,
        createdAt: new Date().toISOString(),
        isAnonymous: formData.isAnonymous
      };

      const docRef = await DB.addNote(noteData);
      
      setStage('success');
      setTimeout(() => {
        onUploadComplete({ id: docRef.id, ...noteData });
      }, 1500);
    } catch (error: any) {
      if (error.code === 'storage/canceled') {
        console.log("Upload was explicitly canceled by the user.");
      } else {
        console.error("Upload failed:", error);
        alert("Upload failed. Please check your internet connection.");
        setStage('idle');
      }
    }
  };

  const isStepValid = () => {
    if (step === 1) return formData.state && formData.stream && formData.course;
    if (step === 2) {
      const basic = formData.semesterOrYear && formData.materialType;
      if (formData.stream === 'Engineering') return basic && formData.groupOrBranch && formData.regulation;
      if (formData.stream === 'Intermediate') return basic && formData.groupOrBranch && formData.board;
      return basic;
    }
    if (step === 3) return formData.title && formData.subject && formData.file;
    return false;
  };

  const getBranchOptions = () => {
    const streamData = (HIERARCHY as any)[formData.stream];
    if (!streamData) return [];
    if (formData.stream === 'Degree') return (HIERARCHY.Degree.groups as any)[formData.course] || [];
    return streamData.branches || streamData.groups || [];
  };

  const getFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8 md:p-12 relative overflow-hidden">
        {stage !== 'idle' && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-12 text-center animate-fade-in">
            {stage === 'success' ? (
              <div className="animate-scale-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Upload Successful!</h3>
                <p className="text-slate-500">Your notes have been sent for moderation.</p>
              </div>
            ) : (
              <>
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-8 relative">
                   {stage === 'uploading' ? (
                     <CloudUpload className="h-10 w-10 animate-bounce" />
                   ) : (
                     <Loader2 className="h-10 w-10 animate-spin" />
                   )}
                   <div className="absolute inset-0 border-4 border-blue-600/20 rounded-3xl animate-pulse"></div>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  {stage === 'uploading' ? 'Sending to Nation' : 'Processing Metadata'}
                </h3>
                <p className="text-slate-500 mb-10 max-w-xs mx-auto">
                  {stage === 'uploading' 
                    ? "Your knowledge is traveling to our secure servers..." 
                    : "Finalizing and notifying the community..."}
                </p>

                <div className="w-full max-w-sm space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-[0.2em] text-blue-600 mb-1">
                    <span>{stage === 'uploading' ? 'Upload Progress' : 'Saving...'}</span>
                    <span>{stage === 'uploading' ? `${Math.round(uploadProgress)}%` : '99%'}</span>
                  </div>
                  <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner p-1">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500 ease-out relative"
                      style={{ width: `${stage === 'uploading' ? uploadProgress : 99}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {stage === 'uploading' && (
                    <button 
                      onClick={handleCancelUpload}
                      className="mt-6 mx-auto px-6 py-2 text-red-500 hover:text-red-600 font-black uppercase tracking-widest text-[10px] bg-red-50 hover:bg-red-100 rounded-full transition-all flex items-center space-x-2"
                    >
                      <X className="h-3 w-3" />
                      <span>Stop Upload</span>
                    </button>
                  )}

                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2 flex items-center justify-center">
                     <ShieldCheck className="h-3 w-3 mr-2 text-green-500" /> Verified secure connection
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-blue-100 rounded-3xl mb-4 text-blue-600 group">
            <UploadIcon className="h-8 w-8 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Share Your Knowledge</h2>
          <p className="text-slate-500">Helping one peer today makes a stronger nation tomorrow.</p>
          
          <div className="flex items-center justify-center mt-8 space-x-2">
            {[1, 2, 3].map(s => (
              <div 
                key={s} 
                className={`h-2 rounded-full transition-all duration-500 ${
                  s === step ? 'w-12 bg-blue-600' : s < step ? 'w-4 bg-green-500' : 'w-4 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 gap-4">
                <label className="block space-y-2">
                  <span className="text-sm font-bold text-slate-700">Select State</span>
                  <select 
                    required
                    value={formData.state} 
                    onChange={e => setFormData({...formData, state: e.target.value as StateType})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Choose State</option>
                    {STATES.map(s => <option key={s} value={s}>{s === 'AP' ? 'Andhra Pradesh' : 'Telangana'}</option>)}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-bold text-slate-700">Select Stream</span>
                  <select 
                    required
                    value={formData.stream} 
                    onChange={e => setFormData({...formData, stream: e.target.value as StreamType, course: '', regulation: '', board: '', groupOrBranch: '', semesterOrYear: ''})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="">Choose Stream</option>
                    {STREAMS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </label>
              </div>

              {formData.stream && (
                <div className="animate-fade-in">
                  <span className="text-sm font-bold text-slate-700 block mb-3">Which Course?</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(HIERARCHY as any)[formData.stream].courses.map((c: string) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormData({...formData, course: c})}
                        className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider border transition-all duration-300 ${
                          formData.course === c 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 scale-[1.02]' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.stream === 'Engineering' && formData.state && formData.course && (
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">Regulation</span>
                    <select 
                      value={formData.regulation} 
                      onChange={e => setFormData({...formData, regulation: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Regulation</option>
                      {(HIERARCHY.Engineering.regulations as any)[formData.course][formData.state].map((r: string) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </label>
                )}

                {getBranchOptions().length > 0 && (
                  <label className="block space-y-2">
                    <span className="text-sm font-bold text-slate-700">{formData.stream === 'Engineering' ? 'Branch' : 'Group'}</span>
                    <select 
                      value={formData.groupOrBranch} 
                      onChange={e => setFormData({...formData, groupOrBranch: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select {formData.stream === 'Engineering' ? 'Branch' : 'Group'}</option>
                      {getBranchOptions().map((i: string) => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </label>
                )}

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-slate-700">Year / Semester</span>
                  <select 
                    value={formData.semesterOrYear} 
                    onChange={e => setFormData({...formData, semesterOrYear: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Timeframe</option>
                    {(Array.isArray((HIERARCHY as any)[formData.stream].semesters) ? (HIERARCHY as any)[formData.stream].semesters : (HIERARCHY as any)[formData.stream].semesters?.[formData.course] || (HIERARCHY as any)[formData.stream].years || []).map((i: string) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </label>

                <div className="col-span-full">
                  <span className="text-sm font-bold text-slate-700 block mb-3">Material Type</span>
                  <div className="flex flex-wrap gap-2">
                    {MATERIAL_TYPES.map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({...formData, materialType: type})}
                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          formData.materialType === type 
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block space-y-2">
                  <span className="text-sm font-bold text-slate-700">Topic Title</span>
                  <input 
                    type="text" 
                    placeholder="e.g., Fourier Series Made Easy"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-bold text-slate-700">Subject Name</span>
                  <input 
                    type="text" 
                    placeholder="e.g., Mathematics-II"
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </label>
              </div>

              <div className="relative pt-4">
                {formData.file ? (
                  <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2.5rem] border-2 border-blue-200 flex items-center justify-between group animate-fade-in shadow-inner">
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg mr-5 group-hover:rotate-6 transition-transform flex-shrink-0">
                        <FileText className="h-8 w-8" />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <p className="font-black text-slate-900 truncate text-lg">{formData.file.name}</p>
                          <span className="flex-shrink-0 w-fit px-3 py-1 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200">
                            {getFileSize(formData.file.size)}
                          </span>
                        </div>
                        <div className="flex items-center mt-2 space-x-3">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1.5 text-green-500" />
                            Ready for upload
                          </span>
                        </div>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, file: null})}
                      className="ml-4 p-3 bg-white text-red-500 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all shadow-md group-hover:scale-110 active:scale-90 flex-shrink-0"
                      title="Remove file"
                    >
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center hover:border-blue-400 hover:bg-blue-50/40 transition-all group cursor-pointer overflow-hidden">
                    <input 
                      type="file" 
                      accept=".pdf"
                      required
                      onChange={e => {
                        const file = e.target.files ? e.target.files[0] : null;
                        if (file && file.type !== 'application/pdf') {
                          alert("Only PDF files are allowed!");
                          return;
                        }
                        if (file && file.size > 1024 * 1024 * 1024) {
                          alert("File size exceeds 1GB limit!");
                          return;
                        }
                        setFormData({...formData, file});
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-6 rounded-3xl text-blue-400 mb-6 group-hover:scale-110 group-hover:text-blue-600 transition-all shadow-xl shadow-blue-900/5 border border-slate-100">
                        <FileCheck className="h-12 w-12" />
                      </div>
                      <span className="text-xl font-black text-slate-900">Drop Your PDF Here</span>
                      <span className="text-sm text-slate-500 mt-2 font-medium">Or click to browse your local files</span>
                      <div className="mt-8 flex gap-3">
                         <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Max 1GB</span>
                         <span className="px-4 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">PDF ONLY</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-16 flex items-center justify-between">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={prevStep} className="px-8">
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous Step
              </Button>
            ) : (
              <Button type="button" variant="ghost" onClick={onCancel} className="px-8">Cancel</Button>
            )}

            {step < 3 ? (
              <Button type="button" disabled={!isStepValid()} onClick={nextStep} className="px-8 shadow-xl shadow-blue-200">
                Continue <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit" isLoading={stage !== 'idle'} disabled={!isStepValid()} className="px-10 shadow-xl shadow-blue-200">
                Verify & Upload
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
