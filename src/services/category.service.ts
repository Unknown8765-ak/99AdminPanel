import type {
  CategoriesResponse,
  CategoryResponse,
  CreateCategoryData,
  DeleteCategoryResponse,
  UpdateCategoryData,
} from "../types/category.types";

const API_URL = import.meta.env.VITE_API_URL as string;

// GET ALL CATEGORIES
export const getCategoriesAPI = async (): Promise<CategoriesResponse> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "GET",
    credentials: "include",
  });

  const data: CategoriesResponse = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to fetch categories");
  }

  return data;
};

// GET ACTIVE CATEGORIES
// Used mainly for product category dropdown
export const getActiveCategoriesAPI =
  async (): Promise<CategoriesResponse> => {
    const response = await fetch(`${API_URL}/categories/active`, {
      method: "GET",
    });

    const data: CategoriesResponse = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.message || "Failed to fetch active categories"
      );
    }

    return data;
  };

// GET CATEGORY BY ID
export const getCategoryByIdAPI = async (
  id: string
): Promise<CategoryResponse> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "GET",
    credentials: "include",
  });

  const data: CategoryResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to fetch category"
    );
  }

  return data;
};

// CREATE CATEGORY
export const createCategoryAPI = async (
  categoryData: CreateCategoryData
): Promise<CategoryResponse> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  const data: CategoryResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to create category"
    );
  }

  return data;
};

// UPDATE CATEGORY
export const updateCategoryAPI = async (
  id: string,
  categoryData: UpdateCategoryData
): Promise<CategoryResponse> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });

  const data: CategoryResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to update category"
    );
  }

  return data;
};

// DELETE CATEGORY
export const deleteCategoryAPI = async (
  id: string
): Promise<DeleteCategoryResponse> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data: DeleteCategoryResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.message || "Failed to deactivate category"
    );
  }

  return data;
};
