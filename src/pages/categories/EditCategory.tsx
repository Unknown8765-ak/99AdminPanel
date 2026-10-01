import {
  useEffect,
  useState,
} from "react";
import type { FormEvent } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

import {
  getCategoryByIdAPI,
  updateCategoryAPI,
} from "../../services/category.service";

const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) {
        setError("Invalid category ID");
        setLoading(false);
        return;
      }

      try {
        const response = await getCategoryByIdAPI(id);

        const category = response.data;

        setName(category.name);
        setSlug(category.slug);
        setDescription(category.description || "");
        setImage(category.image || "");
        setIsActive(category.isActive);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Failed to fetch category");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!id) return;

    try {
      setSaving(true);
      setError("");

      await updateCategoryAPI(id, {
        name,
        slug,
        description,
        image,
        isActive,
      });

      navigate("/admin/categories");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to update category");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-10 text-center">
        <p className="text-gray-500">
          Loading category...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/categories"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-blue-600 transition"
        >
          <FaArrowLeft />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Edit Category
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Update category information.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 max-w-2xl"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Category Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              required
              maxLength={100}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Slug
            </label>

            <input
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value)
              }
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              maxLength={500}
              rows={5}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Image URL
            </label>

            <input
              type="url"
              value={image}
              onChange={(event) =>
                setImage(event.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
            <div>
              <p className="font-medium text-slate-700">
                Category Status
              </p>

              <p className="text-sm text-gray-500">
                Enable or disable this category.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) =>
                  setIsActive(event.target.checked)
                }
                className="sr-only peer"
              />

              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-3">
            <Link
              to="/admin/categories"
              className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;