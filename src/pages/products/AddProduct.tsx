import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import type { CreateProductData } from "../../types/product.types";

import { createProductAPI } from "../../services/product.service";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string;
}

const AddProduct = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>();

  const onSubmit: SubmitHandler<ProductFormData> = async (data) => {
    try {
      setLoading(true);
      setError("");

      const productData: CreateProductData = {
          name: data.name,
          description: data.description,
          price: Number(data.price),
          stock: Number(data.stock),
          category: data.category,
          images: data.images
            .split(",")
            .map((image) => image.trim())
            .filter(Boolean),
          slug: data.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
          sku: `SKU-${Date.now()}`,
        };

      console.log("CREATE PRODUCT DATA 👉", productData);

      const response = await createProductAPI(productData);

      console.log("CREATE PRODUCT RESPONSE 👉", response);

      alert("Product created successfully!");

      navigate("/admin/products");
    } catch (error) {
      console.error("CREATE PRODUCT ERROR ❌", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center gap-4">
        <Link
          to="/admin/products"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm text-gray-600 hover:text-blue-600 transition"
        >
          <FaArrowLeft />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Add Product
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Add a new product to your store.
          </p>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Product Name */}

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              {...register("name", {
                required: "Product name is required",
              })}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Description */}

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Enter product description"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              {...register("description", {
                required: "Description is required",
              })}
            />

            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Price + Stock */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Price */}

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                placeholder="Enter price"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                {...register("price", {
                  required: "Price is required",
                  min: {
                    value: 0,
                    message: "Price cannot be negative",
                  },
                  valueAsNumber: true,
                })}
              />

              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Stock */}

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Stock
              </label>

              <input
                type="number"
                placeholder="Enter stock quantity"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                {...register("stock", {
                  required: "Stock is required",
                  min: {
                    value: 0,
                    message: "Stock cannot be negative",
                  },
                  valueAsNumber: true,
                })}
              />

              {errors.stock && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Category */}

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Category
            </label>

            <input
              type="text"
              placeholder="Enter category ID"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              {...register("category", {
                required: "Category is required",
              })}
            />

            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Images */}

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Product Images
            </label>

            <input
              type="text"
              placeholder="Paste image URLs separated by commas"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              {...register("images", {
                required: "At least one image is required",
              })}
            />

            <p className="text-xs text-gray-500 mt-1">
              Example: https://image1.jpg, https://image2.jpg
            </p>

            {errors.images && (
              <p className="text-red-500 text-sm mt-1">
                {errors.images.message}
              </p>
            )}
          </div>

          {/* Buttons */}

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Link
              to="/admin/products"
              className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;

