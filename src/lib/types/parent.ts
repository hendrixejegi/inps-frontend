// Parent-specific types for the parent portal

export interface Parent {
  id: string;
  accountEmail: string;
  accountPhone: string;
  primaryGuardian: {
    firstName: string;
    lastName: string;
    relationship: string;
  };
  students: Child[];
  status: 'ACTIVE' | 'INACTIVE';
  firebaseUid?: string;
}

export interface Child {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: 'MALE' | 'FEMALE';
  dateOfBirth: string;
  address: string;
  class: {
    id: string;
    name: string;
    color: string;
  };
  passportPhoto?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface SubjectResult {
  subject: {
    id: string;
    subjectName: string;
    subjectCode: string;
  };
  scores: {
    ca1: number;
    ca2: number;
    exam: number;
    total: number;
    grade: string;
  };
  subjectTeacherRemark?: string;
  position?: number;
}

export interface ChildResults {
  results: SubjectResult[];
  classTeacherRemark: string;
  headTeacherRemark: string;
  summary?: ResultsSummary;
  session: string;
  term: string;
}

export interface ResultsSummary {
  totalSubjects: number;
  subjectsPassed: number;
  averageScore: number;
  overallPosition: number;
  classAverages?: {
    [subjectId: string]: number;
  };
}

export interface AttendanceData {
  total: number;
  present: number;
  late: number;
  excused: number;
  absent: number;
  attendanceRate: number;
}

export interface TimetableEntry {
  subject: string;
  startTime: string;
  endTime: string;
  teacher: string;
  dayOfWeek: string;
}

export interface Timetable {
  [dayOfWeek: string]: TimetableEntry[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  announcementCategory: 'GENERAL' | 'URGENT' | 'CLASS_UPDATE';
  isRead: boolean;
  createdAt: string;
  createdBy?: string;
}

export interface FeeInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'PENDING' | 'PARTIAL' | 'PAID';
  dueDate: string;
  description: string;
}

export interface OutstandingFees {
  totalOutstanding: number;
  invoices: FeeInvoice[];
}

export interface Payment {
  id: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentDate: string;
  invoice: {
    id: string;
    invoiceNumber: string;
    status: string;
  };
}

export interface ParentSettings {
  accountEmail: string;
  accountPhone: string;
  primaryGuardian: {
    firstName: string;
    lastName: string;
    relationship: string;
  };
  secondaryGuardian?: {
    firstName: string;
    lastName: string;
    relationship: string;
    phoneNumber?: string;
  };
  address?: string;
}