import React, { useEffect, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle, Loader } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchMyOrders, cancelOrder, clearOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const { myOrders, cancellingOrder } = useSelector((state) => state.order);
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  // Fetch on mount and refetch when filter changes
  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch, statusFilter]);

  // Refetch when user switches back to this tab
  useEffect(() => {
    const handleFocus = () => dispatch(fetchMyOrders());
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [dispatch]);

  // Clear stale orders when leaving the page
  useEffect(() => {
    return () => dispatch(clearOrders());
  }, [dispatch]);

  if (!authUser) return navigateTo("/products");

  const filterOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing": return <Package className="w-5 h-5 text-yellow-500" />;
      case "Shipped":    return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered":  return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":  return <XCircle className="w-5 h-5 text-red-500" />;
      default:           return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing": return "bg-yellow-500/20 text-yellow-400";
      case "Shipped":    return "bg-blue-500/20 text-blue-400";
      case "Delivered":  return "bg-green-500/20 text-green-400";
      case "Cancelled":  return "bg-red-500/20 text-red-400";
      default:           return "bg-gray-500/20 text-gray-400";
    }
  };

  const handleCancel = (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(orderId));
    }
  };

  const statusArray = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your order history.</p>
        </div>

        {/* STATUS FILTER */}
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

        {/* ORDERS LIST */}
        {filterOrders.length === 0 ? (
          <div className="text-center glass-panel max-w-md mx-auto p-12">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Orders Found</h2>
            <p className="text-muted-foreground">
              {statusFilter === "All"
                ? "You haven't placed any orders yet."
                : `No orders with status "${statusFilter}" found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filterOrders.map((order) => (
              <div key={order.id} className="glass-card p-6">
                {/* ORDER HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Order #{order.id}
                    </h3>
                    <p className="text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.order_status)}
                      <span className={`px-3 py-1 rounded text-sm font-medium capitalize ${getStatusColor(order.order_status)}`}>
                        {order.order_status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary">${order.total_price}</p>
                    </div>
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="space-y-4">
                  {order?.order_items?.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg"
                    >
                      <Link to={`/product/${item.product_id}`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded-lg hover:scale-105 transition"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product_id}`}>
                          <h4 className="font-medium text-foreground truncate hover:text-primary">
                            {item.title}
                          </h4>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ORDER ACTIONS */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[hsla(var(--glass-border))]">
                  <button
                    onClick={() => navigateTo(`/order/${order.id}`)}
                    className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                  >
                    View Details
                  </button>

                  {order.order_status === "Delivered" && (
                    <>
                      <button className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm">
                        Write Review
                      </button>
                      <button className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm">
                        Reorder
                      </button>
                    </>
                  )}

                  {order.order_status === "Processing" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingOrder}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg animate-smooth text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingOrder ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>Cancel Order</span>
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