import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart, ShoppingBag, Trash2, Loader, ShoppingCart } from "lucide-react";
import { fetchWishlist, removeFromWishlist } from "../store/slices/wishlistSlice";
import { addToCart } from "../store/slices/cartSlice";
import { toast } from "react-toastify";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: wishlist, loading } = useSelector((state) => state.wishlist);
  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId) => {
    const result = await dispatch(removeFromWishlist(productId));
    if (removeFromWishlist.fulfilled.match(result)) {
      toast.success("Removed from wishlist");
    }
  };

  const handleBuyNow = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    navigate("/payment");
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ product, quantity: 1 }));
    toast.success("Added to cart!");
  };

  if (!authUser) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-card p-12">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Sign in to view your wishlist
          </h2>
          <p className="text-muted-foreground mb-6">
            Save products you love and come back to them anytime.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover animate-smooth"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-card p-12">
          <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground mb-6">
            Browse products and tap the heart icon to save them here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold hover:glow-on-hover animate-smooth"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Heart className="w-7 h-7 text-rose-500 fill-current" />
          <h1 className="text-3xl font-bold text-foreground">My Wishlist</h1>
          <span className="px-3 py-1 glass-card text-muted-foreground text-sm rounded-full">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Wishlist Items */}
        <div className="flex flex-col space-y-4">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              {/* Product Image — click to navigate */}
              <Link
                to={`/product/${product.id}`}
                className="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden glass-card hover:glow-on-hover animate-smooth"
              >
                <img
                  src={product.images?.[0]?.url}
                  alt={product.name}
                  className="w-full h-full object-contain p-1"
                />
              </Link>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${product.id}`}
                  className="text-lg font-semibold text-foreground hover:text-primary animate-smooth line-clamp-1"
                >
                  {product.name}
                </Link>
                <p className="text-muted-foreground text-sm mb-1">
                  {product.category}
                </p>
                <span className="text-xl font-bold text-primary">
                  ${product.price}
                </span>

                {/* Stock badge */}
                <div className="mt-1">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      product.stock > 5
                        ? "bg-green-500/20 text-green-400"
                        : product.stock > 0
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {product.stock > 5
                      ? "In Stock"
                      : product.stock > 0
                      ? "Limited Stock"
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center space-x-2 px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => handleBuyNow(product)}
                  disabled={product.stock === 0}
                  className="flex items-center justify-center space-x-2 px-4 py-2 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>

                <button
                  onClick={() => handleRemove(product.id)}
                  className="flex items-center justify-center p-2 glass-card hover:glow-on-hover animate-smooth text-destructive"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;