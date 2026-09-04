import { createApi } from "@reduxjs/toolkit/query/react";

import { MethodsEnum } from "@config/enums/method.enum";
import { baseQueryConfig } from "@redux/baseQueryConfig";

import type {
  ApiSuccess,
  GetMeetingsArgs,
  MeetingApi,
  MeetingDetailsUI,
  MeetingsCollectionApiResponse,
  MeetingsListPayloadUI,
  ReservedMeetingTimeApi,
  ReservedMeetingTimeUI,
  SubscribeToGroupArgs,
  SubscribeToGroupResponse,
  TeacherDetailApi,
} from "./meetingApi.type";

import {
  toMeetingDetailsUI,
  toMeetingsListPayloadUI,
  toReservedMeetingTimesUI,
} from "./meetingApi.transform";

const buildGetMeetingsUrl = (args?: GetMeetingsArgs): string => {
  const params = new URLSearchParams();

  if (args?.page) {
    params.append("page", String(args.page));
  }

  if (args?.perPage) {
    params.append("per_page", String(args.perPage));
  }

  if (args?.keyword?.trim()) {
    params.append("keyword", args.keyword.trim());
  }

  if (args?.materialId) {
    params.append("material_id", String(args.materialId));
  }

  if (args?.teacherId) {
    params.append("teacher_id", String(args.teacherId));
  }

  if (typeof args?.hasFreeTrial === "boolean") {
    params.append("has_free_trial", String(args.hasFreeTrial));
  }

  if (typeof args?.pagination === "boolean") {
    params.append("pagination", String(args.pagination));
  }

  if (args?.orderBy) {
    params.append("order_by", args.orderBy);
  }

  if (args?.direction) {
    params.append("direction", args.direction);
  }

  const queryString = params.toString();

  return `child/meetings${queryString ? `?${queryString}` : ""}`;
};

