import { FaEdit, FaTrash } from "react-icons/fa";
import type { Product } from "../../types/product.types";
import { useNavigate, Link } from "react-router-dom";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
}

const ProductTable = ({ products, onDelete }: ProductTableProps) => {
  const navigate = useNavigate()
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Product
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Category
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Price
              </th>

              <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700">
                Stock
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
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
               
                <tr
                    key={product._id}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition cursor-pointer"
                  >
                  {/* Product */}

                  <td className="px-6 py-4"
                    key={product._id}
                    onClick={() => navigate(`/admin/products/${product._id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center text-gray-400">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          "IMG"
                        )}
                      </div>

                      <div>
                        <p className="font-medium text-slate-800">
                          {product.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          ID: #{product._id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {typeof product.category === "object"
                      ? product.category.name
                      : product.category}
                  </td>

                  {/* Price */}

                  <td className="px-6 py-4 text-sm font-medium text-slate-800">
                    ₹{product.price}
                  </td>

                  {/* Stock */}

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.stock}
                  </td>

                  {/* Status */}

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                      
                        to={`edit/${product._id}`}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>

                      <button
                        onClick={() => onDelete(product._id)}
                        type="button"
                        className="text-red-600 hover:text-red-800 transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
               
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;