
// Product category populated by backend
export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
}

// Product returned from API
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  images: string[];
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Data required when creating a product
export interface CreateProductData {
  name: string;
  slug: string;
  description: string;
  category: string;
  images: string[];
  price: number;
  stock: number;
  sku: string;
}

// Data allowed when updating a product
export interface UpdateProductData {
  name?: string;
  slug?: string;
  description?: string;
  category?: string;
  images?: string[];
  price?: number;
  stock?: number;
  sku?: string;
  isActive?: boolean;
}

// Pagination returned by backend
export interface ProductPagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
}

// GET /products response data
export interface ProductsData {
  products: Product[];
  pagination: ProductPagination;
}

// Generic API response
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success?: boolean;
}

// GET /products query parameters
export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: string;
}