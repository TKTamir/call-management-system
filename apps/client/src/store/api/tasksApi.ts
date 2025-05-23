import { api } from "./apiSlice";
import type {
  ApiResponse,
  CreateTaskRequest,
  GetSuggestedTasksForTagsRequest,
  Task,
  UpdateTaskRequest,
} from "../../types";

export const tasksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks (Admin/Development use)
    getAllTasks: builder.query<Task[], void>({
      query: () => "/tasks",
      transformResponse: (response: ApiResponse<Task[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    // Get task by ID (Development use)
    getTaskById: builder.query<Task, number>({
      query: (id) => `/tasks/${id}`,
      transformResponse: (response: ApiResponse<Task>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Task", id }],
    }),

    // Get suggested tasks (Admin view for management, User view for selection)
    getSuggestedTasks: builder.query<Task[], void>({
      query: () => "/tasks/suggested",
      transformResponse: (response: ApiResponse<Task[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "SuggestedTask" as const,
                id,
              })),
              { type: "SuggestedTask", id: "LIST" },
            ]
          : [{ type: "SuggestedTask", id: "LIST" }],
    }),

    // Create suggested task
    createSuggestedTask: builder.mutation<Task, CreateTaskRequest>({
      query: (taskData) => ({
        url: "/tasks/suggested",
        method: "POST",
        body: taskData,
      }),
      transformResponse: (response: ApiResponse<Task>) => response.data,
      invalidatesTags: [
        { type: "SuggestedTask", id: "LIST" },
        { type: "Task", id: "LIST" },
      ],
    }),

    // Update suggested task
    updateSuggestedTask: builder.mutation<
      Task,
      { id: number; data: UpdateTaskRequest }
    >({
      query: ({ id, data }) => ({
        url: `/tasks/suggested/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Task>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "SuggestedTask", id },
        { type: "SuggestedTask", id: "LIST" },
        { type: "Task", id },
        { type: "Task", id: "LIST" },
        { type: "CallTask", id: "LIST" }, // Invalidate call tasks as task name changed
      ],
    }),

    // Get suggested tasks for multiple tags
    // Used when user selects tags on a call to show relevant suggested tasks
    getSuggestedTasksForTags: builder.mutation<
      Task[],
      GetSuggestedTasksForTagsRequest
    >({
      query: (data) => ({
        url: "/tasks/suggested/by-tags",
        method: "POST",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Task[]>) => response.data,
    }),
  }),
});

export const {
  useGetAllTasksQuery,
  useGetTaskByIdQuery,
  useGetSuggestedTasksQuery,
  useCreateSuggestedTaskMutation,
  useUpdateSuggestedTaskMutation,
  useGetSuggestedTasksForTagsMutation,
} = tasksApi;
