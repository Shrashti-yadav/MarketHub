import React from "react";
import { useDispatch } from "react-redux";
import { toggleViewProductModal } from "../store/slices/extraSlice";

const ViewProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();

  if (!selectedProduct) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4"
      onClick={() => dispatch(toggleViewProductModal())}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => dispatch(toggleViewProductModal())}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Product Details</h2>

        {/* Images */}
        {selectedProduct?.images?.length > 0 && (
          <div className="flex gap-3 overflow-x-auto mb-6">
            {selectedProduct.images.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={selectedProduct.name}
                className="w-28 h-28 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Title</p>
            <p className="font-semibold text-gray-800">{selectedProduct.name}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Category</p>
            <p className="font-semibold text-gray-800">{selectedProduct.category}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Price</p>
            <p className="font-semibold text-gray-800">₹{selectedProduct.price}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Stock</p>
            <p className="font-semibold text-gray-800">{selectedProduct.stock}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Ratings</p>
            <p className="font-semibold text-yellow-500">{selectedProduct.ratings} ⭐</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 col-span-1 md:col-span-2">
            <p className="text-xs text-gray-500 mb-1">Description</p>
            <p className="font-semibold text-gray-800">{selectedProduct.description || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;