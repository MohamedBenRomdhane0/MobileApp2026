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
} from "./meetingApi.type";

import {
  toMeetingDetailsUI,
  toMeetingsListPayloadUI,
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
  tagTypes: ["Meetings", "Meeting"],
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

        if (page <= 1) {
          currentCache.data = newCache.data;
          return;
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

        currentCache.data = {
          ...newCache.data,
          items: mergedItems,
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
  }),
});

export const {
  useGetMeetingsQuery,
  useLazyGetMeetingsQuery,
  useGetMeetingByIdQuery,
  useLazyGetMeetingByIdQuery,
} = meetingApi;