import { api } from "./apiSlice";
import type {
  AddTagsToCallRequest,
  AddTaskToCallRequest,
  ApiResponse,
  Call,
  CallTask,
  CreateCallRequest,
  Tag,
  UpdateCallTaskStatusRequest,
} from "../../types";

export const callsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all calls (User view - main functionality)
    getAllCalls: builder.query<Call[], void>({
      query: () => "/calls",
      transformResponse: (response: ApiResponse<Call[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Call" as const, id })),
              { type: "Call", id: "LIST" },
            ]
          : [{ type: "Call", id: "LIST" }],
    }),

    // Get call by ID (User view - for detailed management)
    getCallById: builder.query<Call, number>({
      query: (id) => `/calls/${id}`,
      transformResponse: (response: ApiResponse<Call>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Call", id }],
    }),

    // Create new call (User view - main functionality)
    createCall: builder.mutation<Call, CreateCallRequest>({
      query: (callData) => ({
        url: "/calls",
        method: "POST",
        body: callData,
      }),
      transformResponse: (response: ApiResponse<Call>) => response.data,
      invalidatesTags: [{ type: "Call", id: "LIST" }],
    }),

    // Get tags assigned to a call
    getCallTags: builder.query<Tag[], number>({
      query: (callId) => `/calls/${callId}/tags`,
      transformResponse: (response: ApiResponse<Tag[]>) => response.data,
      providesTags: (_result, _error, callId) => [
        { type: "CallTag", id: callId },
      ],
    }),

    // Add tags to call (User view - main functionality)
    addTagsToCall: builder.mutation<
      void,
      { callId: number; data: AddTagsToCallRequest }
    >({
      query: ({ callId, data }) => ({
        url: `/calls/${callId}/tags`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { callId }) => [
        { type: "CallTag", id: callId },
        { type: "Call", id: callId },
      ],
    }),

    // Get tasks assigned to a call (User view - main functionality)
    getCallTasks: builder.query<CallTask[], number>({
      query: (callId) => `/calls/${callId}/tasks`,
      transformResponse: (response: ApiResponse<CallTask[]>) => response.data,
      providesTags: (_result, _error, callId) => [
        { type: "CallTask", id: callId },
      ],
    }),

    // Add task to call (User view - main functionality)
    addTaskToCall: builder.mutation<
      void,
      { callId: number; data: AddTaskToCallRequest }
    >({
      query: ({ callId, data }) => ({
        url: `/calls/${callId}/tasks`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { callId }) => [
        { type: "CallTask", id: callId },
        { type: "Call", id: callId },
      ],
    }),

    // Update call task status (User view - main functionality)
    updateCallTaskStatus: builder.mutation<
      CallTask,
      { callId: number; taskId: number; data: UpdateCallTaskStatusRequest }
    >({
      query: ({ callId, taskId, data }) => ({
        url: `/calls/${callId}/tasks/${taskId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<CallTask>) => response.data,
      invalidatesTags: (_result, _error, { callId, taskId }) => [
        { type: "CallTask", callId: callId, taskId: taskId },
        { type: "Call", id: callId },
      ],
    }),
  }),
});

export const {
  useGetAllCallsQuery,
  useGetCallByIdQuery,
  useCreateCallMutation,
  useGetCallTagsQuery,
  useAddTagsToCallMutation,
  useGetCallTasksQuery,
  useAddTaskToCallMutation,
  useUpdateCallTaskStatusMutation,
} = callsApi;
