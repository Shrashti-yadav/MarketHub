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
      return thunkAPI.rejectWithValue(error.response.data.message);
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
      toast.error(error.response.data.message || "Failed to place order.");
      return thunkAPI.rejectWithValue(error.response.data.message);
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
      toast.error(error.response?.data?.message || "Failed to cancel order.");
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    cancellingOrder: false,
    finalPrice: null,
    orderStep: 1,
    paymentIntent: "",
    isCOD: false,
  },
  reducers: {
    toggleOrderStep(state) {
      state.orderStep = 1;
      state.isCOD = false;
    },
    // ← added clearOrders
    clearOrders(state) {
      state.myOrders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.fetchingOrders = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state) => { state.fetchingOrders = false; })

      .addCase(placeOrder.pending, (state) => { state.placingOrder = true; })
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
      .addCase(placeOrder.rejected, (state) => { state.placingOrder = false; })

      .addCase(cancelOrder.pending, (state) => { state.cancellingOrder = true; })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.cancellingOrder = false;
        const index = state.myOrders.findIndex((o) => o.id === action.payload.id);
        if (index !== -1) state.myOrders[index].order_status = "Cancelled";
      })
      .addCase(cancelOrder.rejected, (state) => { state.cancellingOrder = false; });
  },
});

export default orderSlice.reducer;
// ← added clearOrders to exports
export const { toggleOrderStep, clearOrders } = orderSlice.actions;