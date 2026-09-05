// PDF generation types and interfaces

export interface ReportCardData {
  student: {
    firstName: string;
    middleName?: string;
    lastName: string;
    admissionNumber: string;
    className?: string;
    classTeacher?: {
      firstName: string;
      lastName: string;
    };
  };
  session: string;
  term: string;
  results: SubjectResult[];
  summary?: SummaryStatistics;
  termRemarks?: TermRemarks;
}

export interface SubjectResult {
  subject?: {
    subjectName: string;
  };
  ca1Score?: number;
  ca2Score?: number;
  examScore?: number;
  total?: number;
  grade?: string;
  position?: number;
  subjectTeacherRemark?: string;
}

export interface SummaryStatistics {
  totalSubjects: number;
  averageScore: number;
  passedSubjects: number;
  classEnrollmentCount: number;
}

export interface TermRemarks {
  classTeacherRemark?: string;
  headTeacherRemark?: string;
}

export interface PDFOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter';
  unit?: 'mm' | 'pt' | 'px' | 'in';
}

export interface PDFFontConfig {
  size?: number;
  style?: 'normal' | 'bold' | 'italic';
  color?: string;
}

export interface PDFTableStyles {
  fontSize?: number;
  cellPadding?: number;
  valign?: 'top' | 'middle' | 'bottom';
  halign?: 'left' | 'center' | 'right';
  font?: string;
  lineColor?: number[];
  lineWidth?: number;
}

export interface PDFHeadStyles extends PDFTableStyles {
  fillColor?: number[];
  textColor?: number;
  fontStyle?: 'normal' | 'bold' | 'italic';
}

export interface PDFColumnStyles extends PDFTableStyles {
  columnWidth?: 'auto' | 'wrap' | number;
}