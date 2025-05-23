import { api } from "./apiSlice";
import type { ApiResponse, TagTaskAssociation } from "../../types";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tag-task associations
    // Used in the Admin view when admin clicks on a tag to see linked suggested tasks
    getAllTagTaskAssociations: builder.query<TagTaskAssociation[], void>({
      query: () => "/admin/tag-task-associations",
      transformResponse: (response: ApiResponse<TagTaskAssociation[]>) =>
        response.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ tagId, taskId }) => ({
                type: "TagTaskAssociation" as const,
                id: `${tagId}-${taskId}`,
              })),
              { type: "TagTaskAssociation", id: "LIST" },
            ]
          : [{ type: "TagTaskAssociation", id: "LIST" }],
    }),
  }),
});

export const { useGetAllTagTaskAssociationsQuery } = adminApi;
