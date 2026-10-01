export interface AdminProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin";
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileResponse {
  statusCode: number;
  data: AdminProfile;
  message: string;
  success: boolean;
}

export interface UpdateAdminProfileData {
  name?: string;
  phone?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}