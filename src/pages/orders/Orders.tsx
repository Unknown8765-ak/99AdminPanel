import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
} from "lucide-react";

import {
  getAllOrdersAPI,
} from "../../services/order.service";

import type {
  GetOrdersParams,
  Order,
  OrderStatus,
  PaymentStatus,
} from "../../types/order.types";

const orderStatuses: {
  label: string;
  value: OrderStatus | "";
}[] = [
  { label: "All Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  {
    label: "Out for Delivery",
    value: "out_for_delivery",
  },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

const paymentStatuses: {
  label: string;
  value: PaymentStatus | "";
}[] = [
  { label: "All Payment", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

const getStatusClasses = (status: OrderStatus) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "confirmed":
      return "bg-blue-100 text-blue-700";

    case "processing":
      return "bg-indigo-100 text-indigo-700";

    case "shipped":
      return "bg-purple-100 text-purple-700";

    case "out_for_delivery":
      return "bg-orange-100 text-orange-700";

    case "delivered":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    case "returned":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPaymentClasses = (status: PaymentStatus) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700";

    case "failed":
      return "bg-red-100 text-red-700";

    case "refunded":
      return "bg-purple-100 text-purple-700";

    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [orderStatus, setOrderStatus] =
    useState<OrderStatus | "">("");

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatus | "">("");

  const [sort, setSort] =
    useState<GetOrdersParams["sort"]>("newest");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    limit: 10,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrdersAPI({
        page,
        limit: 10,
        search,
        orderStatus,
        paymentStatus,
        sort,
      });

      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch orders";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    orderStatus,
    paymentStatus,
    sort,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusChange = (
    value: OrderStatus | ""
  ) => {
    setOrderStatus(value);
    setPage(1);
  };

  const handlePaymentChange = (
    value: PaymentStatus | ""
  ) => {
    setPaymentStatus(value);
    setPage(1);
  };

  const handleSortChange = (
    value: GetOrdersParams["sort"]
  ) => {
    setSort(value);
    setPage(1);
  };

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and track customer orders
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm">
          <Package size={20} className="text-blue-600" />

          <span className="text-sm font-medium text-gray-600">
            Total Orders:
          </span>

          <span className="font-bold text-slate-800">
            {pagination.totalOrders}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex flex-1"
          >
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
                placeholder="Search order ID, customer, phone..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              className="ml-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          {/* Order status */}
          <select
            value={orderStatus}
            onChange={(e) =>
              handleStatusChange(
                e.target.value as OrderStatus | ""
              )
            }
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            {orderStatuses.map((status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            ))}
          </select>

          {/* Payment status */}
          <select
            value={paymentStatus}
            onChange={(e) =>
              handlePaymentChange(
                e.target.value as PaymentStatus | ""
              )
            }
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            {paymentStatuses.map((status) => (
              <option
                key={status.value}
                value={status.value}
              >
                {status.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) =>
              handleSortChange(
                e.target.value as GetOrdersParams["sort"]
              )
            }
            className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="amount_low">
              Amount: Low to High
            </option>
            <option value="amount_high">
              Amount: High to Low
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-237.5">
            <thead>
              <tr className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
                <th className="px-5 py-4">
                  Order
                </th>

                <th className="px-5 py-4">
                  Customer
                </th>

                <th className="px-5 py-4">
                  Items
                </th>

                <th className="px-5 py-4">
                  Amount
                </th>

                <th className="px-5 py-4">
                  Payment
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Date
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-sm text-gray-500"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center"
                  >
                    <Package
                      size={42}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="font-medium text-gray-600">
                      No orders found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                      Try changing your filters or search.
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const customer =
                    typeof order.user === "object"
                      ? order.user
                      : null;

                  return (
                    <tr
                      key={order._id}
                      className="transition hover:bg-gray-50"
                    >
                      {/* Order */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {order.items.length} item
                          {order.items.length !== 1
                            ? "s"
                            : ""}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-700">
                          {customer?.name ||
                            order.shippingAddress.fullName}
                        </p>

                        {customer?.email && (
                          <p className="mt-1 text-xs text-gray-400">
                            {customer.email}
                          </p>
                        )}
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4">
                        <div className="flex -space-x-2">
                          {order.items
                            .slice(0, 3)
                            .map((item, index) => (
                              <div
                                key={`${order._id}-${index}`}
                                className="h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-gray-100"
                              >
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                                    N/A
                                  </div>
                                )}
                              </div>
                            ))}

                          {order.items.length > 3 && (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-100 text-xs font-medium text-gray-500">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-800">
                          ₹
                          {order.totalAmount.toLocaleString(
                            "en-IN"
                          )}
                        </p>
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPaymentClasses(
                            order.paymentStatus
                          )}`}
                        >
                          {formatStatus(
                            order.paymentStatus
                          )}
                        </span>

                        <p className="mt-1 text-xs text-gray-400 uppercase">
                          {order.paymentMethod}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            order.orderStatus
                          )}`}
                        >
                          {formatStatus(
                            order.orderStatus
                          )}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading &&
          orders.length > 0 && (
            <div className="flex items-center justify-between border-t px-5 py-4">
              <p className="text-sm text-gray-500">
                Page{" "}
                <span className="font-medium text-gray-700">
                  {pagination.currentPage}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-700">
                  {pagination.totalPages}
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
                    page >= pagination.totalPages
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
      </div>
    </div>
  );
};

export default Orders;
