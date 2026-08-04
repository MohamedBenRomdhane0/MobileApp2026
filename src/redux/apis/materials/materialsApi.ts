import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@redux/baseQueryConfig";
import i18n from "i18n";
import type { MaterialUI } from "./materialsApi.type";
import { transformMaterialsByLevel } from "./materialsApi.transform";

export const materialsApi = createApi({
    reducerPath: "materialsApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["MaterialsByLevel"],
    endpoints: (build) => ({
        getMaterialsByLevel: build.query<MaterialUI[], { levelId: number; locale?: string }>({
            query: ({ levelId }) => ({
                url: `/levels/${levelId}/level-materials`,
                method: "GET",
            }),

            transformResponse: (raw: unknown, _meta, arg) =>
                transformMaterialsByLevel(raw, arg.locale ?? i18n.language ?? "fr"),
            providesTags: (_res, _err, arg) => [
                { type: "MaterialsByLevel", id: arg.levelId },
            ],
        }),
    }),
});

export const { useGetMaterialsByLevelQuery } = materialsApi;
