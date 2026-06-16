import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";
import { updateProduct } from "../store/slices/productSlice";
import { toggleUpdateProductModal } from "../store/slices/extraSlice";

const UpdateProductModal = ({ selectedProduct }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: selectedProduct?.name || "",
    description: selectedProduct?.description || "",
    price: selectedProduct?.price || "",
    category: selectedProduct?.category || "Electronics",
    stock: selectedProduct?.stock || "",
    images: [],
  });

  const categoryOptions = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Beauty",
    "Automotive",
    "Kids & Baby",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("stock", formData.stock);
    formData.images.forEach((image) => {
      data.append("images", image);
    });
    dispatch(updateProduct({ id: selectedProduct?.id, data }));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4"
      onClick={() => dispatch(toggleUpdateProductModal())}
    >
      <div
        className="bg-white rounded-xl w-full max-w-2xl p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => dispatch(toggleUpdateProductModal())}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Update Product</h2>

        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Title"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border px-4 py-2 rounded"
          />

          <select
            className="w-full border p-2 rounded-lg"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {categoryOptions.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="border px-4 py-2 rounded"
          />

          <input
            type="number"
            placeholder="Stock"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="border px-4 py-2 rounded"
          />

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              setFormData({ ...formData, images: Array.from(e.target.files) })
            }
            className="border px-4 py-2 rounded col-span-1 md:col-span-2"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
            className="border px-4 py-2 rounded col-span-1 md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded col-span-1 md:col-span-2"
          >
            {loading ? (
              <>
                <LoaderCircle className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Product"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;