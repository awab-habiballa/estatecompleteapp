import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiRequest from "../lib/apiRegues";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const res = await apiRequest.get("/users/notification");

    return res.data;
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    number: 0,
    loading: false,
    error: null,
  },
  reducers: {
    decrease: (state) => {
      if (state.number > 0) {
        state.number -= 1;
      }
    },
    reset: (state) => {
      state.number = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.number = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { decrease, reset } = notificationSlice.actions;
export default notificationSlice.reducer;
