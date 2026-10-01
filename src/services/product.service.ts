import type {
  ApiResponse,
  CreateProductData,
  GetProductsParams,
  Product,
  ProductsData,
  UpdateProductData,
} from "../types/product.types";

const API_URL = import.meta.env.VITE_API_URL as string;

// GET ALL PRODUCTS
export const getProductsAPI = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  isActive = "",
}: GetProductsParams = {}): Promise<ApiResponse<ProductsData>> => {
  const params = new URLSearchParams();

  params.append("page", String(page));
  params.append("limit", String(limit));

  if (search) {
    params.append("search", search);
  }

  if (category) {
    params.append("category", category);
  }

  if (isActive !== "") {
    params.append("isActive", isActive);
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const data: ApiResponse<ProductsData> = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch products");
  }

  return data;
};

export const getProductByIdAPI = async (
  id: string
): Promise<ApiResponse<Product>> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data: ApiResponse<Product> = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch product");
  }
 
  return data;
};

export const createProductAPI = async (
  productData: CreateProductData
): Promise<ApiResponse<Product>> => {
  const response = await fetch(`${API_URL}/products`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data: ApiResponse<Product> = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to create product");
  }

  return data;
};

// UPDATE PRODUCT
export const updateProductAPI = async (
  id: string,
  productData: UpdateProductData
): Promise<ApiResponse<Product>> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  const data: ApiResponse<Product> = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update product");
  }

  return data;
};

// DELETE PRODUCT
export const deleteProductAPI = async (
  id: string
): Promise<ApiResponse<null>> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data: ApiResponse<null> = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to delete product");
  }

  return data;
};