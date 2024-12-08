import { configureStore } from "@reduxjs/toolkit";
import notificationsReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
  },
});
