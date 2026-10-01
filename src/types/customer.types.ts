export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "customer";
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  totalOrders: number;
  totalSpent: number;
}

export interface CustomerPagination {
  currentPage: number;
  totalPages: number;
  totalCustomers: number;
  limit: number;
}

export interface GetCustomersResponse {
  statusCode: number;
  data: {
    customers: Customer[];
    pagination: CustomerPagination;
  };
  message: string;
  success: boolean;
}

export interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
}

export interface RecentOrder {
  _id: string;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
}

export interface CustomerDetailsResponse {
  statusCode: number;
  data: {
    customer: Customer;
    stats: CustomerStats;
    recentOrders: RecentOrder[];
  };
  message: string;
  success: boolean;
}