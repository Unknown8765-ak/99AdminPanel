import { useEffect, useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaPhone,
  FaSave,
  FaUser,
} from "react-icons/fa";

import {
  changeAdminPasswordAPI,
  getAdminProfileAPI,
  updateAdminProfileAPI,
} from "../../services/adminProfile.service";

import type {
  AdminProfile,
} from "../../types/adminProfile.types";

const Profile = () => {
  const [profile, setProfile] =
    useState<AdminProfile | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // ==========================================
  // FETCH PROFILE
  // ==========================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await getAdminProfileAPI();

        setProfile(response.data);
        setName(response.data.name);
        setPhone(response.data.phone || "");
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // UPDATE PROFILE
  // ==========================================
  const handleUpdateProfile = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response =
        await updateAdminProfileAPI({
          name,
          phone,
        });

      setProfile(response.data);

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // CHANGE PASSWORD
  // ==========================================
  const handleChangePassword = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setError("");
      setMessage("");

      await changeAdminPasswordAPI({
        currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");

      setMessage(
        "Password changed successfully."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 text-center text-red-500">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Admin Profile
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your profile and account security.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg p-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-4">
          {error}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FaUser />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Profile Information
              </h2>

              <p className="text-sm text-gray-500">
                Update your personal information.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleUpdateProfile}
          className="p-6 space-y-5"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>

            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <p className="text-xs text-gray-400 mt-1">
              Email cannot be changed from profile.
            </p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>

            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter phone number"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Role / Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>

              <input
                value="Admin"
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>

              <div className="px-4 py-3 border border-gray-200 rounded-lg bg-gray-50">
                {profile.isActive ? (
                  <span className="text-green-600 font-medium">
                    Active
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <FaSave />

              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 text-red-600 rounded-lg">
              <FaLock />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Security
              </h2>

              <p className="text-sm text-gray-500">
                Change your account password.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleChangePassword}
          className="p-6 space-y-5"
        >
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(
                  e.target.value
                )
              }
              placeholder="Enter current password"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(
                  e.target.value
                )
              }
              placeholder="Enter new password"
              minLength={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              required
            />

            <p className="text-xs text-gray-400 mt-1">
              Password must be at least 8 characters.
            </p>
          </div>

          {/* Change Password */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={changingPassword}
              className="flex items-center gap-2 px-5 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50"
            >
              <FaLock />

              {changingPassword
                ? "Changing..."
                : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;