import type {
  AdminProfileResponse,
  UpdateAdminProfileData,
  ChangePasswordData,
} from "../types/adminProfile.types";

const API_URL = import.meta.env.VITE_API_URL;

// ==========================================
// GET ADMIN PROFILE
// ==========================================
export const getAdminProfileAPI =
  async (): Promise<AdminProfileResponse> => {
    const response = await fetch(
      `${API_URL}/admin/profile`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to fetch admin profile"
      );
    }

    return data;
  };

// ==========================================
// UPDATE ADMIN PROFILE
// ==========================================
export const updateAdminProfileAPI = async (
  profileData: UpdateAdminProfileData
): Promise<AdminProfileResponse> => {
  const response = await fetch(
    `${API_URL}/admin/profile`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Failed to update profile"
    );
  }

  return data;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================
export const changeAdminPasswordAPI =
  async (
    passwordData: ChangePasswordData
  ) => {
    const response = await fetch(
      `${API_URL}/admin/profile/password`,
      {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message ||
          "Failed to change password"
      );
    }

    return data;
  };