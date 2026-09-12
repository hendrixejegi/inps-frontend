// Unified result types for reusable results functionality across admin and parent portals

export interface UnifiedSubjectResult {
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
  position?: number;
  subjectTeacherRemark?: string;
  // Multi-term data (optional - for future enhancement)
  firstTermScores?: {
    test1?: number;
    test2?: number;
    exam?: number;
    total?: number;
  };
  secondTermScores?: {
    test1?: number;
    test2?: number;
    exam?: number;
    total?: number;
  };
  // Cumulative calculations
  cumulativeTotal?: number;
  weightedAverage?: number;
}

export interface UnifiedResultsData {
  student: {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    admissionNumber: string;
    className?: string;
    gender?: string;
    classTeacher?: {
      firstName: string;
      lastName: string;
    };
  };
  session: string;
  term: string;
  results: UnifiedSubjectResult[];
  summary?: {
    totalSubjects: number;
    averageScore: number;
    subjectsPassed: number;
    overallPosition?: number;
    classEnrollmentCount?: number;
  };
  remarks?: {
    classTeacherRemark?: string;
    headTeacherRemark?: string;
  };
  // Skills & Behavior ratings (optional - for future enhancement)
  skillsRatings?: {
    fluency?: number;
    games?: number;
    musicalSkills?: number;
  };
  behaviorRatings?: {
    punctuality?: number;
    neatness?: number;
    politeness?: number;
    selfControl?: number;
  };
}

export interface SelectionData {
  studentId?: string;
  classId?: string;
  sessionId?: string;
  termId?: string;
  viewMode?: 'detail' | 'summary' | 'reportcard';
  mode?: 'single' | 'batch';
}

export interface PDFOptions {
  filename?: string;
  orientation?: 'portrait' | 'landscape';
  format?: 'a4' | 'letter' | 'legal';
  unit?: 'mm' | 'px' | 'in' | 'pt';
}

// Skills and Behavior rating interfaces
interface SkillsRating {
  fluency?: number;
  games?: number;
  musicalSkills?: number;
  [key: string]: number | undefined;
}

interface BehaviorRating {
  punctuality?: number;
  neatness?: number;
  politeness?: number;
  selfControl?: number;
  [key: string]: number | undefined;
}

// Admin data structure for transformation
interface AdminResultData {
  student?: {
    id?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    admissionNumber?: string;
    className?: string;
    gender?: string;
    classTeacher?: {
      firstName?: string;
      lastName?: string;
    };
  };
  session?: string;
  term?: string;
  results?: Array<{
    subject?: {
      id?: string;
      subjectName?: string;
      subjectCode?: string;
    };
    ca1Score?: number;
    ca2Score?: number;
    examScore?: number;
    total?: number;
    grade?: string;
    position?: number;
    subjectTeacherRemark?: string;
  }>;
  summary?: {
    totalSubjects?: number;
    averageScore?: number;
    passedSubjects?: number;
    overallPosition?: number;
    classEnrollmentCount?: number;
  };
  termRemarks?: {
    classTeacherRemark?: string;
    headTeacherRemark?: string;
  };
  // Optional skills and behavior data
  skillsRatings?: SkillsRating;
  behaviorRatings?: BehaviorRating;
}

// Parent data structure for transformation
interface ParentResultData {
  session?: string;
  term?: string;
  results?: Array<{
    subject?: {
      id?: string;
      subjectName?: string;
      subjectCode?: string;
    };
    scores?: {
      ca1?: number;
      ca2?: number;
      exam?: number;
      total?: number;
      grade?: string;
    };
    position?: number;
    subjectTeacherRemark?: string;
  }>;
  summary?: {
    totalSubjects?: number;
    averageScore?: number;
    subjectsPassed?: number;
    overallPosition?: number;
  };
  classTeacherRemark?: string;
  headTeacherRemark?: string;
}

