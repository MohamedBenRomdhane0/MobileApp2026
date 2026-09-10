import { createApi } from "@reduxjs/toolkit/query/react";
import { MethodsEnum } from "@config/enums/method.enum";
import { baseQueryConfig } from "@redux/baseQueryConfig";
import i18n from "i18n";

import type {
  DraftBooksArgs,
  DraftBooksApiResponse,
  DraftBooksResponse,
  DraftBookByIdApiResponse,
  DraftBookByIdResponse,
  DraftStationContentApiResponse,
  DraftStationContentResponse,
  DraftLevelMaterialsApiResponse,
  DraftPlansApiResponse,
  DraftCreateSessionApiResponse,
  DraftRestoreSessionApiResponse,
  DraftInteractApiResponse,
  DraftCheckParentApiResponse,
  DraftCompleteApiResponse,
} from "./draftApi.type";

import { toBookListItemUI, toBookDetailsUI } from "@redux/apis/books/bookApi.transform";
import { transformMaterialsByLevel } from "@redux/apis/materials/materialsApi.transform";
import { transformPlans } from "@redux/apis/plans/plansApi.transform";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import type { PlanUI } from "@redux/apis/plans/plansApi.type";

export const draftApi = createApi({
  reducerPath: "draftApi",
  baseQuery: baseQueryConfig,
  tagTypes: ["DraftBooks", "DraftBook", "DraftMaterials", "DraftPlans"],
  endpoints: (build) => ({
    getDraftBooks: build.query<DraftBooksResponse, DraftBooksArgs | void>({
      query: (args) => ({
        url: "draft/books",
        method: MethodsEnum.GET,
        params: {
          ...(args?.levelId ? { level_id: args.levelId } : {}),
          ...(args?.page ? { page: args.page } : {}),
          ...(args?.perPage ? { per_page: args.perPage } : {}),
        },
      }),
      transformResponse: (response: DraftBooksApiResponse): DraftBooksResponse => {
        const raw: any = response;
        const items: any[] = Array.isArray(raw.data)
          ? raw.data
          : Array.isArray(raw?.data?.data)
            ? raw.data.data
            : [];
        return {
          message: response.message,
          meta: response.meta ?? raw?.data?.meta ?? raw?.meta,
          data: items.map(toBookListItemUI),
        };
      },
      providesTags: (result) =>
        result?.data?.length
          ? [
              { type: "DraftBooks" as const, id: "LIST" },
              ...result.data.map((book) => ({
                type: "DraftBook" as const,
                id: book.id,
              })),
            ]
          : [{ type: "DraftBooks" as const, id: "LIST" }],
    }),

    getDraftBookById: build.query<DraftBookByIdResponse, { bookId: number }>({
      query: ({ bookId }) => ({
        url: `draft/books/${bookId}`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (
        response: DraftBookByIdApiResponse
      ): DraftBookByIdResponse => ({
        message: response.message,
        data: toBookDetailsUI(response.data),
      }),
      providesTags: (_result, _error, { bookId }) => [
        { type: "DraftBook" as const, id: bookId },
      ],
    }),

    getDraftStationContent: build.query<
      DraftStationContentResponse,
      { iconId: number }
    >({
      query: ({ iconId }) => ({
        url: `draft/books/${iconId}/station-content`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (
        response: DraftStationContentApiResponse
      ): DraftStationContentResponse => ({
        message: response.message,
        data: response.data,
      }),
    }),

    getDraftLevelMaterials: build.query<
      MaterialUI[],
      { levelId: number; locale?: string }
    >({
      query: ({ levelId }) => ({
        url: "draft/level-materials",
        method: MethodsEnum.GET,
        params: { level_id: levelId },
      }),
      transformResponse: (raw: unknown, _meta, arg) =>
        transformMaterialsByLevel(raw, arg.locale ?? i18n.language ?? "fr"),
      providesTags: (_res, _err, arg) => [
        { type: "DraftMaterials" as const, id: arg.levelId },
      ],
    }),

    getDraftPlans: build.query<PlanUI[], { levelId?: number } | void>({
      query: (args) => ({
        url: "draft/plans",
        method: MethodsEnum.GET,
        params: args?.levelId ? { level_id: args.levelId } : undefined,
      }),
      transformResponse: (response: DraftPlansApiResponse): PlanUI[] => {
        const locale = i18n.language ?? "ar";
        const rawPlans = Array.isArray(response.data) ? response.data : [];
        return transformPlans(rawPlans, locale);
      },
      providesTags: (result) =>
        result?.length
          ? [
              { type: "DraftPlans" as const, id: "LIST" },
              ...result.map((plan) => ({
                type: "DraftPlans" as const,
                id: plan.id,
              })),
            ]
          : [{ type: "DraftPlans" as const, id: "LIST" }],
    }),

    createDraftSession: build.mutation<
      DraftCreateSessionApiResponse["data"] | null,
      { levelId: number }
    >({
      query: ({ levelId }) => ({
        url: "draft-session",
        method: MethodsEnum.POST,
        body: { level_id: levelId },
      }),
      transformResponse: (
        response: DraftCreateSessionApiResponse
      ): DraftCreateSessionApiResponse["data"] | null => response.data ?? null,
    }),

    restoreDraftSession: build.mutation<
      DraftRestoreSessionApiResponse["data"],
      { levelId: number }
    >({
      query: ({ levelId }) => ({
        url: "draft/session/restore",
        method: MethodsEnum.GET,
        params: { level_id: levelId },
      }),
      transformResponse: (response: DraftRestoreSessionApiResponse) => response.data,
    }),

    logDraftInteraction: build.mutation<
      DraftInteractApiResponse["data"],
      { type: string; metadata?: Record<string, unknown> }
    >({
      query: (body) => ({
        url: "draft/session/interact",
        method: MethodsEnum.POST,
        body,
      }),
      transformResponse: (response: DraftInteractApiResponse) => response.data,
    }),

    checkDraftParent: build.mutation<
      DraftCheckParentApiResponse["data"],
      void
    >({
      query: () => ({
        url: "draft/session/check-parent",
        method: MethodsEnum.POST,
      }),
      transformResponse: (response: DraftCheckParentApiResponse) => response.data,
    }),

    completeDraftSession: build.mutation<
      DraftCompleteApiResponse["data"],
      void
    >({
      query: () => ({
        url: "draft/session/complete",
        method: MethodsEnum.POST,
      }),
      transformResponse: (response: DraftCompleteApiResponse) => response.data,
    }),
  }),
});

export const {
  useGetDraftBooksQuery,
  useLazyGetDraftBooksQuery,
  useGetDraftBookByIdQuery,
  useGetDraftStationContentQuery,
  useGetDraftLevelMaterialsQuery,
  useGetDraftPlansQuery,
  useCreateDraftSessionMutation,
  useRestoreDraftSessionMutation,
  useLogDraftInteractionMutation,
  useCheckDraftParentMutation,
  useCompleteDraftSessionMutation,
} = draftApi;

export default draftApi;
