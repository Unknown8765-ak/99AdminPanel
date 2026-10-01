import { useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaEnvelope,
  FaPhone,
  FaShoppingBag,
  FaRupeeSign,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { getCustomerByIdAPI } from "../../services/customer.service";

import type {
  CustomerDetailsResponse,
} from "../../types/customer.types";

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] =
    useState<CustomerDetailsResponse["data"] | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        setLoading(true);

        const response =
          await getCustomerByIdAPI(id);

        setData(response.data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch customer"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading customer...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { customer, stats, recentOrders } =
    data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() =>
            navigate("/admin/customers")
          }
          className="p-2 rounded-lg border hover:bg-gray-50"
        >
          <FaArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Customer Details
          </h1>

          <p className="text-sm text-gray-500">
            View customer information and orders.
          </p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {customer.name}
            </h2>

            <div className="mt-3 space-y-2 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <FaEnvelope />
                {customer.email}
              </p>

              <p className="flex items-center gap-2">
                <FaPhone />
                {customer.phone || "No phone number"}
              </p>
            </div>
          </div>

          <div>
            {customer.isActive ? (
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                Active
              </span>
            ) : (
              <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                Inactive
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <FaShoppingBag />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <h3 className="text-2xl font-bold text-slate-800">
                {stats.totalOrders}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <FaRupeeSign />
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Total Spent
              </p>

              <h3 className="text-2xl font-bold text-slate-800">
                ₹
                {stats.totalSpent.toLocaleString(
                  "en-IN"
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-bold text-slate-800">
            Recent Orders
          </h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            This customer has no orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm">
                    Order ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm">
                    Amount
                  </th>

                  <th className="text-left px-6 py-4 text-sm">
                    Payment
                  </th>

                  <th className="text-left px-6 py-4 text-sm">
                    Status
                  </th>

                  <th className="text-left px-6 py-4 text-sm">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      #{order._id.slice(-8)}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium">
                      ₹
                      {order.totalAmount.toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {order.paymentMethod}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        {order.orderStatus.replace(
                          /_/g,
                          " "
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;