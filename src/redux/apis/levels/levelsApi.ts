import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@redux/baseQueryConfig";
import { ENDPOINTS } from "@config/constants/endpoints";
import { MethodsEnum } from "@config/enums/method.enum";
import i18n from "i18n";
import type { LevelUI } from "./levelsApi.type";
import { transformLevels } from "./levelsApi.transform";

export const levelsApi = createApi({
  reducerPath: "levelsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Levels"],
  endpoints: (build) => ({
    getLevels: build.query<LevelUI[], void>({
      query: () => ({
        url: ENDPOINTS.GET_LEVELS,
        method: MethodsEnum.GET,
        params: { per_page: 100 },
      }),
      transformResponse: (raw: unknown) =>
        transformLevels(raw, i18n.language),
      providesTags: ["Levels"],
    }),
  }),
});

export const { useGetLevelsQuery } = levelsApi;
