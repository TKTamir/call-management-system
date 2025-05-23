import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "./api";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    // API slice
    [api.reducerPath]: api.reducer,
    // Auth slice for managing authentication state
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [api.util.resetApiState.type],
      },
    }).concat(api.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Enable automatic refetching on focus/reconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
