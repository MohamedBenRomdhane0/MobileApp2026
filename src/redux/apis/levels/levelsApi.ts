import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "@redux/baseQueryConfig";
import { ENDPOINTS } from "@config/constants/endpoints";
import { MethodsEnum } from "@config/enums/method.enum";
import i18n from "i18n";
import type {
  LevelUI,
  LevelTypeUI,
  GetPublicLevelTypesApiResponse,
} from "./levelsApi.type";
import { transformLevels } from "./levelsApi.transform";

function extractRows(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") {
    const d = (raw as Record<string, unknown>).data;
    if (Array.isArray(d)) return d;
    if (d && typeof d === "object" && Array.isArray((d as Record<string, unknown>).data)) {
      return (d as Record<string, unknown>).data as unknown[];
    }
  }
  return [];
}

function transformLevelTypes(raw: unknown): LevelTypeUI[] {
  return extractRows(raw)
    .filter((item): item is Record<string, unknown> => !!item && typeof item === "object")
    .map((item) => ({
      id: Number(item.id) || 0,
      name: String(item.name ?? "").trim(),
      nameAr: String(item.name_ar ?? item.nameAr ?? "").trim() || null,
    }));
}

export const levelsApi = createApi({
  reducerPath: "levelsApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Levels", "PublicLevelTypes", "PublicLevels"],
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

    getPublicLevelTypes: build.query<LevelTypeUI[], void>({
      query: () => ({
        url: ENDPOINTS.PUBLIC_LEVEL_TYPES,
        method: MethodsEnum.GET,
      }),
      transformResponse: (raw: unknown) => transformLevelTypes(raw),
      providesTags: ["PublicLevelTypes"],
    }),

    getPublicLevels: build.query<LevelUI[], void>({
      query: () => ({
        url: ENDPOINTS.PUBLIC_LEVELS,
        method: MethodsEnum.GET,
      }),
      transformResponse: (raw: unknown) => transformLevels(raw, i18n.language),
      providesTags: ["PublicLevels"],
    }),
  }),
});

export const {
  useGetLevelsQuery,
  useGetPublicLevelTypesQuery,
  useGetPublicLevelsQuery,
} = levelsApi;
