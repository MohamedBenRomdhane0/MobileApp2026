import { ConfigEnv } from "@config/configEnv";
import { ENDPOINTS } from "@config/constants/endpoints";
import { LocalStorageKeysEnum } from "@config/enums/localStorage.enum";
import { MethodsEnum } from "@config/enums/method.enum";
import type { RootState } from "@redux/store";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import {
  clearLocalStorage,
  getFromLocalStorage,
  setToLocalStorage,
} from "@utils/localStorage/storage";
import { Mutex } from "async-mutex";
import i18n from "i18n";

const mutex = new Mutex();
const LOG_PREFIX = "[baseQuery]";

const PUBLIC_ENDPOINT_NAMES = new Set<string>([
  "login",
  "signup",
  "verifyCode",
  "sendResetCode",
  "resetPassword",
  "sendResetPasswordEmail",
  "setPassword",
  "refreshToken",
]);

const FORCE_PARENT_ENDPOINTS = new Set<string>([
  "getParentMe",
  "updateParentProfile",
  "updateProfile",
]);

const FORCE_CHILD_ENDPOINTS = new Set<string>([
  // Removed "getBooks" - now uses parent/books endpoint with parent token
  // "getBookById" still uses child/books/{id} endpoint
]);

function getUrlFromArgs(args: string | FetchArgs): string {
  if (typeof args === "string") return args;
  return String(args?.url ?? "");
}

function normalizeUrl(url: string): string {
  return String(url ?? "").replace(/^\/+/, "");
}

function getScopeFromUrlOrEndpoint(params: {
  url: string;
  endpoint: string;
}): "child" | "parent" | "unknown" {
  const { endpoint } = params;
  const clean = normalizeUrl(params.url);

  if (FORCE_CHILD_ENDPOINTS.has(endpoint)) return "child";
  if (FORCE_PARENT_ENDPOINTS.has(endpoint)) return "parent";

  if (clean.startsWith("child/")) return "child";
  if (clean.startsWith("parent/")) return "parent";

  if (
    clean === "user/profile" ||
    clean.startsWith("user/profile") ||
    clean === "user/me" ||
    clean === "me" ||
    clean.startsWith("user/")
  ) {
    return "parent";
  }

  return "unknown";
}

async function pickTokenForRequest(params: {
  endpoint: string;
  url: string;
  getState: () => unknown;
}) {
  const { endpoint, url, getState } = params;

  const scope = getScopeFromUrlOrEndpoint({ url, endpoint });

  const state = getState() as RootState;
  const auth = state?.auth;

  const parentTokenFromState = auth?.parentAccessToken ?? null;
  const childTokenFromState = auth?.childAccessToken ?? null;
  const activeTokenFromState = auth?.authToken ?? null;

  if (scope === "child") {
    if (childTokenFromState) {
      return childTokenFromState;
    }

    const childTokenFromStorage = await getFromLocalStorage<string>(
      LocalStorageKeysEnum.ChildAccessToken
    );
    if (childTokenFromStorage) {
      return childTokenFromStorage;
    }
    return null;
  }

  if (scope === "parent") {
    if (parentTokenFromState) {
      return parentTokenFromState;
    }

    const parentTokenFromStorage = await getFromLocalStorage<string>(
      LocalStorageKeysEnum.ParentAccessToken
    );
    if (parentTokenFromStorage) {
      return parentTokenFromStorage;
    }

    const fallback = await getFromLocalStorage<string>(
      LocalStorageKeysEnum.AccessToken
    );
    return fallback;
  }

  if (activeTokenFromState) {
    return activeTokenFromState;
  }

  const accessToken = await getFromLocalStorage<string>(
    LocalStorageKeysEnum.AccessToken
  );
  return accessToken;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: String(ConfigEnv.API_ENDPOINT ?? ""),
  prepareHeaders: async (headers) => {
    headers.set("Accept", "application/json");
    headers.set("Accept-Language", i18n.language);
    return headers;
  },
});

const refreshTokenBaseQuery = fetchBaseQuery({
  baseUrl: String(ConfigEnv.API_ENDPOINT ?? ""),
  prepareHeaders: async (headers) => {
    const refreshToken = await getFromLocalStorage<string>(
      LocalStorageKeysEnum.RefreshToken
    );
    if (refreshToken) headers.set("Authorization", `Bearer ${refreshToken}`);

    headers.set("Accept", "application/json");
    headers.set("Accept-Language", i18n.language);

    return headers;
  },
});

export const baseQueryConfig: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const endpoint = api.endpoint;
  const url = getUrlFromArgs(args);

  const isPublic = PUBLIC_ENDPOINT_NAMES.has(endpoint);

  let finalArgs: FetchArgs;
  if (typeof args === "string") finalArgs = { url: args };
  else finalArgs = { ...(args ?? {}) };

  if (!isPublic) {
    const token = await pickTokenForRequest({
      endpoint,
      url,
      getState: api.getState,
    });

    finalArgs.headers = new Headers(finalArgs.headers as any);

    if (token) (finalArgs.headers as any).set("Authorization", `Bearer ${token}`);
  }

  const res = await rawBaseQuery(finalArgs, api, extraOptions);

  if ((res as any)?.error) {
  } else {
  }

  return res;
};

export const baseQueryConfigWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const url = getUrlFromArgs(args);
  const scope = getScopeFromUrlOrEndpoint({ url, endpoint: api.endpoint });

  let result = await baseQueryConfig(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = await getFromLocalStorage<string>(
          LocalStorageKeysEnum.RefreshToken
        );

        if (!refreshToken) {
          await clearLocalStorage();
          return result;
        }

        const refreshResult = await refreshTokenBaseQuery(
          {
            url: ENDPOINTS.REFRESH_TOKEN,
            method: MethodsEnum.POST,
            body: { refresh_token: refreshToken },
          },
          api,
          extraOptions
        );

        const accessToken = (refreshResult.data as any)?.data?.access_token;

        if (accessToken) {
          await setToLocalStorage(LocalStorageKeysEnum.AccessToken, accessToken);

          await setToLocalStorage(LocalStorageKeysEnum.ParentAccessToken, accessToken);

          result = await baseQueryConfig(args, api, extraOptions);
        } else {
          await clearLocalStorage();
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQueryConfig(args, api, extraOptions);
    }
  }

  return result;
};
export const baseQueryWithReauth = baseQueryConfigWithRefresh;