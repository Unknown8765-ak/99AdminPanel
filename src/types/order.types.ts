
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

/**
 * Payment status
 */
export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

/**
 * Payment method
 */
export type PaymentMethod =
  | "cod"
  | "razorpay";

/**
 * Customer
 */
export interface OrderUser {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
}

/**
 * Product inside order
 */
export interface OrderProduct {
  _id: string;
  name: string;
  slug?: string;
  images?: string[];
  price?: number;
  sku?: string;
}

/**
 * Order item
 */
export interface OrderItem {
  product: string | OrderProduct;
  name: string;
  sku: string;
  image?: string;
  quantity: number;
  price: number;
  subtotal: number;
}

/**
 * Shipping address
 */
export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Order status history
 */
export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

/**
 * Order
 */
export interface Order {
  _id: string;

  user: string | OrderUser;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  subtotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;

  estimatedDeliveryDate: string;

  orderStatus: OrderStatus;

  statusHistory: OrderStatusHistory[];

  paymentStatus: PaymentStatus;

  paymentMethod: PaymentMethod;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  cancelledAt?: string;
  deliveredAt?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination
 */
export interface OrderPagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
}

/**
 * GET ALL ORDERS response data
 */
export interface GetAllOrdersData {
  orders: Order[];
  pagination: OrderPagination;
}

/**
 * API response
 */
export interface OrderApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success?: boolean;
}

/**
 * Get orders query
 */
export interface GetOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: OrderStatus | "";
  paymentStatus?: PaymentStatus | "";
  sort?:
    | "newest"
    | "oldest"
    | "amount_low"
    | "amount_high";
}

/**
 * Update order status payload
 */
export interface UpdateOrderStatusPayload {
  status: OrderStatus;
  note?: string;
}