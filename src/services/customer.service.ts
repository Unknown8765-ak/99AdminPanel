import type {
  CustomerDetailsResponse,
  GetCustomersResponse,
} from "../types/customer.types";

const API_URL = import.meta.env.VITE_API_URL;

interface GetCustomersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean | "";
}

export const getCustomersAPI = async ({
  page = 1,
  limit = 10,
  search = "",
  isActive = "",
}: GetCustomersParams = {}): Promise<GetCustomersResponse> => {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search) {
    params.append("search", search);
  }

  if (isActive !== "") {
    params.append("isActive", String(isActive));
  }

  const response = await fetch(
    `${API_URL}/admin/customers?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();
  console.log("customerAPI" ,data)

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to fetch customers"
    );
  }

  return data;
};

export const getCustomerByIdAPI = async (
  id: string
): Promise<CustomerDetailsResponse> => {
  const response = await fetch(
    `${API_URL}/customers/${id}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to fetch customer"
    );
  }

  return data;
};


export const updateCustomerStatusAPI = async (
  id: string,
  isActive: boolean
) => {
  const response = await fetch(
    `${API_URL}/customers/${id}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isActive,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message ||
        "Failed to update customer status"
    );
  }

  return data;
};