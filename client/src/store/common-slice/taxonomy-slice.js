import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

const initialState = {
  categories: [],
  brands: [],
  categoryOptionsMap: {},
  brandOptionsMap: {},
  isLoading: false,
};

export const fetchTaxonomy = createAsyncThunk(
  "taxonomy/fetch",
  async () => {
    const response = await api.get("/common/taxonomy/get");
    return response.data;
  }
);

export const addCategory = createAsyncThunk(
  "taxonomy/addCategory",
  async (categoryData) => {
    const response = await api.post("/admin/taxonomy/category/add", categoryData);
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "taxonomy/deleteCategory",
  async (id) => {
    const response = await api.delete(`/admin/taxonomy/category/delete/${id}`);
    return { ...response.data, id };
  }
);

export const addBrand = createAsyncThunk(
  "taxonomy/addBrand",
  async (brandData) => {
    const response = await api.post("/admin/taxonomy/brand/add", brandData);
    return response.data;
  }
);

export const deleteBrand = createAsyncThunk(
  "taxonomy/deleteBrand",
  async (id) => {
    const response = await api.delete(`/admin/taxonomy/brand/delete/${id}`);
    return { ...response.data, id };
  }
);

const rebuildMaps = (state) => {
  state.categoryOptionsMap = {};
  state.categories.forEach(cat => {
    state.categoryOptionsMap[cat.value] = cat.name;
  });

  state.brandOptionsMap = {};
  state.brands.forEach(brand => {
    state.brandOptionsMap[brand.value] = brand.name;
  });
};

const taxonomySlice = createSlice({
  name: "taxonomy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaxonomy.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTaxonomy.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload.data.categories || [];
        state.brands = action.payload.data.brands || [];
        rebuildMaps(state);
      })
      .addCase(fetchTaxonomy.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.categories.push(action.payload.data);
          rebuildMaps(state);
        }
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.categories = state.categories.filter(c => c._id !== action.payload.id);
          rebuildMaps(state);
        }
      })
      .addCase(addBrand.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.brands.push(action.payload.data);
          rebuildMaps(state);
        }
      })
      .addCase(deleteBrand.fulfilled, (state, action) => {
        if (action.payload.success) {
          state.brands = state.brands.filter(b => b._id !== action.payload.id);
          rebuildMaps(state);
        }
      });
  },
});

export default taxonomySlice.reducer;
