
// Category returned from backend
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Data required when creating a category
export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

// Data allowed when updating a category
export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
}

// API response for category list
export interface CategoriesResponse {
  statusCode: number;
  data: Category[];
  message: string;
}

// API response for single category
export interface CategoryResponse {
  statusCode: number;
  data: Category;
  message: string;
}

// API response for delete category
export interface DeleteCategoryResponse {
  statusCode: number;
  data: null;
  message: string;
}
