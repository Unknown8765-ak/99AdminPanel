export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer" | "admin";
  isEmailVerified: boolean;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthData {
  user: User;
  accessToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export type LoginResponse = ApiResponse<AuthData>;

export type RegisterResponse = ApiResponse<AuthData>;

export type MeResponse = ApiResponse<User>;
