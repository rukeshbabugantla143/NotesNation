
export type UserRole = 'visitor' | 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  mobileNumber: string;
  email?: string;
  role: UserRole;
  points: number;
  badge: 'Bronze' | 'Silver' | 'Gold' | null;
  status: 'active' | 'blocked';
  joinedAt: string;
  bookmarks: string[]; // Array of Note IDs
}

export type StreamType = 'Engineering' | 'Degree' | 'Medical' | 'Nursing & Pharmacy' | 'Intermediate';
export type StateType = 'AP' | 'TS';
export type NoteStatus = 'Pending' | 'Approved' | 'Rejected' | 'Deleted';

export interface Note {
  id: string;
  title: string;
  subject: string;
  state: StateType;
  stream: StreamType;
  course: string;
  regulation?: string;
  board?: string;
  groupOrBranch: string;
  semesterOrYear: string;
  materialType: string;
  university?: string;
  filePath: string;
  uploadedBy: string;
  uploaderName: string;
  status: NoteStatus;
  downloads: number;
  likes: number;
  createdAt: string;
  isAnonymous: boolean;
}

export interface NoteRequest {
  id: string;
  requestedBy: string;
  requesterName: string;
  title: string;
  subject: string;
  stream: StreamType;
  description: string;
  status: 'Open' | 'Fulfilled' | 'Closed' | 'Deleted';
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  // Added 'report' type to support material reporting notifications in the admin dashboard
  type: 'note_upload' | 'request_post' | 'user_signup' | 'report';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetId: string;
  targetName: string;
  timestamp: string;
  category: 'Note' | 'User' | 'Request' | 'System';
}

// Added ExamAlert interface to support the Exam Center view
export interface ExamAlert {
  id: string;
  university: string;
  examName: string;
  date: string;
  stream: StreamType;
}
