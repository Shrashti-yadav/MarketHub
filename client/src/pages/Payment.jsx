import { useState, useEffect } from "react";
import { ArrowLeft, Check, Truck, CreditCard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../components/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import { placeOrder } from "../store/slices/orderSlice";

const Payment = () => {
  const { authUser } = useSelector((state) => state.auth);
  const navigateTo = useNavigate();
  if (!authUser) return navigateTo("/products");

  const [stripePromise, setStripePromise] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Card"); // "Card" | "COD"

  useEffect(() => {
    loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
      .then((stripe) => setStripePromise(stripe))
      .catch((err) => console.log(err));
  }, []);

  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { orderStep, placingOrder, isCOD, finalPrice } = useSelector((state) => state.order);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "", state: "Kanpur", phone: "",
    address: "", city: "", zipCode: "", country: "India",
  });

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let totalWithTax = total + total * 0.18;
  if (total > 50) totalWithTax += 2;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("full_name", shippingDetails.fullName);
    formData.append("state", shippingDetails.state);
    formData.append("city", shippingDetails.city);
    formData.append("country", shippingDetails.country);
    formData.append("address", shippingDetails.address);
    formData.append("pincode", shippingDetails.zipCode);
    formData.append("phone", shippingDetails.phone);
    formData.append("orderedItems", JSON.stringify(cart));
    formData.append("payment_method", paymentMethod);
    dispatch(placeOrder(formData));
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-panel max-w-md p-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">No Items in Cart.</h1>
          <p className="text-muted-foreground mb-8">Add some items before checkout.</p>
          <Link to="/products" className="inline-flex items-center px-6 py-3 rounded-lg text-primary-foreground gradient-primary animate-smooth font-semibold">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="flex items-center space-x-4 mb-8">
            <Link to="/cart" className="p-2 glass-card hover:glow-on-hover animate-smooth">
              <ArrowLeft className="w-5 h-5 text-primary" />
            </Link>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${orderStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 1 ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                  {orderStep > 1 ? <Check className="w-5 h-5" /> : "1"}
                </div>
                <span className="font-medium">Details</span>
              </div>
              <div className={`w-12 h-0.5 ${orderStep >= 2 ? "bg-primary" : "bg-border"}`} />
              <div className={`flex items-center space-x-2 ${orderStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${orderStep >= 2 ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                  2
                </div>
                <span className="font-medium">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              {orderStep === 1 ? (
                <form onSubmit={handlePlaceOrder} className="glass-panel space-y-6">
                  <h2 className="text-xl font-semibold text-foreground">Shipping Information</h2>

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name *</label>
                    <input type="text" required value={shippingDetails.fullName}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">State *</label>
                      <select value={shippingDetails.state}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground">
                        {["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Phone *</label>
                      <input type="tel" required value={shippingDetails.phone}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Address *</label>
                    <input type="text" required value={shippingDetails.address}
                      onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })}
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">City *</label>
                      <input type="text" required value={shippingDetails.city}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">ZIP Code *</label>
                      <input type="text" required value={shippingDetails.zipCode}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, zipCode: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Country *</label>
                      <select value={shippingDetails.country}
                        onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground">
                        <option value="India">India</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">Payment Method *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("Card")}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                          paymentMethod === "Card"
                            ? "border-primary bg-primary/10"
                            : "border-border glass-card hover:border-primary/50"
                        }`}
                      >
                        <CreditCard className={`w-5 h-5 ${paymentMethod === "Card" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="text-left">
                          <p className={`font-semibold text-sm ${paymentMethod === "Card" ? "text-primary" : "text-foreground"}`}>
                            Card Payment
                          </p>
                          <p className="text-xs text-muted-foreground">Pay via Stripe</p>
                        </div>
                        {paymentMethod === "Card" && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod("COD")}
                        className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                          paymentMethod === "COD"
                            ? "border-primary bg-primary/10"
                            : "border-border glass-card hover:border-primary/50"
                        }`}
                      >
                        <Truck className={`w-5 h-5 ${paymentMethod === "COD" ? "text-primary" : "text-muted-foreground"}`} />
                        <div className="text-left">
                          <p className={`font-semibold text-sm ${paymentMethod === "COD" ? "text-primary" : "text-foreground"}`}>
                            Cash on Delivery
                          </p>
                          <p className="text-xs text-muted-foreground">Pay when delivered</p>
                        </div>
                        {paymentMethod === "COD" && <Check className="w-4 h-4 text-primary ml-auto" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={placingOrder}
                    className="w-full py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {placingOrder ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Placing Order...</span>
                      </>
                    ) : paymentMethod === "COD" ? (
                      "Place Order (Cash on Delivery)"
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>
                </form>
              ) : isCOD ? (
                /* COD Success Screen */
                <div className="glass-panel text-center py-12">
                  <div className="w-20 h-20 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <Truck className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">Order Placed!</h2>
                  <p className="text-muted-foreground mb-2">Your order has been placed successfully.</p>
                  <p className="text-muted-foreground mb-8">
                    Pay <span className="text-primary font-bold">${finalPrice}</span> when your order is delivered.
                  </p>
                  <Link
                    to="/orders"
                    className="inline-flex items-center px-8 py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold"
                  >
                    View My Orders
                  </Link>
                </div>
              ) : (
                /* Stripe Payment Form */
                <Elements stripe={stripePromise}>
                  <PaymentForm />
                </Elements>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-panel sticky top-24">
                <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <img src={item.product.images[0].url} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold">${Number(item.product.price) * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-[hsla(var(--glass-border))] pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-500">{totalWithTax >= 50 ? "Free" : "$2"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18%)</span>
                    <span>${(total * 0.18).toFixed(2)}</span>
                  </div>
                  {paymentMethod === "COD" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment</span>
                      <span className="text-yellow-400">Cash on Delivery</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-[hsla(var(--glass-border))]">
                    <span>Total</span>
                    <span className="text-primary">${totalWithTax.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;