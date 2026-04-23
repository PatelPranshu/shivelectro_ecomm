import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api";

const initialState = {
  siteConfig: null,
  isLoading: false,
};

export const fetchAdminSiteConfig = createAsyncThunk(
  "adminModes/fetchConfig",
  async () => {
    const response = await api.get("/admin/modes/get");
    return response.data;
  }
);

export const updateAdminSiteConfig = createAsyncThunk(
  "adminModes/updateConfig",
  async (configData) => {
    const response = await api.put("/admin/modes/update", configData);
    return response.data;
  }
);

const adminModesSlice = createSlice({
  name: "adminModes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSiteConfig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminSiteConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.siteConfig = action.payload.data;
      })
      .addCase(fetchAdminSiteConfig.rejected, (state) => {
        state.isLoading = false;
        state.siteConfig = null;
      })
      .addCase(updateAdminSiteConfig.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAdminSiteConfig.fulfilled, (state, action) => {
        state.isLoading = false;
        state.siteConfig = action.payload.data;
      })
      .addCase(updateAdminSiteConfig.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default adminModesSlice.reducer;
