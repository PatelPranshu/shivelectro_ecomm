import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"; 

const initialState = {
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};

// --- ADDED --- Creates the order on Razorpay's servers
export const createRazorpayOrder = createAsyncThunk(
  "/order/createRazorpayOrder",
  async ({ amount }) => {
    const response = await api.post(
      "/shop/order/create-razorpay-order",
      { amount }
    );
    return response.data;
  }
);

// --- ADDED --- Verifies payment and creates the order in your database
export const verifyRazorpayPayment = createAsyncThunk(
  "/order/verifyRazorpayPayment",
  async (payload) => {
    const response = await api.post(
      "/shop/order/verify-razorpay-payment",
      payload
    );
    return response.data;
  }
);

// These thunks remain unchanged
export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await api.get(
      `/shop/order/list/${userId}`
    );
    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await api.get(
      `/shop/order/details/${id}`
    );
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    // We only need the reducers for fetching order history now
    builder
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;