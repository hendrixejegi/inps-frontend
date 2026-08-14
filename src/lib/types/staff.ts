import { StaffRole, StaffType, StaffStatus, Gender } from "./common";

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
  SEPARATED = "SEPARATED",
}

export interface Qualification {
  degree: string;
  institution: string;
  year: string;
}

export interface PreviousEmployment {
  company: string;
  position: string;
  period: string;
}

export interface Staff {
  id: string;
  staffId: string;
  firebaseUid?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  state?: string;
  lga?: string;
  religion?: string;
  address?: string;
  email: string;
  phone?: string;
  type: StaffType;
  role: StaffRole;
  status: StaffStatus;
  biometricId?: string;
  qualifications?: Qualification[];
  subjectId?: string;
  yearsOfExperience?: number;
  previousEmployment?: PreviousEmployment[];
  dateOfEmployment?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  nextOfKinAddress?: string;
  createdAt: string;
  updatedAt: string;
  financialRecord?: StaffFinancial;
  subject?: {
    id: string;
    subjectName: string;
    subjectCode: string;
  };
}

export interface StaffFinancial {
  id: string;
  staffId: string;
  salary?: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  taxId?: string;
  pensionNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  role: StaffRole;
  gender?: Gender;
  dateOfBirth?: string;
  address?: string;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  state?: string;
  lga?: string;
  religion?: string;
  qualifications?: Qualification[];
  subjectId?: string;
  yearsOfExperience?: number;
  previousEmployment?: PreviousEmployment[];
  dateOfEmployment?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  nextOfKinAddress?: string;
}

export interface UpdateStaffRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: Gender;
  dateOfBirth?: string;
  role?: StaffRole;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  state?: string;
  lga?: string;
  religion?: string;
  qualifications?: Qualification[];
  subjectId?: string;
  yearsOfExperience?: number;
  previousEmployment?: PreviousEmployment[];
  dateOfEmployment?: string;
  nextOfKinName?: string;
  nextOfKinPhone?: string;
  nextOfKinRelationship?: string;
  nextOfKinAddress?: string;
}

export interface UpdateStaffFinancialRequest {
  salary?: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  taxId?: string;
  pensionNumber?: string;
}

export interface StaffLoginRequest {
  email: string;
  password: string;
}

export interface StaffLoginResponse {
  success: boolean;
  data?: {
    token: string;
    refreshToken: string;
    staff: Staff;
  };
  message?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
