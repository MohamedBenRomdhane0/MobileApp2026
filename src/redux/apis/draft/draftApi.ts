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
  DraftMeetingsArgs,
  DraftMeetingsApiResponse,
  DraftMeetingsResponse,
} from "./draftApi.type";

import type { MeetingListItemUI } from "@redux/apis/meetings/meetingApi.type";

import { toBookListItemUI, toBookDetailsUI } from "@redux/apis/books/bookApi.transform";
import { transformMaterialsByLevel } from "@redux/apis/materials/materialsApi.transform";
import { transformPlans } from "@redux/apis/plans/plansApi.transform";
import { toMeetingGroupUI } from "@redux/apis/meetings/meetingApi.transform";
import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import type { PlanUI } from "@redux/apis/plans/plansApi.type";
import type { MeetingGroupApi } from "@redux/apis/meetings/meetingApi.type";

export const draftApi = createApi({
  reducerPath: "draftApi",
  baseQuery: baseQueryConfig,
  tagTypes: ["DraftBooks", "DraftBook", "DraftMaterials", "DraftPlans", "DraftMeetings"],
  endpoints: (build) => ({
    getDraftBooks: build.query<DraftBooksResponse, DraftBooksArgs | void>({
      query: (args) => ({
        url: "draft/books",
        method: MethodsEnum.GET,
        params: {
          ...(args?.levelId ? { level_id: args.levelId } : {}),
          ...(args?.page ? { page: args.page } : {}),
          ...(args?.perPage ? { per_page: args.perPage } : {}),
          ...(typeof args?.type === "number" ? { type: args.type } : {}),
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

  getDraftMeetings: build.query<MeetingListItemUI[], DraftMeetingsArgs | void>({
    query: (args) => ({
      url: "draft/meetings",
      method: MethodsEnum.GET,
      params: {
        ...(args?.levelId ? { level_id: args.levelId } : {}),
        ...(args?.page ? { page: args.page } : {}),
        ...(args?.perPage ? { per_page: args.perPage } : {}),
      },
    }),
    transformResponse: (response: DraftMeetingsApiResponse): MeetingListItemUI[] => {
      const items = Array.isArray(response.data) ? response.data : [];
      return items.map((m) => {
        const rawGroups = Array.isArray(m.meetingGroups)
          ? m.meetingGroups
          : Array.isArray(m.groups)
            ? m.groups
            : Array.isArray(m.meeting_groups)
              ? m.meeting_groups
              : [];

        const meetingGroups = rawGroups.map((group: MeetingGroupApi) =>
          toMeetingGroupUI(group)
        );

        return {
          id: Number(m.id ?? m.meeting_id) || 0,
          name: String(m.name ?? m.meeting_name ?? "").trim(),
          levelId: typeof m.levelId === "number" ? m.levelId : typeof m.level_id === "number" ? m.level_id : null,
          levelName: String(m.levelName ?? m.level_name ?? "").trim(),
          materialId: typeof m.materialId === "number" ? m.materialId : typeof m.material_id === "number" ? m.material_id : null,
          materialName: String(m.materialName ?? m.material_name ?? m.material?.name ?? "").trim(),
          materialColor: String(m.materialColor ?? m.material_color ?? m.material?.color ?? "#22BEC8").trim() || "#22BEC8",
          teacherId: typeof m.teacherId === "number" ? m.teacherId : typeof m.teacher_id === "number" ? m.teacher_id : typeof m.teacher?.id === "number" ? m.teacher.id : null,
          teacherName: String(m.teacherName ?? m.teacher_name ?? m.teacher?.full_name ?? m.teacher?.fullName ?? "").trim(),
          teacherAvatarUrl: m.teacherAvatarUrl ?? m.teacher_avatar_url ?? m.teacher?.avatar_url ?? m.teacher?.avatarUrl ?? null,
          isPrivate: Boolean(m.isPrivate ?? m.is_private),
          maxStudents: typeof m.maxStudents === "number" ? m.maxStudents : typeof m.max_students === "number" ? m.max_students : null,
          hasFreeTrial: Boolean(m.hasFreeTrial ?? m.has_free_trial),
          totalSessions: Number(m.totalSessions ?? m.total_sessions) || 0,
          price: (() => {
            const rawPrice = Number(m.price ?? m.starting_price ?? m.startingPrice) || 0;
            const rawDiscount = Number(m.discount) || 0;
            const rawFinal = Number(m.finalPrice ?? m.final_price ?? m.discounted_price ?? m.discountedPrice) || 0;
            if (rawFinal > 0) return rawFinal;
            if (rawPrice > 0 && rawDiscount > 0) return Math.max(rawPrice - rawDiscount, 0);
            return rawPrice;
          })(),
          discount: Number(m.discount) || 0,
          finalPrice: Number(m.finalPrice ?? m.final_price ?? m.discounted_price ?? m.discountedPrice) || 0,
          hasDiscount: Boolean(m.hasDiscount ?? m.has_discount),
          groupsCount: Number(m.groupsCount ?? m.groups_count) || meetingGroups.length || 0,
          upcomingSessionsCount: Number(m.upcomingSessionsCount ?? m.upcoming_sessions_count) || 0,
          nextSessionAt: m.nextSessionAt ?? m.next_session_at ?? null,
          status: String(m.status ?? "").trim(),
          timezone: String(m.timezone ?? "").trim(),
          meetingGroups,
          createdAt: m.createdAt ?? m.created_at ?? null,
          updatedAt: m.updatedAt ?? m.updated_at ?? null,
        };
      });
    },
    providesTags: (result) =>
      result?.length
        ? [
            { type: "DraftMeetings" as const, id: "LIST" },
            ...result.map((meeting) => ({
              type: "DraftMeetings" as const,
              id: meeting.id,
            })),
          ]
        : [{ type: "DraftMeetings" as const, id: "LIST" }],
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
  useGetDraftMeetingsQuery,
  useLazyGetDraftMeetingsQuery,
  useCreateDraftSessionMutation,
  useRestoreDraftSessionMutation,
  useLogDraftInteractionMutation,
  useCheckDraftParentMutation,
  useCompleteDraftSessionMutation,
} = draftApi;

export default draftApi;
