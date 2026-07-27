import { createListenerMiddleware } from "@reduxjs/toolkit";
import { authApi } from "@redux/apis/auth/authApi";
import { childApi } from "@redux/apis/child/childApi";
import { logout } from "../slices/authSlice";
import {
  setToLocalStorage,
  clearLocalStorage,
  removeFromLocalStorage,
} from "@utils/localStorage/storage";
import { LocalStorageKeysEnum } from "@config/enums/localStorage.enum";

export const authListenerMiddleware = createListenerMiddleware();

type ApiData = Record<string, any>;

async function persistSession(params: {
  mode: "parent" | "child";
  accessToken: string;
  refreshToken?: string | null;
  user: unknown;
}) {
  const { mode, accessToken, refreshToken, user } = params;

  await setToLocalStorage(LocalStorageKeysEnum.AccessToken, accessToken);

  if (mode === "parent") {
    await Promise.all([
      setToLocalStorage(LocalStorageKeysEnum.User, user, true),
      setToLocalStorage(LocalStorageKeysEnum.ParentAccessToken, accessToken),
    ]);
  } else {
    await setToLocalStorage(LocalStorageKeysEnum.ChildAccessToken, accessToken);
  }

  if (refreshToken) {
    await setToLocalStorage(LocalStorageKeysEnum.RefreshToken, refreshToken);
  } else if (mode === "parent") {
    await removeFromLocalStorage(LocalStorageKeysEnum.RefreshToken);
  }
}

const pickToken = (data: ApiData): string | null =>
  (data?.accessToken ??
    data?.access_token ??
    data?.token ??
    data?.accessToken?.token ??
    null) as string | null;

authListenerMiddleware.startListening({
  matcher: authApi.endpoints.login.matchFulfilled,
  effect: async (action) => {
    const data: ApiData = action.payload?.data ?? {};
    const accessToken = pickToken(data);
    const refreshToken = (data?.refreshToken ?? data?.refresh_token ?? null) as
      | string
      | null;
    const user = data?.user;

    try {
      if (accessToken && user) {
        await persistSession({ mode: "parent", accessToken, refreshToken, user });
      }
    } catch (error) {
      console.error("Failed to save auth session (login)", error);
    }
  },
});

authListenerMiddleware.startListening({
  matcher: authApi.endpoints.signup.matchFulfilled,
  effect: async (action) => {
    const userId = (action.payload as any)?.data?.userId;

    try {
      if (typeof userId === "number") {
        await setToLocalStorage(LocalStorageKeysEnum.PendingUserId, userId);
      }
    } catch (error) {
      console.error("Failed to save pending signup userId", error);
    }
  },
});

authListenerMiddleware.startListening({
  matcher: authApi.endpoints.verifyCode.matchFulfilled,
  effect: async (action) => {
    const data: ApiData = action.payload?.data ?? {};
    const accessToken = pickToken(data);
    const refreshToken = (data?.refreshToken ?? data?.refresh_token ?? null) as
      | string
      | null;
    const user = data?.user;

    try {
      if (accessToken && user) {
        await persistSession({ mode: "parent", accessToken, refreshToken, user });
      }

      await Promise.all([
        removeFromLocalStorage(LocalStorageKeysEnum.PendingUserId),
        removeFromLocalStorage(LocalStorageKeysEnum.PendingResetUserId),
      ]);
    } catch (error) {
      console.error("Failed to handle verifyCode success", error);
    }
  },
});

authListenerMiddleware.startListening({
  matcher: authApi.endpoints.sendResetCode.matchFulfilled,
  effect: async (action) => {
    const userId = (action.payload as any)?.data?.userId;

    try {
      if (typeof userId === "number") {
        await setToLocalStorage(LocalStorageKeysEnum.PendingResetUserId, userId);
      }
    } catch (error) {
      console.error("Failed to save pending reset userId", error);
    }
  },
});

authListenerMiddleware.startListening({
  matcher: authApi.endpoints.resetPassword.matchFulfilled,
  effect: async () => {
    try {
      await removeFromLocalStorage(LocalStorageKeysEnum.PendingResetUserId);
    } catch (error) {
      console.error("Failed to clear pending reset userId", error);
    }
  },
});

authListenerMiddleware.startListening({
  actionCreator: logout,
  effect: async () => {
    try {
      await clearLocalStorage();
    } catch (error) {
      console.error("Failed to clear storage (logout)", error);
    }
  },
});

authListenerMiddleware.startListening({
  matcher: childApi.endpoints.switchToChild.matchFulfilled,
  effect: async (action) => {
    const data: ApiData = action.payload?.data ?? {};
    const accessToken = pickToken(data);
    const user = data?.user ?? data?.child;

    try {
      if (accessToken && user) {
        await persistSession({
          mode: "child",
          accessToken,
          refreshToken: null,
          user,
        });

        const childId = Number(user?.id ?? 0);
        if (childId > 0) {
          await setToLocalStorage(LocalStorageKeysEnum.ActiveChildId, String(childId));
        }
      }
    } catch (error) {
      console.error("Failed to handle switchToChild success", error);
    }
  },
});

authListenerMiddleware.startListening({
  matcher: childApi.endpoints.switchToParent.matchFulfilled,
  effect: async (action) => {
    const data: ApiData = action.payload?.data ?? {};
    const accessToken = pickToken(data);
    const user = data?.user;

    try {
      if (accessToken && user) {
        await persistSession({
          mode: "parent",
          accessToken,
          refreshToken: null,
          user,
        });
      }

      await removeFromLocalStorage(LocalStorageKeysEnum.ActiveChildId);
    } catch (error) {
      console.error("Failed to handle switchToParent success", error);
    }
  },
});