export const meetingApi = createApi({
  reducerPath: "meetingApi",
  baseQuery: baseQueryConfig,
  tagTypes: ["Meetings", "Meeting", "Teacher", "Reserved"],
  endpoints: (build) => ({
    getMeetings: build.query<
      ApiSuccess<MeetingsListPayloadUI>,
      GetMeetingsArgs | void
    >({
      query: (args) => ({
        url: buildGetMeetingsUrl(args ?? undefined),
        method: MethodsEnum.GET,
      }),
      transformResponse: (
        response: MeetingsCollectionApiResponse
      ): ApiSuccess<MeetingsListPayloadUI> => ({
        message: response.message,
        data: toMeetingsListPayloadUI(response),
      }),
      serializeQueryArgs: ({ endpointName, queryArgs }) => {
        const args: GetMeetingsArgs = queryArgs ?? {};

        return `${endpointName}|${JSON.stringify({
          childId: args.childId ?? null,
          keyword: args.keyword ?? "",
          materialId: args.materialId ?? null,
          teacherId: args.teacherId ?? null,
          hasFreeTrial: args.hasFreeTrial ?? null,
          pagination: args.pagination ?? true,
          perPage: args.perPage ?? 15,
          orderBy: args.orderBy ?? "created_at",
          direction: args.direction ?? "desc",
        })}`;
      },
      merge: (currentCache, newCache, { arg }) => {
        const page = arg?.page ?? 1;

        if (page <= 1 || !currentCache) {
          return newCache;
        }

        const existingIds = new Set(
          currentCache.data.items.map((item) => item.id)
        );

        const mergedItems = [...currentCache.data.items];

        for (const item of newCache.data.items) {
          if (!existingIds.has(item.id)) {
            mergedItems.push(item);
          }
        }

        return {
          ...currentCache,
          data: {
            ...newCache.data,
            items: mergedItems,
          },
        };
      },
      forceRefetch: ({ currentArg, previousArg }) =>
        currentArg?.page !== previousArg?.page,
      providesTags: (result) => {
        const baseTags = [{ type: "Meetings" as const, id: "LIST" }];

        if (!result?.data?.items?.length) {
          return baseTags;
        }

        return [
          ...baseTags,
          ...result.data.items.map((item) => ({
            type: "Meeting" as const,
            id: item.id,
          })),
        ];
      },
    }),

    getMeetingById: build.query<ApiSuccess<MeetingDetailsUI>, number>({
      query: (meetingId) => ({
        url: `child/meetings/${meetingId}`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (
        response: ApiSuccess<MeetingApi>
      ): ApiSuccess<MeetingDetailsUI> => ({
        ...response,
        data: toMeetingDetailsUI(response.data),
      }),
      providesTags: (_result, _error, meetingId) => [
        { type: "Meeting", id: meetingId },
      ],
    }),

    getTeacherById: build.query<
      ApiSuccess<TeacherDetailApi>,
      number
    >({
      query: (teacherId) => ({
        url: `child/teachers/${teacherId}`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (
        response: ApiSuccess<TeacherDetailApi>
      ): ApiSuccess<TeacherDetailApi> => response,
      providesTags: (_result, _error, teacherId) => [
        { type: "Teacher" as const, id: teacherId },
      ],
    }),

    getReservedMeetings: build.query<
      ApiSuccess<MeetingsListPayloadUI>,
      number | void
    >({
      query: () => ({
        url: "child/meetings/reserved",
        method: MethodsEnum.GET,
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return `getReservedMeetings|${queryArgs ?? "default"}`;
      },
      transformResponse: (
        response: MeetingsCollectionApiResponse
      ): ApiSuccess<MeetingsListPayloadUI> => {
        const payload = toMeetingsListPayloadUI(response);
        console.log("[ReservedMeetings] Raw response shape:", JSON.stringify({
          hasData: !!response.data,
          dataIsArray: Array.isArray(response.data),
          dataLength: Array.isArray(response.data) ? response.data.length : "not array",
          firstItemKeys: Array.isArray(response.data) && response.data[0] ? Object.keys(response.data[0]) : [],
          hasGroups: Array.isArray(response.data) && response.data[0] ? ("groups" in (response.data[0] as any)) : false,
          groupsCount: (Array.isArray(response.data) && response.data[0]) ? ((response.data[0] as any)?.groups?.length ?? 0) : 0,
        }, null, 2));
        return {
          message: response.message,
          data: payload,
        };
      },
      providesTags: (result) => {
        const baseTags = [{ type: "Meetings" as const, id: "RESERVED" }];
        if (!result?.data?.items?.length) return baseTags;
        return [
          ...baseTags,
          ...result.data.items.map((item) => ({
            type: "Meeting" as const,
            id: item.id,
          })),
        ];
      },
    }),

    getReservedMeetingTimes: build.query<
      ApiSuccess<ReservedMeetingTimeUI[]>,
      number | void
    >({
      query: () => ({
        url: "child/meetings/reserved/meeting-times",
        method: MethodsEnum.GET,
      }),
      serializeQueryArgs: ({ queryArgs }) => {
        return `getReservedMeetingTimes|${queryArgs ?? "default"}`;
      },
      transformResponse: (
        response: ApiSuccess<ReservedMeetingTimeApi[]>
      ): ApiSuccess<ReservedMeetingTimeUI[]> => ({
        message: response.message,
        data: toReservedMeetingTimesUI(response.data),
      }),
      providesTags: (_result, _error, arg) => [
        { type: "Meetings" as const, id: `RESERVED_TIMES|${arg ?? "default"}` },
      ],
    }),

    subscribeToGroup: build.mutation<
      ApiSuccess<SubscribeToGroupResponse["data"]>,
      SubscribeToGroupArgs
    >({
      query: ({ groupId, billingCycle = "monthly" }) => ({
        url: `child/meeting-groups/${groupId}/subscribe`,
        method: MethodsEnum.POST,
        body: { billing_cycle: billingCycle },
      }),
      invalidatesTags: (_result, _error, { groupId }) => [
        { type: "Meetings", id: "LIST" },
        { type: "Meetings", id: "RESERVED" },
      ],
    }),
  }),
});

export const {
  useGetMeetingsQuery,
  useLazyGetMeetingsQuery,
  useGetMeetingByIdQuery,
  useLazyGetMeetingByIdQuery,
  useGetTeacherByIdQuery,
  useLazyGetTeacherByIdQuery,
  useGetReservedMeetingsQuery,
  useGetReservedMeetingTimesQuery,
  useSubscribeToGroupMutation,
} = meetingApi;