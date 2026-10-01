import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import type { Product } from "../../types/product.types";
import { getProductByIdAPI } from "../../services/product.service";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError("");

        const response = await getProductByIdAPI(id);

        console.log("PRODUCT DETAILS 👉", response);

        setProduct(response.data);
      } catch (error) {
        console.error("GET PRODUCT ERROR ❌", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <FaArrowLeft />
          Back to Products
        </Link>

        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500">
        Product not found.
      </div>
    );
  }

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
            Product Details
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            View product information.
          </p>
        </div>

      </div>

      {/* Product */}
      <div className="bg-white rounded-xl shadow-sm p-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Image */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>
          </div>

          {/* Information */}
          <div className="space-y-5">

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                {product.name}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                SKU: {product.sku || "N/A"}
              </p>
            </div>

            {/* Price */}
            <div>
              <p className="text-sm text-gray-500">
                Price
              </p>

              <p className="text-2xl font-bold text-blue-600">
                ₹{product.price}
              </p>
            </div>

            {/* Stock */}
            <div>
              <p className="text-sm text-gray-500">
                Stock
              </p>

              <p className="text-lg font-semibold text-slate-800">
                {product.stock} units
              </p>
            </div>

            {/* Category */}
            <div>
              <p className="text-sm text-gray-500">
                Category
              </p>

              <p className="text-lg font-medium text-slate-800">
                {typeof product.category === "object"
                  ? product.category.name
                  : product.category}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Status
              </p>

              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  product.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span>
            </div>

          </div>

        </div>

        {/* Description */}
        <div className="border-t mt-8 pt-6">

          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Description
          </h3>

          <p className="text-gray-600 leading-7">
            {product.description}
          </p>

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;