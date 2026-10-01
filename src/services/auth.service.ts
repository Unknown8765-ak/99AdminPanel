import type {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  MeResponse,
} from "../types/auth.types";

const API_BASE_URL = import.meta.env.API_URL;
console.log(API_BASE_URL)

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,

    credentials: "include",

    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const responseText = await response.text();

  console.log(
    "API URL:",
    `${API_BASE_URL}${endpoint}`
  );

  // console.log("Status:", response.status);

  console.log(
    "Content-Type:",
    response.headers.get("content-type")
  );

  // console.log("Response:", responseText);

  let result: T;

  try {
    result = JSON.parse(responseText) as T;
  } catch {
    throw new Error(
      `Invalid JSON response. Status: ${response.status}`
    );
  }

  if (!response.ok) {
    const errorResponse = result as {
      message?: string;
    };

    throw new Error(
      errorResponse.message || "Something went wrong"
    );
  }

  return result;
};

export const loginUserAPI = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
   
  });
  console.log("auth" ,response)
   return response
};


export const registerUserAPI = async (
  credentials: RegisterCredentials
): Promise<RegisterResponse> => {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};


export const logoutUserAPI = async (): Promise<void> => {
  await request("/auth/logout", {
    method: "POST",
  });
};


export const getCurrentUserAPI = async (): Promise<MeResponse> => {
  return request<MeResponse>("/auth/me", {
    method: "GET",
  });
};
