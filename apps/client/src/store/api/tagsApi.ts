import { api } from "./apiSlice";
import type {ApiResponse, CreateTagRequest, Tag, Task, UpdateTagRequest} from "../../types";

export const tagsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tags (Admin and User views)
    getAllTags: builder.query<Tag[], void>({
      query: () => "/tags",
      transformResponse: (response: ApiResponse<Tag[]>) => response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tag" as const, id })),
              { type: "Tag", id: "LIST" },
            ]
          : [{ type: "Tag", id: "LIST" }],
    }),

    // Get tag by ID
    getTagById: builder.query<Tag, number>({
      query: (id) => `/tags/${id}`,
      transformResponse: (response: ApiResponse<Tag>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Tag", id }],
    }),

    // Create new tag (Admin only)
    createTag: builder.mutation<Tag, CreateTagRequest>({
      query: (tagData) => ({
        url: "/tags",
        method: "POST",
        body: tagData,
      }),
      transformResponse: (response: ApiResponse<Tag>) => response.data,
      invalidatesTags: [
        { type: "Tag", id: "LIST" },
        { type: "CallTag", id: "LIST" }, // Invalidate call tags as new tag is available
      ],
    }),

    // Update tag (Admin only)
    updateTag: builder.mutation<Tag, { id: number; data: UpdateTagRequest }>({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: ApiResponse<Tag>) => response.data,
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Tag", id },
        { type: "Tag", id: "LIST" },
        { type: "Call", id: "LIST" }, // Invalidate calls to reflect updated tag names
        { type: "CallTag", id: "LIST" },
      ],
    }),

    // Get suggested tasks for a specific tag (Admin view)
    getTagSuggestedTasks: builder.query<Task[], number>({
      query: (tagId) => `/tags/${tagId}/suggested-tasks`,
      transformResponse: (response: ApiResponse<Task[]>) => response.data,
      providesTags: (_result, _error, tagId) => [
        { type: "TagTaskAssociation", id: tagId },
      ],
    }),

    // Add suggested task to tag
    addSuggestedTaskToTag: builder.mutation<
      void,
      { tagId: number; taskId: number }
    >({
      query: ({ tagId, taskId }) => ({
        url: `/tags/${tagId}/suggested-tasks`,
        method: "POST",
        body: { taskId },
      }),
      invalidatesTags: (_result, _error, { tagId }) => [
        { type: "TagTaskAssociation", id: tagId },
        { type: "TagTaskAssociation", id: "LIST" },
        { type: "SuggestedTask", id: "LIST" },
      ],
    }),

    // Delete tag (Admin only)
    deleteTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Tag", id },
        { type: "Tag", id: "LIST" },
        { type: "CallTag", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetAllTagsQuery,
  useGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useGetTagSuggestedTasksQuery,
  useAddSuggestedTaskToTagMutation,
  useDeleteTagMutation,
} = tagsApi;
