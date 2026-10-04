import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  MapPin,
  User,
  CreditCard,
  Truck,
} from "lucide-react";

import {
  getAdminOrderByIdAPI,
  updateOrderStatusAPI,
  getAllExchangeRequests,
  updateExchangeStatus,
} from "../../services/order.service";

import type {
  Order,
  OrderStatus,
} from "../../types/order.types";

const statusOptions: {
  label: string;
  value: OrderStatus;
}[] = [
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Confirmed",
    value: "confirmed",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Shipped",
    value: "shipped",
  },
  {
    label: "Out for Delivery",
    value: "out_for_delivery",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
  {
    label: "Returned",
    value: "returned",
  },
];
const exchangeStatusOptions: {
  label: string;
  value: any;
}[] = [
  {
    label: "Requested",
    value: "requested",
  },
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
  {
    label: "Pickup Pending",
    value: "pickup_pending",
  },
  {
    label: "Picked Up",
    value: "picked_up",
  },
  {
    label: "Replacement Shipped",
    value: "replacement_shipped",
  },
  {
    label: "Completed",
    value: "completed",
  },
];
const formatStatus = (status: string) => {
  return status
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const formatDate = (date?: string) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

const OrderDetails = () => {
  const { orderId } = useParams<{
    orderId: string;
  }>();
  console.log("OrderDetails orderID",orderId)
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>("pending");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [exchangeRequests, setExchangeRequests] =
  useState<any[]>([]);
  const [, setExchangeLoading] =useState(false);
  const [exchangeUpdating, setExchangeUpdating] =useState(false);
  const [exchangeSuccess, setExchangeSuccess] =useState("");
  const [exchangeError, setExchangeError] =useState("");
  const [exchangeNotes, setExchangeNotes] =useState<Record<string, string>>({});
  const [exchangeRejectedReasons, setExchangeRejectedReasons] =useState<Record<string, string>>({});

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setError("Invalid order ID hai");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response =
        await getAdminOrderByIdAPI(orderId);

      setOrder(response.data);
      setSelectedStatus(response.data.orderStatus);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch order";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [orderId]);
  const fetchExchangeRequest = useCallback(async () => {
  if (!orderId) return;

  try {
    setExchangeLoading(true);

    const result = await getAllExchangeRequests();

    console.log("All exchange requests:", result);
    const exchanges = result?.data || [];
    const currentExchanges = exchanges.filter(
      (exchange: any) => {
        const exchangeOrderId =
          typeof exchange.order === "object"
            ? exchange.order?._id
            : exchange.order;
        return exchangeOrderId === orderId;
      }
    );

    console.log(
      "Current order exchange requests:",
      currentExchanges
    );

    setExchangeRequests(currentExchanges);
  } catch (error) {
    console.error(
      "Failed to fetch exchange requests:",
      error
    );

    setExchangeRequests([]);
  } finally {
    setExchangeLoading(false);
  }
}, [orderId]);

  useEffect(() => {
  fetchOrder();
  fetchExchangeRequest();
}, [fetchOrder, fetchExchangeRequest]);

  const handleStatusUpdate = async () => {
    if (!orderId || !order) return;

    if (selectedStatus === order.orderStatus) {
      setError(
        "Please select a different order status."
      );
      return;
    }

    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const response =
        await updateOrderStatusAPI(orderId, {
          status: selectedStatus,
          note: note.trim() || undefined,
        });

      setOrder(response.data);
      setNote("");
      setSuccess(
        "Order status updated successfully."
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to update order";

      setError(message);
    } finally {
      setUpdating(false);
    }
  };
  const handleExchangeStatusUpdate = async (
  exchangeId: string,
  status: any,
  adminNote?: string,
  rejectedReason?: string
) => {
  try {
    setExchangeUpdating(true);
    setExchangeError("");
    setExchangeSuccess("");

    await updateExchangeStatus(exchangeId, {
      status,
      adminNote: adminNote?.trim() || undefined,
      rejectedReason:
        rejectedReason?.trim() || undefined,
    });

    setExchangeSuccess(
      "Exchange status updated successfully."
    );

    // Updated exchange data dobara fetch karenge
    await fetchExchangeRequest();
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update exchange status";

    setExchangeError(message);
  } finally {
    setExchangeUpdating(false);
  }
};

  if (loading) {
    return (
      <div className="flex min-h-125 items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">
          Loading order...
        </p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-full bg-gray-50 p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
          {error}
        </div>

        <button
          onClick={() => navigate("/admin/orders")}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const customer =
    typeof order.user === "object"
      ? order.user
      : null;

  return (
    <div className="min-h-full bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="rounded-lg border border-gray-200 bg-white p-2 text-gray-600 transition hover:bg-gray-50"
          >
            <ArrowLeft size={20} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Order Details
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Order #{order._id}
            </p>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-3 py-1.5 text-sm font-medium ${getStatusClasses(
            order.orderStatus
          )}`}
        >
          {formatStatus(order.orderStatus)}
        </span>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        {/* Left */}
        <div className="space-y-6 xl:col-span-2">
          {/* Products */}
          <div className="rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <Package
                size={19}
                className="text-blue-600"
              />

              <h2 className="font-semibold text-slate-800">
                Order Items
              </h2>
            </div>

            <div className="divide-y">
              {order.items.map((item, index) => (
                <div
                  key={`${order._id}-${index}`}
                  className="flex gap-4 px-5 py-4"
                >
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-slate-800">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      SKU: {item.sku}
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                      ₹
                      {item.price.toLocaleString(
                        "en-IN"
                      )}{" "}
                      × {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      ₹
                      {item.subtotal.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div className="rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <MapPin
                size={19}
                className="text-blue-600"
              />

              <h2 className="font-semibold text-slate-800">
                Shipping Address
              </h2>
            </div>

            <div className="px-5 py-5">
              <p className="font-semibold text-slate-800">
                {order.shippingAddress.fullName}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {order.shippingAddress.addressLine1}
              </p>

              {order.shippingAddress.addressLine2 && (
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.addressLine2}
                </p>
              )}

              <p className="text-sm text-gray-600">
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.state} -{" "}
                {order.shippingAddress.postalCode}
              </p>

              <p className="mt-2 text-sm text-gray-600">
                {order.shippingAddress.country}
              </p>

              <p className="mt-2 text-sm font-medium text-gray-700">
                Phone: {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Status History */}
          <div className="rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b px-5 py-4">
              <Truck
                size={19}
                className="text-blue-600"
              />

              <h2 className="font-semibold text-slate-800">
                Order Timeline
              </h2>
            </div>

            <div className="px-5 py-5">
              <div className="space-y-5">
                {[...order.statusHistory]
                  .reverse()
                  .map((history, index) => (
                    <div
                      key={`${history.status}-${history.timestamp}-${index}`}
                      className="relative flex gap-4"
                    >
                      <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-blue-600" />

                      <div>
                        <p className="font-medium text-slate-800">
                          {formatStatus(
                            history.status
                          )}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          {formatDate(
                            history.timestamp
                          )}
                        </p>

                        {history.note && (
                          <p className="mt-1 text-sm text-gray-500">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {exchangeRequests.length > 0 && (
  <div className="rounded-xl bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h2 className="font-semibold text-slate-800">
          Exchange Requests
        </h2>

        <p className="mt-1 text-xs text-gray-400">
          {exchangeRequests.length} exchange request
          {exchangeRequests.length > 1 ? "s" : ""}
        </p>
      </div>
    </div>

    <div className="space-y-4">
          {exchangeError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {exchangeError}
                </div>
          )}

          {exchangeSuccess && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
              {exchangeSuccess}
            </div>
          )}
            
          {exchangeRequests.map((exchange: any) => (
                  <div
                    key={exchange._id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400">
                          Exchange ID
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {exchange._id}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                            {formatStatus(exchange.status)}
                          </span>

                          <select
                            value={exchange.status}
                            disabled={exchangeUpdating}
                            onChange={(e) =>
                              handleExchangeStatusUpdate(
                                exchange._id,
                                e.target.value as any
                              )
                            }
                            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                          
                            {exchangeStatusOptions.map((option) => (
                              <option
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                    </div>

                    {/* Product */}
                    <div className="mt-4 rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">
                        Product
                      </p>

                      <p className="mt-1 font-medium text-slate-800">
                        {typeof exchange.product === "object"
                          ? exchange.product?.name
                          : exchange.product}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        <span>
                          Quantity: {exchange.quantity}
                        </span>

                        <span>
                          Reason:{" "}
                          {formatStatus(exchange.reason)}
                        </span>
                      </div>
                    </div>

                    {/* Requested Date */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-400">
                        Requested On
                      </p>

                      <p className="mt-1 text-sm text-slate-700">
                        {formatDate(exchange.createdAt)}
                      </p>
                    </div>

                    {/* Admin Note */}
                    {exchange.adminNote && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-400">
                          Admin Note
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          {exchange.adminNote}
                        </p>
                      </div>
                    )}

                    {/* Rejected Reason */}
                    {exchange.rejectedReason && (
                      <div className="mt-3 rounded-lg bg-red-50 p-3">
                        <p className="text-xs font-medium text-red-500">
                          Rejected Reason
                        </p>

                        <p className="mt-1 text-sm text-red-600">
                          {exchange.rejectedReason}
                        </p>
                      </div>
                    )}

                    <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">
                    Admin Note
                  </label>

              <textarea
                  value={exchangeNotes[exchange._id] ?? exchange.adminNote ?? ""}
                  onChange={(e) => {
                    setExchangeNotes((prev) => ({
                      ...prev,
                      [exchange._id]: e.target.value,
                    }));
                  }}
                  placeholder="Add admin note..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

            {exchange.status === "rejected" && (
              <div>
                <label className="mb-1 block text-xs font-medium text-red-500">
                  Rejected Reason
                </label>

                <textarea
                  value={
                    exchangeRejectedReasons[exchange._id] ??
                    exchange.rejectedReason ??
                    ""
                  }
                  onChange={(e) => {
                    setExchangeRejectedReasons((prev) => ({
                      ...prev,
                      [exchange._id]: e.target.value,
                    }));
                  }}
                  placeholder="Enter rejected reason..."
                  rows={2}
                  className="w-full resize-none rounded-lg border border-red-200 px-3 py-2 text-sm outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                />
                    </div>
                    )}
                    </div>
                    <button
                        onClick={() =>
                          handleExchangeStatusUpdate(
                            exchange._id,
                            exchange.status as any,
                            exchangeNotes[exchange._id] ??
                              exchange.adminNote ??
                              "",
                            exchangeRejectedReasons[exchange._id] ??
                              exchange.rejectedReason ??
                              ""
                          )
                        }
          disabled={exchangeUpdating}
          className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {exchangeUpdating
            ? "Updating Exchange..."
            : "Update Exchange"}
        </button>
                  </div>
              ))}
              
            </div>
          </div>
        )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Customer */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <User
                size={19}
                className="text-blue-600"
              />

              <h2 className="font-semibold text-slate-800">
                Customer
              </h2>
            </div>

            <p className="font-medium text-slate-800">
              {customer?.name ||
                order.shippingAddress.fullName}
            </p>

            {customer?.email && (
              <p className="mt-1 text-sm text-gray-500">
                {customer.email}
              </p>
            )}

            {customer?.phone && (
              <p className="mt-1 text-sm text-gray-500">
                {customer.phone}
              </p>
            )}
          </div>

          {/* Payment */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard
                size={19}
                className="text-blue-600"
              />

              <h2 className="font-semibold text-slate-800">
                Payment
              </h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Method
                </span>

                <span className="font-medium uppercase text-slate-700">
                  {order.paymentMethod}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Status
                </span>

                <span className="font-medium text-slate-700">
                  {formatStatus(
                    order.paymentStatus
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Subtotal
                </span>

                <span className="text-slate-700">
                  ₹
                  {order.subtotal.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Delivery
                </span>

                <span className="text-slate-700">
                  {order.deliveryCharge === 0
                    ? "FREE"
                    : `₹${order.deliveryCharge.toLocaleString(
                        "en-IN"
                      )}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Discount
                </span>

                <span className="text-green-600">
                  -₹
                  {order.discount.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800">
                    Total
                  </span>

                  <span className="text-lg font-bold text-blue-600">
                    ₹
                    {order.totalAmount.toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 font-semibold text-slate-800">
              Update Order Status
            </h2>

            <div className="space-y-3">
              <select
                value={selectedStatus}
                onChange={(e) =>
                  setSelectedStatus(
                    e.target.value as OrderStatus
                  )
                }
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              <textarea
                value={note}
                onChange={(e) =>
                  setNote(e.target.value)
                }
                placeholder="Optional note..."
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <button
                onClick={handleStatusUpdate}
                disabled={
                  updating ||
                  selectedStatus ===
                    order.orderStatus
                }
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating
                  ? "Updating..."
                  : "Update Status"}
              </button>
            </div>
          </div>

          {/* Delivery */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-semibold text-slate-800">
              Delivery
            </h2>

            <p className="text-sm text-gray-500">
              Estimated Delivery
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {formatDate(
                order.estimatedDeliveryDate
              )}
            </p>

            {order.deliveredAt && (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Delivered At
                </p>

                <p className="mt-1 font-medium text-green-600">
                  {formatDate(order.deliveredAt)}
                </p>
              </div>
            )}

            {order.cancelledAt && (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Cancelled At
                </p>

                <p className="mt-1 font-medium text-red-600">
                  {formatDate(order.cancelledAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;