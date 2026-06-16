import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchMyOrders = createAsyncThunk(
  "order/orders/me",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/order/orders/me");
      return res.data.myOrders;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to fetch orders";
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const placeOrder = createAsyncThunk(
  "order/new",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/order/new", data);
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to place order.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancel",
  async (orderId, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/order/cancel/${orderId}`);
      toast.success(res.data.message);

      return res.data.order;
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to cancel order.";
      toast.error(msg);
      return thunkAPI.rejectWithValue(msg);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,

    // ✅ FIX: per-order cancelling state
    cancellingOrderId: null,

    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
    isCOD: false,
    error: null,
  },

  reducers: {
    toggleOrderStep(state) {
      state.orderStep = 1;
      state.isCOD = false;
    },

    clearOrders(state) {
      state.myOrders = [];
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= FETCH =================
      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.fetchingOrders = false;
        state.error = action.payload;
      })

      // ================= PLACE ORDER =================
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.finalPrice = action.payload.total_price;
        state.isCOD = action.payload.isCOD;

        if (action.payload.isCOD) {
          state.orderStep = 2;
          state.paymentIntent = "";
        } else {
          state.paymentIntent = action.payload.paymentIntent;
          state.orderStep = 2;
        }
      })
      .addCase(placeOrder.rejected, (state) => {
        state.placingOrder = false;
      })

      // ================= CANCEL ORDER =================
      .addCase(cancelOrder.pending, (state, action) => {
        state.cancellingOrderId = action.meta.arg;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancellingOrderId = null;

        const index = state.myOrders.findIndex(
          (o) => o.id === action.payload.id
        );

        if (index !== -1) {
          state.myOrders[index].order_status = "Cancelled";
        }
      })
      .addCase(cancelOrder.rejected, (state) => {
        state.cancellingOrderId = null;
      });
  },
});

export default orderSlice.reducer;
export const { toggleOrderStep, clearOrders } = orderSlice.actions;