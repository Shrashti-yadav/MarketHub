import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Package, Truck, CheckCircle, XCircle,
  MapPin, Phone, User, Loader,
} from "lucide-react";
import { cancelOrder } from "../store/slices/orderSlice";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { myOrders, cancellingOrder } = useSelector((state) => state.order);

  const order = myOrders.find((item) => item.id.toString() === orderId);

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

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(order.id));
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-card p-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
          <Link
            to="/orders"
            className="inline-flex items-center px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover animate-smooth mt-4"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">
              Order #{order.id.slice(0, 8)}...
            </h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(order.order_status)}
            <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${getStatusColor(order.order_status)}`}>
              {order.order_status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Price Summary */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Price Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>${(order.total_price / (1 + order.tax_price) - order.shipping_price).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (18%)</span>
                <span>${(order.total_price * order.tax_price / (1 + order.tax_price)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shipping_price === 0 ? "Free" : `$${order.shipping_price}`}</span>
              </div>
              <div className="border-t border-[hsla(var(--glass-border))] pt-2 flex justify-between font-bold text-foreground text-base">
                <span>Total</span>
                <span className="text-primary">${order.total_price}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="glass-card p-6 md:col-span-2">
            <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Address</h2>
            {order.shipping_info ? (
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-primary" />
                  <span>{order.shipping_info.full_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{order.shipping_info.phone}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <span>
                    {order.shipping_info.address}, {order.shipping_info.city},{" "}
                    {order.shipping_info.state}, {order.shipping_info.country} —{" "}
                    {order.shipping_info.pincode}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No shipping info available.</p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Ordered Items ({order.order_items.length})
          </h2>
          <div className="space-y-4">
            {order.order_items.map((item) => (
              <div
                key={item.product_id}
                className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg"
              >
                <Link to={`/product/${item.product_id}`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-contain rounded-lg hover:scale-105 transition"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product_id}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary truncate">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-foreground">${item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/orders"
            className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
          >
            ← Back to Orders
          </Link>

          {order.order_status === "Processing" && (
            <button
              onClick={handleCancel}
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
    </div>
  );
};

export default OrderDetails;