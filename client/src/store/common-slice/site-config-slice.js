import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  // Defaults: everything enabled until server responds
  config: {
    showPrice: true,
    showAddToCart: true,
    showCart: true,
    showCheckout: true,
    showReviews: true,
    showLogin: true,
    showRegistration: true,
    showSearch: true,
  },
  isLoading: false,
  isLoaded: false,
};

export const fetchSiteConfig = createAsyncThunk(
  "siteConfig/fetch",
  async () => {
    const response = await api.get("/common/site-config/get");
    return response.data;
  }
);

const siteConfigSlice = createSlice({
  name: "siteConfig",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSiteConfig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSiteConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoaded = true;
        if (action.payload.data) {
          state.config = action.payload.data;
        }
      })
      .addCase(fetchSiteConfig.rejected, (state) => {
        state.isLoading = false;
        state.isLoaded = true;
        // On failure, keep defaults (all enabled) so site doesn't break
      });
  },
});

export default siteConfigSlice.reducer;
