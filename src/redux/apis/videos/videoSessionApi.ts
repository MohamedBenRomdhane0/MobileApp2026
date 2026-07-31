import { createApi } from "@reduxjs/toolkit/query/react";
import { MethodsEnum } from "@config/enums/method.enum";
import { baseQueryConfig } from "@redux/baseQueryConfig";

import type {
  EndVideoSessionArgs,
  EndVideoSessionResponse,
  EndVideoSessionResponseApi,
  GetVideoSessionResponse,
  GetVideoSessionResponseApi,
  StartVideoSessionResponse,
  StartVideoSessionResponseApi,
  UpdateVideoSessionProgressArgs,
  UpdateVideoSessionProgressResponse,
  UpdateVideoSessionProgressResponseApi,
} from "./videoSessionApi.type";

import {
  toEndVideoSessionResponse,
  toGetVideoSessionResponse,
  toStartVideoSessionResponse,
  toUpdateVideoSessionProgressResponse,
} from "./videoSessionApi.transform";

export const videoSessionApi = createApi({
  reducerPath: "videoSessionApi",
  baseQuery: baseQueryConfig,
  tagTypes: ["VideoSession"],
  endpoints: (build) => ({
    startVideoSession: build.mutation<StartVideoSessionResponse, number | string>({
      query: (videoId) => ({
        url: `videos/${videoId}/session/start`,
        method: MethodsEnum.POST,
      }),
      transformResponse: (response: StartVideoSessionResponseApi) =>
        toStartVideoSessionResponse(response),
    }),

    getVideoSession: build.query<
      GetVideoSessionResponse,
      { videoId: number | string; videoDurationSec?: number }
    >({
      query: ({ videoId, videoDurationSec }) => ({
        url:
          videoDurationSec && videoDurationSec > 0
            ? `videos/${videoId}/session?video_duration_sec=${videoDurationSec}`
            : `videos/${videoId}/session`,
        method: MethodsEnum.GET,
      }),
      transformResponse: (response: GetVideoSessionResponseApi) =>
        toGetVideoSessionResponse(response),
      providesTags: (_result, _error, { videoId }) => [
        { type: "VideoSession" as const, id: String(videoId) },
      ],
    }),

    updateVideoSessionProgress: build.mutation<
      UpdateVideoSessionProgressResponse,
      UpdateVideoSessionProgressArgs
    >({
      query: ({ videoId, currentPositionSec, videoDurationSec }) => ({
        url: `videos/${videoId}/session/progress`,
        method: MethodsEnum.POST,
        body: {
          current_position_sec: currentPositionSec,
          ...(videoDurationSec && videoDurationSec > 0
            ? { video_duration_sec: videoDurationSec }
            : {}),
        },
      }),
      transformResponse: (response: UpdateVideoSessionProgressResponseApi) =>
        toUpdateVideoSessionProgressResponse(response),
    }),

    endVideoSession: build.mutation<EndVideoSessionResponse, EndVideoSessionArgs>({
      query: ({ videoId, finalPositionSec }) => ({
        url: `videos/${videoId}/session/end`,
        method: MethodsEnum.POST,
        body: {
          final_position_sec: finalPositionSec,
        },
      }),
      transformResponse: (response: EndVideoSessionResponseApi) =>
        toEndVideoSessionResponse(response),
    }),
  }),
});

export const {
  useStartVideoSessionMutation,
  useLazyGetVideoSessionQuery,
  useUpdateVideoSessionProgressMutation,
  useEndVideoSessionMutation,
} = videoSessionApi;

export default videoSessionApi;