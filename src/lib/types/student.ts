import { Gender, StudentStatus, IntakeType, SchoolLevel, Guardian } from "./common";

export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: Gender;
  dateOfBirth: string;
  nationality?: string;
  state?: string;
  lga?: string;
  religion?: string;
  healthInfo?: string;
  bloodGroup?: string;
  sportHouse?: string;
  studentType?: string;
  address?: string;
  status: StudentStatus;
  intakeType?: IntakeType;
  admissionDate: string;
  graduationDate?: string;
  passportPhoto?: string;
  admissionDocs?: string[];
  createdAt: string;
  updatedAt: string;
  class?: ClassInfo;
  section?: SectionInfo;
  parent?: ParentInfo;
  enrollments?: EnrollmentInfo[];
}

export interface ClassInfo {
  id: string;
  name: string;
  level: SchoolLevel;
}

export interface SectionInfo {
  id: string;
  name: string;
  color?: string;
  roomNumber?: string;
}

export interface EnrollmentInfo {
  id: string;
  studentId: string;
  classId: string;
  sectionId: string | null;
  academicYear: string;
  term: string;
  status: string;
  class?: ClassInfo;
  section?: SectionInfo;
}

export interface ParentInfo {
  id: string;
  firebaseUid: string;
  accountEmail: string;
  accountPhone: string;
  primaryGuardian: Guardian;
  secondaryGuardian?: Guardian;
  address?: string;
  maritalStatus?: string;
  biometricId?: string;
  firstName?: string; // Computed from primaryGuardian
  lastName?: string; // Computed from primaryGuardian
}

export interface Parent {
  id: string;
  firebaseUid: string;
  accountEmail: string;
  accountPhone: string;
  primaryGuardian: Guardian;
  secondaryGuardian?: Guardian;
  address?: string;
  maritalStatus?: string;
  biometricId?: string;
  students?: Student[];
  createdAt: string;
  updatedAt: string;
  firstName?: string; // Computed from primaryGuardian
  lastName?: string; // Computed from primaryGuardian
}

export interface CreateParentRequest {
  accountEmail: string;
  accountPhone: string;
  primaryGuardian: Guardian;
  secondaryGuardian?: Guardian;
  address?: string;
  maritalStatus?: string;
}

export interface UpdateParentRequest {
  accountEmail?: string;
  accountPhone?: string;
  primaryGuardian?: Guardian;
  secondaryGuardian?: Guardian;
  address?: string;
  maritalStatus?: string;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: Gender;
  dateOfBirth: string;
  nationality?: string;
  state?: string;
  lga?: string;
  religion?: string;
  healthInfo?: string;
  bloodGroup?: string;
  sportHouse?: string;
  studentType?: string;
  address?: string;
  intakeType?: IntakeType;
  admissionDate: string;
  graduationDate?: string;
  accountEmail: string;
  accountPhone: string;
  parentData: string; // JSON string with guardian structure
  passportPhoto?: File;
  admissionDocs?: File[];
}

export interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  gender?: Gender;
  dateOfBirth?: string;
  nationality?: string;
  state?: string;
  lga?: string;
  religion?: string;
  healthInfo?: string;
  bloodGroup?: string;
  sportHouse?: string;
  studentType?: string;
  address?: string;
  status?: StudentStatus;
  intakeType?: IntakeType;
  admissionDate?: string;
  graduationDate?: string;
}
