import { useEffect, useState } from "react";
import {
  FaEye,
  FaSearch,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import {
  getCustomersAPI,
  updateCustomerStatusAPI,
} from "../../services/customer.service";

import type {
  Customer,
} from "../../types/customer.types";

const Customers = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>(
    []
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<
    boolean | ""
  >("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCustomersAPI({
        page,
        limit,
        search,
        isActive: status,
      });

      setCustomers(response.data.customers);
      setTotalPages(
        response.data.pagination.totalPages
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setPage(1);
    fetchCustomers();
  };

  const handleStatusChange = async (
    customer: Customer
  ) => {
    try {
      await updateCustomerStatusAPI(
        customer._id,
        !customer.isActive
      );

      setCustomers((prev) =>
        prev.map((item) =>
          item._id === customer._id
            ? {
                ...item,
                isActive: !item.isActive,
              }
            : item
        )
      );
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Failed to update customer"
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Customers
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your customers and their accounts.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col md:flex-row gap-4">
          <form
            onSubmit={handleSearch}
            className="flex-1 flex gap-2"
          >
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name, email or phone..."
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <select
            value={
              status === ""
                ? ""
                : String(status)
            }
            onChange={(e) => {
              const value = e.target.value;

              if (value === "") {
                setStatus("");
              } else {
                setStatus(value === "true");
              }

              setPage(1);
            }}
            className="px-4 py-3 border border-gray-200 rounded-lg outline-none"
          >
            <option value="">
              All Customers
            </option>

            <option value="true">
              Active
            </option>

            <option value="false">
              Inactive
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No customers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Phone
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Orders
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Spent
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {customer.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {customer.phone || "—"}
                    </td>

                    {/* Orders */}
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-700">
                        {customer.totalOrders}
                      </span>
                    </td>

                    {/* Spent */}
                    <td className="px-6 py-4 font-medium">
                      ₹
                      {customer.totalSpent.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {customer.isActive ? (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/customers/${customer._id}`
                            )
                          }
                          title="View Customer"
                          className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(
                              customer
                            )
                          }
                          title={
                            customer.isActive
                              ? "Deactivate"
                              : "Activate"
                          }
                          className={`p-2 rounded-lg ${
                            customer.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-100"
                              : "bg-green-50 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {customer.isActive ? (
                            <FaUserTimes />
                          ) : (
                            <FaUserCheck />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading &&
        customers.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() =>
                  setPage((prev) => prev - 1)
                }
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Previous
              </button>

              <button
                disabled={page >= totalPages}
                onClick={() =>
                  setPage((prev) => prev + 1)
                }
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Customers;