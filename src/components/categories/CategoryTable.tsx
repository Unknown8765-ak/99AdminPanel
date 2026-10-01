import { Link } from "react-router-dom";
import {
  FaEdit,
  FaPowerOff,
} from "react-icons/fa";

import { deleteCategoryAPI } from "../../services/category.service";
import type { Category } from "../../types/category.types";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
}

const CategoryTable = ({
  categories,
  loading,
  onRefresh,
}: CategoryTableProps) => {
  const handleDeactivate = async (category: Category) => {
    const confirmed = window.confirm(
      `Are you sure you want to deactivate "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteCategoryAPI(category._id);

      onRefresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        window.alert(error.message);
      } else {
        window.alert("Failed to deactivate category");
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center">
        <p className="text-gray-500">
          Loading categories...
        </p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center">
        <p className="text-gray-500">
          No categories found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Category
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Slug
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Description
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Status
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category._id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                {/* Category */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                        IMG
                      </div>
                    )}

                    <div>
                      <p className="font-medium text-slate-800">
                        {category.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        ID: {category._id}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="px-6 py-4 text-sm text-gray-600">
                  {category.slug}
                </td>

                {/* Description */}
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                  <p className="truncate">
                    {category.description || "No description"}
                  </p>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  {category.isActive ? (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      Inactive
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <Link
                      to={`/admin/categories/edit/${category._id}`}
                      className="text-blue-600 hover:text-blue-800 transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </Link>

                    {category.isActive && (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeactivate(category)
                        }
                        className="text-red-600 hover:text-red-800 transition"
                        title="Deactivate"
                      >
                        <FaPowerOff />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;