import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@redux/baseQueryConfig";
import type { MaterialUI } from "./materialsApi.type";
import { transformMaterialsByLevel } from "./materialsApi.transform";

export const materialsApi = createApi({
  reducerPath: "materialsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["MaterialsByLevel"],
  endpoints: (build) => ({
    getMaterialsByLevel: build.query<MaterialUI[], { levelId: number }>({
      query: ({ levelId }) => ({
        url: `/levels/${levelId}/level-materials`,
        method: "GET",
      }),

      transformResponse: (raw: unknown): MaterialUI[] => transformMaterialsByLevel(raw),

      providesTags: (_res, _err, arg) => [{ type: "MaterialsByLevel", id: arg.levelId }],
    }),
  }),
});

export const { useGetMaterialsByLevelQuery } = materialsApi;