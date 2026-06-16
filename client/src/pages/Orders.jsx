import React, { useEffect, useMemo, useState } from "react";
import {
  Filter,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Loader
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchMyOrders,
  cancelOrder,
  clearOrders
} from "../store/slices/orderSlice";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");

  const { myOrders = [], cancellingOrder } = useSelector(
    (state) => state.order
  );

  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Redirect properly
  useEffect(() => {
    if (!authUser) {
      navigate("/products");
    }
  }, [authUser, navigate]);

  // ✅ Fetch only once + when user changes
  useEffect(() => {
    if (authUser) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, authUser]);

  // Refetch on focus
  useEffect(() => {
    const handleFocus = () => {
      if (authUser) dispatch(fetchMyOrders());
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [dispatch, authUser]);

  // Clear on unmount
  useEffect(() => {
    return () => dispatch(clearOrders());
  }, [dispatch]);

  // ✅ Filter optimized (no re-computation bugs)
  const filterOrders = useMemo(() => {
    return myOrders.filter(
      (order) =>
        statusFilter === "All" || order.order_status === statusFilter
    );
  }, [myOrders, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "Shipped":
        return "bg-blue-500/20 text-blue-400";
      case "Delivered":
        return "bg-green-500/20 text-green-400";
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleCancel = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(orderId));
    }
  };

  const statusArray = [
    "All",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Orders
          </h1>
          <p className="text-muted-foreground">
            Track and manage your order history.
          </p>
        </div>

        {/* FILTER */}
        <div className="glass-card p-4 mb-8">
          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span className="font-medium">Filter by status:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusArray.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    statusFilter === status
                      ? "gradient-primary text-primary-foreground"
                      : "glass-card hover:glow-on-hover text-foreground"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ORDERS */}
        {filterOrders.length === 0 ? (
          <div className="text-center glass-panel max-w-md mx-auto p-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2>No Orders Found</h2>
          </div>
        ) : (
          <div className="space-y-6">
            {filterOrders.map((order) => (
              <div key={order.id} className="glass-card p-6">
                {/* HEADER */}
                <div className="flex justify-between mb-6">
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p>
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.order_status)}
                    <span
                      className={`px-3 py-1 rounded ${getStatusColor(
                        order.order_status
                      )}`}
                    >
                      {order.order_status}
                    </span>

                    <p className="font-bold text-primary">
                      ${order.total_price}
                    </p>
                  </div>
                </div>

                {/* ITEMS */}
                {order?.order_items?.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg"
                  >
                    <Link to={`/product/${item.product_id}`}>
                      <img
                        src={item.image}
                        className="w-16 h-16 rounded"
                      />
                    </Link>

                    <div className="flex-1">
                      <h4>{item.title}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>

                    <p>${item.price}</p>
                  </div>
                ))}

                {/* ACTIONS */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => navigate(`/order/${order.id}`)}
                  >
                    View Details
                  </button>

                  {order.order_status === "Processing" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingOrder}
                      className="text-red-500"
                    >
                      {cancellingOrder ? (
                        <Loader className="animate-spin" />
                      ) : (
                        "Cancel"
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;