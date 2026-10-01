import type {
  GetAllOrdersData,
  GetOrdersParams,
  Order,
  OrderApiResponse,
  UpdateOrderStatusPayload,
} from "../types/order.types";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * GET ALL ADMIN ORDERS
 */
export const getAllOrdersAPI = async (
  {
    page = 1,
    limit = 10,
    search = "",
    orderStatus = "",
    paymentStatus = "",
    sort = "newest",
  }: GetOrdersParams = {}
): Promise<OrderApiResponse<GetAllOrdersData>> => {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (orderStatus) {
    params.append("orderStatus", orderStatus);
  }

  if (paymentStatus) {
    params.append("paymentStatus", paymentStatus);
  }

  if (sort) {
    params.append("sort", sort);
  }

  const response = await fetch(
    `${API_URL}/admin/orders?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data =
    (await response.json()) as OrderApiResponse<GetAllOrdersData>;

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to fetch orders"
    );
  }

  return data;
};

/**
 * GET ADMIN ORDER BY ID
 */
export const getAdminOrderByIdAPI = async (
  orderId: string
): Promise<OrderApiResponse<Order>> => {
  const response = await fetch(
    `${API_URL}/admin/orders/${orderId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data =
    (await response.json()) as OrderApiResponse<Order>;

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to fetch order"
    );
  }

  return data;
};

/**
 * UPDATE ORDER STATUS
 */
export const updateOrderStatusAPI = async (
  orderId: string,
  payload: UpdateOrderStatusPayload
): Promise<OrderApiResponse<Order>> => {
  const response = await fetch(
    `${API_URL}/admin/orders/${orderId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data =
    (await response.json()) as OrderApiResponse<Order>;

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to update order status"
    );
  }

  return data;
};