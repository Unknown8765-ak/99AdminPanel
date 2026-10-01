import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import CategoryTable from "../../components/categories/CategoryTable";
import { getCategoriesAPI } from "../../services/category.service";
import type { Category } from "../../types/category.types";

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategoriesAPI();

      setCategories(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch categories");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Categories
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage product categories in your store.
          </p>
        </div>

        <Link
          to="/admin/categories/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
        >
          <FaPlus />
          Add Category
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <CategoryTable
        categories={categories}
        loading={loading}
        onRefresh={fetchCategories}
      />
    </div>
  );
};

export default Categories;
