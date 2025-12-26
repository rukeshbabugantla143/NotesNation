
import { 
  collection, 
  addDoc, 
  setDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  updateDoc,
  increment,
  getDoc,
  FirestoreError,
  arrayUnion,
  arrayRemove,
  deleteDoc
} from "firebase/firestore";
import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, UploadTask } from "firebase/storage";
import { db, storage } from "./firebase";
import { User, Note, NoteRequest, NoteStatus, AdminNotification, AdminAuditLog } from '../types';

export const DB = {
  // Real-time Listeners
  listenToNotes: (callback: (notes: Note[]) => void, onError?: (err: FirestoreError) => void) => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    return onSnapshot(q, 
      (snapshot) => {
        const notes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
        callback(notes);
      },
      (error) => {
        console.error("Firestore Notes Error:", error);
        if (onError) onError(error);
      }
    );
  },

  listenToUsers: (callback: (users: User[]) => void, onError?: (err: FirestoreError) => void) => {
    return onSnapshot(collection(db, "users"), 
      (snapshot) => {
        const users = snapshot.docs.map(doc => {
          const data = doc.data() as any;
          return {
            id: doc.id,
            ...data,
            name: (data.fullName || data.name || 'User').toString().trim(),
            mobileNumber: (data.phoneNumber || data.mobileNumber || '').toString().trim(),
            role: (data.role || 'student').toString().trim().toLowerCase(), 
            email: (data.email || '').toString().trim(),
            bookmarks: data.bookmarks || []
          } as User;
        });
        callback(users);
      },
      (error) => {
        console.error("Firestore Users Error:", error);
        if (onError) onError(error);
      }
    );
  },

  listenToRequests: (callback: (reqs: NoteRequest[]) => void, onError?: (err: FirestoreError) => void) => {
    const q = query(collection(db, "requests"), orderBy("createdAt", "desc"));
    return onSnapshot(q, 
      (snapshot) => {
        const reqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NoteRequest));
        callback(reqs);
      },
      (error) => {
        console.error("Firestore Requests Error:", error);
        if (onError) onError(error);
      }
    );
  },

  listenToAdminNotifications: (callback: (notifs: AdminNotification[]) => void) => {
    const q = query(collection(db, "admin_notifications"), orderBy("timestamp", "desc"), limit(20));
    return onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminNotification));
      callback(notifs);
    });
  },

  listenToAuditLogs: (callback: (logs: AdminAuditLog[]) => void) => {
    const q = query(collection(db, "admin_audit_logs"), orderBy("timestamp", "desc"), limit(100));
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminAuditLog));
      callback(logs);
    });
  },

  // Actions
  uploadFileWithProgress(file: File, path: string, onProgress: (pct: number) => void): { task: UploadTask, promise: Promise<string> } {
    const storageRef = ref(storage, path);
    const metadata = {
      contentDisposition: `attachment; filename="${file.name}"`,
      contentType: file.type
    };
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
    const promise = new Promise<string>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(progress);
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => resolve(downloadURL));
        }
      );
    });
    return { task: uploadTask, promise };
  },

  async addNote(note: Omit<Note, 'id'>) {
    const docRef = await addDoc(collection(db, "notes"), note);
    await DB.createAdminNotification({
      type: 'note_upload',
      title: 'New Note Uploaded',
      message: `${note.uploaderName} uploaded "${note.title}" for ${note.subject}`,
      relatedId: docRef.id
    });
    return docRef;
  },

  async reportNote(noteId: string, title: string, reporterName: string) {
    await updateDoc(doc(db, "notes", noteId), { reports: increment(1) });
    await DB.createAdminNotification({
      type: 'report',
      title: 'Material Reported',
      message: `${reporterName} reported "${title}" for review.`,
      relatedId: noteId
    });
  },

  async postRequest(req: Omit<NoteRequest, 'id'>) {
    const docRef = await addDoc(collection(db, "requests"), req);
    await DB.createAdminNotification({
      type: 'request_post',
      title: 'New Note Request',
      message: `${req.requesterName} requested notes for ${req.subject}`,
      relatedId: docRef.id
    });
    return docRef;
  },

  // Admin Systems
  async createAdminNotification(data: Omit<AdminNotification, 'id' | 'timestamp' | 'read'>) {
    const notif = {
      ...data,
      timestamp: new Date().toISOString(),
      read: false
    };
    await addDoc(collection(db, "admin_notifications"), notif);
  },

  async createAuditLog(log: Omit<AdminAuditLog, 'id' | 'timestamp'>) {
    const logData = {
      ...log,
      timestamp: new Date().toISOString()
    };
    return addDoc(collection(db, "admin_audit_logs"), logData);
  },

  async markNotificationRead(id: string) {
    return updateDoc(doc(db, "admin_notifications", id), { read: true });
  },

  // Admin Moderate Actions with Logging
  async updateNoteStatus(noteId: string, status: NoteStatus, uploaderId: string, adminUser: User) {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);
    const noteData = noteSnap.data() as Note;
    
    await updateDoc(noteRef, { status });
    
    if (status === 'Approved' && uploaderId) {
      await updateDoc(doc(db, "users", uploaderId), { points: increment(10) });
    }

    await DB.createAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name || 'Admin',
      action: status === 'Approved' ? 'Approved Material' : 'Rejected Material',
      targetId: noteId,
      targetName: noteData?.title || 'Unknown Note',
      category: 'Note'
    });
  },

  async deleteNote(noteId: string, adminUser: User) {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);
    const noteData = noteSnap.data() as Note;
    
    await updateDoc(noteRef, { status: 'Deleted' });
    
    await DB.createAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name || 'Admin',
      action: 'Moved Material to Bin',
      targetId: noteId,
      targetName: noteData?.title || 'Unknown Note',
      category: 'Note'
    });
  },

  async restoreNote(noteId: string, adminUser: User) {
    const noteRef = doc(db, "notes", noteId);
    const noteSnap = await getDoc(noteRef);
    const noteData = noteSnap.data() as Note;
    
    await updateDoc(noteRef, { status: 'Approved' });
    
    await DB.createAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name || 'Admin',
      action: 'Restored Material',
      targetId: noteId,
      targetName: noteData?.title || 'Unknown Note',
      category: 'Note'
    });
  },

  async deleteNotePermanently(noteId: string, targetName: string, adminUser: User) {
    await deleteDoc(doc(db, "notes", noteId));
    await DB.createAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name || 'Admin',
      action: 'PERMANENTLY Deleted Material',
      targetId: noteId,
      targetName: targetName,
      category: 'Note'
    });
  },

  async deleteRequest(requestId: string, adminUser: User) {
    const reqRef = doc(db, "requests", requestId);
    const reqSnap = await getDoc(reqRef);
    const reqData = reqSnap.data() as NoteRequest;
    
    await updateDoc(reqRef, { status: 'Deleted' });
    
    await DB.createAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name || 'Admin',
      action: 'Moved Request to Bin',
      targetId: requestId,
      targetName: reqData?.title || 'Unknown Request',
      category: 'Request'
    });
  },

  async restoreRequest(requestId: string, adminUser: User) {
    const reqRef = doc(db, "requests", requestId);
    const reqSnap = await getDoc(reqRef);
    const reqData = reqSnap.data() as NoteRequest;
    
    await updateDoc(reqRef, { status: 'Open' });
    
    await DB.createAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name || 'Admin',
      action: 'Restored Request',
      targetId: requestId,
      targetName: reqData?.title || 'Unknown Request',
      category: 'Request'
    });
  },

  async deleteRequestPermanently(requestId: string, targetName: string, adminUser: User) {
    await deleteDoc(doc(db, "requests", requestId));
    await DB.createAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name || 'Admin',
      action: 'PERMANENTLY Deleted Request',
      targetId: requestId,
      targetName: targetName,
      category: 'Request'
    });
  },

  async updateUserStatus(userId: string, status: 'active' | 'blocked', targetName: string, adminUser: User) {
    await updateDoc(doc(db, "users", userId), { status });
    await DB.createAuditLog({
      adminId: adminUser.id,
      adminName: adminUser.name || 'Admin',
      action: status === 'blocked' ? 'Suspended User' : 'Activated User',
      targetId: userId,
      targetName: targetName,
      category: 'User'
    });
  },

  // Student Actions
  async createUser(user: User) {
    const docRef = doc(db, "users", user.id);
    // Use merge to avoid overwriting existing points/badges for social login
    await setDoc(docRef, user, { merge: true });
    
    // Check if it's truly a new user by looking at timestamp or similar
    // For now, notification logic remains simple.
    await DB.createAdminNotification({
      type: 'user_signup',
      title: 'Student Profile Sync',
      message: `${user.name || 'A student'} profile updated.`,
      relatedId: user.id
    });
  },

  async getUser(id: string): Promise<User | null> {
    const docSnap = await getDoc(doc(db, "users", id));
    if (!docSnap.exists()) return null;
    const data = docSnap.data() as any;
    return { 
      id: docSnap.id, 
      ...data, 
      name: data.name || data.fullName || 'User' 
    } as User;
  },

  async likeNote(noteId: string) {
    return updateDoc(doc(db, "notes", noteId), { likes: increment(1) });
  },

  async toggleBookmark(userId: string, noteId: string, isBookmarked: boolean) {
    return updateDoc(doc(db, "users", userId), {
      bookmarks: isBookmarked ? arrayRemove(noteId) : arrayUnion(noteId)
    });
  },

  async trackDownload(noteId: string) {
    return updateDoc(doc(db, "notes", noteId), { downloads: increment(1) });
  }
};
