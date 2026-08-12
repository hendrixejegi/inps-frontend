import { apiClient } from "./client";
import { Staff, CreateStaffRequest, UpdateStaffRequest, StaffLoginRequest, ChangePasswordRequest } from "@/lib/types/staff";
import { ApiResponse, PaginatedResponse } from "@/lib/types/common";

export const staffApi = {
  // Authentication
  async login(data: StaffLoginRequest): Promise<ApiResponse & { token?: string; refreshToken?: string; user?: Staff }> {
    return apiClient.post<ApiResponse & { token?: string; refreshToken?: string; user?: Staff }>("/api/staff/login", data);
  },

  async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    return apiClient.post<{ token: string; refreshToken: string }>("/api/staff/refresh-token", { refreshToken });
  },

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>("/api/staff/change-password", data);
  },

  async getMe(): Promise<ApiResponse<Staff>> {
    return apiClient.get<ApiResponse<Staff>>("/api/staff/me");
  },

  // Staff Management (Admin only)
  async getAllStaff(params?: {
    role?: string;
    type?: string;
    includeDeleted?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Staff>> {
    return apiClient.get<PaginatedResponse<Staff>>("/api/admin/staff", params);
  },

  async getStaffById(staffId: string): Promise<ApiResponse<Staff>> {
    return apiClient.get<ApiResponse<Staff>>(`/api/admin/staff/${staffId}`);
  },

  async createStaff(data: CreateStaffRequest): Promise<ApiResponse<Staff>> {
    return apiClient.post<ApiResponse<Staff>>("/api/admin/staff", data);
  },

  async updateStaff(staffId: string, data: UpdateStaffRequest): Promise<ApiResponse<Staff>> {
    return apiClient.put<ApiResponse<Staff>>(`/api/admin/staff/${staffId}`, data);
  },

  async deactivateStaff(staffId: string): Promise<ApiResponse> {
    return apiClient.patch<ApiResponse>(`/api/admin/staff/${staffId}/deactivate`);
  },

  async reactivateStaff(staffId: string): Promise<ApiResponse> {
    return apiClient.patch<ApiResponse>(`/api/admin/staff/${staffId}/reactivate`);
  },

  async resetPassword(staffId: string): Promise<ApiResponse> {
    return apiClient.post<ApiResponse>(`/api/admin/staff/${staffId}/reset-password`);
  },
};
