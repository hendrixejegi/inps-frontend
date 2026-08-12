import { StaffRole, StaffType, StaffStatus, Gender } from "./common";

export interface Staff {
  id: string;
  staffId: string;
  firebaseUid?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: string;
  email: string;
  phone?: string;
  type: StaffType;
  role: StaffRole;
  status: StaffStatus;
  biometricId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  gender?: Gender;
  dateOfBirth?: string;
  address?: string;
}

export interface UpdateStaffRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: Gender;
  dateOfBirth?: string;
  role?: StaffRole;
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
