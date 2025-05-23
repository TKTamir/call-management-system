// Import all API slices to ensure they're registered
import "./authApi";
import "./tagsApi";
import "./tasksApi";
import "./callsApi";
import "./adminApi";

// Re-export the main API and all hooks
export { api } from "./apiSlice";

// Re-export all hooks from individual API files
export * from "./authApi";
export * from "./tagsApi";
export * from "./tasksApi";
export * from "./callsApi";
export * from "./adminApi";