interface ChildData {
  id?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  admissionNumber?: string;
  class?: {
    name?: string;
  };
}

// Data transformation functions
export function transformAdminToUnified(
  adminData: AdminResultData,
): UnifiedResultsData {
  return {
    student: {
      id: adminData.student?.id || '',
      firstName: adminData.student?.firstName || '',
      middleName: adminData.student?.middleName,
      lastName: adminData.student?.lastName || '',
      admissionNumber: adminData.student?.admissionNumber || '',
      className: adminData.student?.className,
      gender: adminData.student?.gender,
      classTeacher: adminData.student?.classTeacher
        ? {
            firstName: adminData.student.classTeacher.firstName || 'Unknown',
            lastName: adminData.student.classTeacher.lastName || 'Unknown',
          }
        : undefined,
    },
    session: adminData.session || '',
    term: adminData.term || '',
    results:
      adminData.results?.map((result) => ({
        subject: {
          id: result.subject?.id || '',
          subjectName: result.subject?.subjectName || 'N/A',
          subjectCode: result.subject?.subjectCode || '',
        },
        scores: {
          ca1: result.ca1Score || 0,
          ca2: result.ca2Score || 0,
          exam: result.examScore || 0,
          total: result.total || 0,
          grade: result.grade || 'N/A',
        },
        position: result.position,
        subjectTeacherRemark: result.subjectTeacherRemark,
        // Placeholder cumulative calculations (will be enhanced when multi-term data available)
        cumulativeTotal: result.total ? result.total * 3 : undefined,
        weightedAverage: result.total || 0,
      })) || [],
    summary: adminData.summary
      ? {
          totalSubjects: adminData.summary.totalSubjects || 0,
          averageScore: adminData.summary.averageScore || 0,
          subjectsPassed: adminData.summary.passedSubjects || 0,
          overallPosition: adminData.summary.overallPosition,
          classEnrollmentCount: adminData.summary.classEnrollmentCount,
        }
      : undefined,
    remarks: adminData.termRemarks
      ? {
          classTeacherRemark: adminData.termRemarks.classTeacherRemark,
          headTeacherRemark: adminData.termRemarks.headTeacherRemark,
        }
      : undefined,
    // Add skills and behavior ratings if available
    skillsRatings: adminData.skillsRatings,
    behaviorRatings: adminData.behaviorRatings,
  };
}

export function transformParentToUnified(
  parentData: ParentResultData,
  childData: ChildData,
): UnifiedResultsData {
  return {
    student: {
      id: childData.id || '',
      firstName: childData.firstName || '',
      middleName: childData.middleName,
      lastName: childData.lastName || '',
      admissionNumber: childData.admissionNumber || '',
      className: childData.class?.name,
      classTeacher: undefined, // Not available in parent data
    },
    session: parentData.session || '',
    term: parentData.term || '',
    results:
      parentData.results?.map((result) => ({
        subject: {
          id: result.subject?.id || '',
          subjectName: result.subject?.subjectName || 'N/A',
          subjectCode: result.subject?.subjectCode || '',
        },
        scores: {
          ca1: result.scores?.ca1 || 0,
          ca2: result.scores?.ca2 || 0,
          exam: result.scores?.exam || 0,
          total: result.scores?.total || 0,
          grade: result.scores?.grade || 'N/A',
        },
        position: result.position,
        subjectTeacherRemark: result.subjectTeacherRemark,
      })) || [],
    summary: parentData.summary
      ? {
          totalSubjects: parentData.summary.totalSubjects || 0,
          averageScore: parentData.summary.averageScore || 0,
          subjectsPassed: parentData.summary.subjectsPassed || 0,
          overallPosition: parentData.summary.overallPosition,
          classEnrollmentCount: 0, // Not available in parent data
        }
      : undefined,
    remarks: {
      classTeacherRemark: parentData.classTeacherRemark,
      headTeacherRemark: parentData.headTeacherRemark,
    },
  };
}
