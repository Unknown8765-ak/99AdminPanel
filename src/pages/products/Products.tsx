import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ProductTable from "../../components/products/ProductTable";

import type {
  ApiResponse,
  Product,
  ProductsData,
} from "../../types/product.types";

const API_URL = import.meta.env.VITE_API_URL as string;

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState<string>("");


  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

       params.append("page", page.toString());
        params.append("limit", "10");

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await fetch(
        `${API_URL}/products?${params.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );


      if (response.status === 401) {
        window.location.href = "/admin/login";
        return;
      }

      const contentType = response.headers.get("content-type");

      if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("NON JSON RESPONSE ❌", text);

        throw new Error(
          `Server returned non-JSON response (${response.status})`
        );
      }

      const data: ApiResponse<ProductsData> =
        await response.json();

      console.log("PRODUCT API RESPONSE 👉", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch products"
        );
      }

      if (data.data?.products) {
        setProducts(data.data.products);
        setTotalPages(data.data.pagination.totalPages);
      } else {
        setProducts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("FETCH PRODUCTS ERROR ❌", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => { 
    const confirmed = window.confirm( "Are you sure you want to delete this product?");    
    if (!confirmed) {
       return;
       } try { 
        setError(""); 
        
        const response = await fetch( `${API_URL}/products/${id}`, {
          method: "DELETE", credentials: "include", 
          });

    if (response.status === 401) { 
      window.location.href = "/admin/login";
       return;

       } 
       const contentType = response.headers.get("content-type"); 

      if (!contentType?.includes("application/json")) { 
        const text = await response.text(); 
        console.error("NON JSON RESPONSE ❌", text); 
        throw new Error( `Server returned non-JSON response (${response.status})` ); 
  } 
      const data: ApiResponse<null> = await response.json(); 

      console.log("DELETE PRODUCT RESPONSE 👉", data);
      if (!response.ok) { 
        throw new Error( data.message || "Failed to delete product" );
      }
      setProducts((prevProducts) => prevProducts.filter( (product) => product._id !== id ));        
        alert("Product deleted successfully"); 
      } catch (error) { 
        console.error("DELETE PRODUCT ERROR ❌", error);
        setError( error instanceof Error ? error.message : "Failed to delete product" ); 
        } };

        useEffect(() => {
          fetchProducts();
        }, [page]);

  return (
    <div className="space-y-6">


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Products
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage all products in your store.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
        >
          <FaPlus />
          Add Product
        </Link>
      </div>


      <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchProducts();
              }
            }}
            placeholder="Search products..."
            className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>


      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

{loading ? (
  <div className="bg-white rounded-xl shadow-sm p-10 text-center">
    <div className="animate-spin mx-auto h-10 w-10 rounded-full border-4 border-gray-200 border-t-blue-600" />

    <p className="mt-4 text-gray-500">
      Loading products...
    </p>
  </div>
) : (
  <>
    <ProductTable
      products={products}
      onDelete={deleteProduct}
    />

    {/* Pagination */}
    {!loading &&
      products.length > 0 &&
      (
        <div className="flex items-center justify-between border-t px-5 py-4">

          <p className="text-sm text-gray-500">
            Page{" "}
            <span className="font-medium text-gray-700">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-700">
              {totalPages}
            </span>
          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={page <= 1}
              onClick={() =>
                setPage((prev) => prev - 1)
              }
              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage((prev) => prev + 1)
              }
              className="rounded-lg border border-gray-200 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>

          </div>
        </div>
      )}
  </>
)}

    </div>
  );
};

export default Products;