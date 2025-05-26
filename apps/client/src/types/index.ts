// API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// User
export interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

//Tag
export interface Tag {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}

// Task
export interface Task {
  id: number;
  name: string;
  isSuggested?: boolean;
  taskStatus?: "Open" | "In Progress" | "Completed";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTaskRequest {
  name: string;
}

export interface UpdateTaskRequest {
  name: string;
}

export interface GetSuggestedTasksForTagsRequest {
  tagIds: number[];
}

// TagTask
export interface TagTaskAssociation {
  tagId: number;
  taskId: number;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
  Tag?: Tag;
  Task?: Task;
}

// Login
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
}

// Register
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: "admin" | "user";
}

// Token
export interface RefreshTokenResponse {
  message: string;
}

// Call
export interface Call {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCallRequest {
  name: string;
}

export interface AddTagsToCallRequest {
  tagIds: number[];
}

export interface AddTaskToCallRequest {
  taskId?: number;
  taskName?: string;
  taskStatus?: "Open" | "In Progress" | "Completed";
}

// CallTask
export interface CallTask {
  callId: number;
  taskId: number;
  taskStatus: "Open" | "In Progress" | "Completed";
  createdAt?: Date;
  updatedAt?: Date;
  Task?: Task;
}

export interface UpdateCallTaskStatusRequest {
  taskStatus: "Open" | "In Progress" | "Completed";
}
