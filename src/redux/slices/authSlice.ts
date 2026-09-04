import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@redux/store";
import { authApi } from "@redux/apis/auth/authApi";
import { childApi } from "@redux/apis/child/childApi";
import { parentApi } from "@redux/apis/parent/parentApi";
import { LocalStorageKeysEnum } from "@config/enums/localStorage.enum";
import {
  removeFromLocalStorage,
  setToLocalStorage,
} from "@utils/localStorage/storage";

export type AuthUser = {
  id: number;
  fullName: string;
  phone: string;
  children: any[];
  avatarPath?: string | null;
};

type AuthState = {
  user: AuthUser | null;
  parentUser: AuthUser | null;
  media: string | null;
  isAuthenticated: boolean;
  authToken: string | null;
  parentAccessToken: string | null;
  childAccessToken: string | null;
  refreshToken: string | null;
  pendingSignupUserId: number | null;
  pendingResetUserId: number | null;
  activeChildId: number | null;
  actingAs: "parent" | "child";
};

const initialState: AuthState = {
  user: null,
  parentUser: null,
  media: null,
  isAuthenticated: false,
  authToken: null,
  parentAccessToken: null,
  childAccessToken: null,
  refreshToken: null,
  pendingSignupUserId: null,
  pendingResetUserId: null,
  activeChildId: null,
  actingAs: "parent",
};

const toNumberId = (v: any) => {
  const n = Number(v ?? 0);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

const normalizeFullName = (u: any) =>
  String(u?.fullName ?? u?.full_name ?? u?.name ?? "").trim();

const normalizeAvatarPath = (u: any) =>
  (u?.avatarPath ?? u?.avatar ?? u?.avatar_path ?? null) as string | null;

const normalizeChildren = (u: any) =>
  (Array.isArray(u?.children) ? u.children : []) as any[];

const normalizePhone = (u: any) => String(u?.phone ?? "").trim();

const pickAvatarPathFromMedia = (media: any[] | undefined): string | null => {
  if (!Array.isArray(media) || media.length === 0) return null;
  const picked =
    media.find((m) => String(m?.tag).toLowerCase() === "avatar") ?? media[0];
  return (picked?.file_path ?? picked?.thumbnail ?? null) as string | null;
};

const toParentUser = (raw: any): AuthUser => ({
  id: toNumberId(raw?.id),
  fullName: normalizeFullName(raw),
  phone: normalizePhone(raw),
  children: normalizeChildren(raw),
  avatarPath: normalizeAvatarPath(raw) ?? pickAvatarPathFromMedia(raw?.media),
});

const toChildUser = (raw: any): AuthUser => ({
  id: toNumberId(raw?.id),
  fullName: normalizeFullName(raw),
  phone: "",
  children: [],
  avatarPath: normalizeAvatarPath(raw) ?? pickAvatarPathFromMedia(raw?.media),
});

const getFirstChildId = (parent: AuthUser | null) => {
  const first = parent?.children?.[0];
  const id = toNumberId(first?.id);
  return id > 0 ? id : null;
};

const pickToken = (data: any) =>
  (data?.accessToken ??
    data?.access_token ??
    data?.token ??
    data?.accessToken?.token ??
    null) as string | null;

const getChildIdFromArg = (meta: any): number | null => {
  const id = meta?.arg?.originalArgs?.childId;
  return typeof id === "number" && id > 0 ? id : null;
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.parentUser = null;
      state.media = null;
      state.authToken = null;
      state.parentAccessToken = null;
      state.childAccessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.pendingSignupUserId = null;
      state.pendingResetUserId = null;
      state.activeChildId = null;
      state.actingAs = "parent";

      removeFromLocalStorage(LocalStorageKeysEnum.ChildAccessToken);
    },

    restoreSession(
      state,
      action: PayloadAction<{
        user: AuthUser;
        accessToken: string;
        refreshToken?: string | null;
        activeChildId?: number | null;
      }>
    ) {
      const { user, accessToken, refreshToken, activeChildId } = action.payload;

      state.parentUser = user;
      state.user = user;
      state.media = user?.avatarPath ?? null;

      state.parentAccessToken = accessToken;
      state.authToken = accessToken;

      state.refreshToken = refreshToken ?? null;
      state.isAuthenticated = true;
      state.actingAs = "parent";

      if (activeChildId) {
        state.activeChildId = activeChildId;
      } else {
        state.activeChildId = state.activeChildId ?? getFirstChildId(user);
      }
    },

    setPendingSignupUserId(state, action: PayloadAction<number | null>) {
      state.pendingSignupUserId = action.payload;
    },

    setPendingResetUserId(state, action: PayloadAction<number | null>) {
      state.pendingResetUserId = action.payload;
    },

    setActiveChildId(state, action: PayloadAction<number | null>) {
      state.activeChildId = action.payload;
    },

    setActingAs(state, action: PayloadAction<"parent" | "child">) {
      state.actingAs = action.payload;

      if (action.payload === "parent") {
        state.user = state.parentUser;
        state.media = state.parentUser?.avatarPath ?? null;
        state.authToken = state.parentAccessToken ?? state.authToken;
      } else {
        state.user = state.parentUser;
        state.media = state.parentUser?.avatarPath ?? null;
        state.authToken = state.childAccessToken ?? state.authToken;
      }
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, { payload }) => {
      const data: any = payload?.data ?? {};
      const parent = toParentUser(data.user);
      const token = pickToken(data);

      state.parentUser = parent;
      state.user = parent;
      state.media = parent.avatarPath ?? null;

      state.parentAccessToken = token;
      state.authToken = token;
      state.childAccessToken = null;

      state.refreshToken = (data.refreshToken ?? data.refresh_token ?? null) as any;
      state.isAuthenticated = true;
      state.actingAs = "parent";
      state.activeChildId = getFirstChildId(parent);

      removeFromLocalStorage(LocalStorageKeysEnum.ChildAccessToken);
    });

    builder.addMatcher(authApi.endpoints.verifyCode.matchFulfilled, (state, { payload }) => {
      const data: any = payload?.data ?? {};
      const parent = toParentUser(data.user);
      const token = pickToken(data);

      state.parentUser = parent;
      state.user = parent;
      state.media = parent.avatarPath ?? null;

      state.parentAccessToken = token;
      state.authToken = token;
      state.childAccessToken = null;

      state.refreshToken = (data.refreshToken ?? data.refresh_token ?? null) as any;
      state.isAuthenticated = true;
      state.actingAs = "parent";

      state.pendingSignupUserId = null;
      state.pendingResetUserId = null;
      state.activeChildId = getFirstChildId(parent);

      removeFromLocalStorage(LocalStorageKeysEnum.ChildAccessToken);
    });

    builder.addMatcher(childApi.endpoints.switchToChild.matchFulfilled, (state, { payload }) => {
      const data: any = payload?.data ?? {};
      const child = toChildUser(data.user ?? data.child);
      const token = pickToken(data);

      state.childAccessToken = token;
      state.authToken = token;

      state.isAuthenticated = true;
      state.actingAs = "child";
      state.activeChildId = child.id || state.activeChildId;

      // Update parent's children array with full child data (including profile/level)
      if (state.parentUser && (data.user || data.child)) {
        const childId = child.id || state.activeChildId;
        const children = state.parentUser.children || [];
        const childIndex = children.findIndex((c: any) =>
          String(c?.id ?? c?.user?.id) === String(childId)
        );

        if (childIndex >= 0) {
          // Merge the full child data from API response into the children array
          state.parentUser.children[childIndex] = {
            ...children[childIndex],
            ...(data.user ?? data.child),
          };
        } else if (data.user || data.child) {
          // If child not found in array, add it
          state.parentUser.children.push(data.user ?? data.child);
        }
      }

      state.user = state.parentUser;
      state.media = state.parentUser?.avatarPath ?? null;

      if (token) setToLocalStorage(LocalStorageKeysEnum.ChildAccessToken, token);
      if (state.activeChildId) setToLocalStorage(LocalStorageKeysEnum.ActiveChildId, String(state.activeChildId));
    });

    builder.addMatcher(childApi.endpoints.switchToParent.matchFulfilled, (state, { payload }) => {
      const data: any = payload?.data ?? {};
      const parent = toParentUser(data.user);
      const tokenFromApi = pickToken(data);

      state.parentUser = parent;
      state.user = parent;
      state.media = parent.avatarPath ?? null;

      state.parentAccessToken = tokenFromApi ?? state.parentAccessToken;
      state.authToken = tokenFromApi ?? state.parentAccessToken ?? state.authToken;

      state.childAccessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = true;
      state.actingAs = "parent";

      const stillExists = parent.children?.some(
        (c: any) => String(c?.id) === String(state.activeChildId)
      );

      if (!stillExists) state.activeChildId = getFirstChildId(parent);

      removeFromLocalStorage(LocalStorageKeysEnum.ChildAccessToken);
    });

    builder.addMatcher(
      parentApi.endpoints.updateParentProfile.matchFulfilled,
      (state, { payload }) => {
        const p: any = payload as any;

        const raw =
          p?.data?.user ??
          p?.data ??
          p?.user ??
          null;

        if (!raw) return;

        const parent = toParentUser(raw);
        state.parentUser = parent;

        if (state.actingAs === "parent") {
          state.user = parent;
          state.media = parent.avatarPath ?? null;
        } else {
          if (parent.avatarPath) state.media = parent.avatarPath;
        }
      }
    );
    builder.addMatcher(parentApi.endpoints.getParentMe.matchFulfilled, (state, { payload }) => {
      const p: any = payload as any;
      const raw = p?.data?.user ?? p?.data ?? p?.user ?? null;
      if (!raw) return;

      const parent = toParentUser(raw);
      state.parentUser = parent;

      if (state.actingAs === "parent") {
        state.user = parent;
        state.media = parent.avatarPath ?? null;
      } else {
        if (parent.avatarPath) state.media = parent.avatarPath;
      }
    });
    builder.addMatcher(childApi.endpoints.createChild.matchFulfilled, (state, { payload }) => {
      if (!state.parentUser) return;

      const child = (payload as any)?.data?.child ?? null;
      if (!child) return;

      const childId = toNumberId(child?.id);
      if (!childId) return;

      const existing = Array.isArray(state.parentUser.children)
        ? state.parentUser.children
        : [];

      const idx = existing.findIndex((c: any) => String(c?.id) === String(childId));
      state.parentUser.children =
        idx >= 0
          ? existing.map((c: any, i: number) => (i === idx ? { ...c, ...child } : c))
          : [...existing, child];

      if (state.actingAs === "parent") state.user = state.parentUser;
      if (!state.activeChildId) {
        state.activeChildId = childId;
        setToLocalStorage(
          LocalStorageKeysEnum.ActiveChildId,
          String(childId)
        );
      }
    });

    builder.addMatcher(childApi.endpoints.updateChild.matchFulfilled, (state, { payload, meta }) => {
      if (!state.parentUser) return;

      const targetUserId = getChildIdFromArg(meta);
      const updated = (payload as any)?.data?.child ?? null;

      const userId = toNumberId(updated?.id) || targetUserId;
      if (!userId) return;

      const existing = Array.isArray(state.parentUser.children)
        ? state.parentUser.children
        : [];
      const idx = existing.findIndex((c: any) => String(c?.id) === String(userId));
      if (idx < 0) return;

      const prev = existing[idx] ?? {};
      const merged: any = { ...prev, ...updated };

      const nextName = updated?.fullName ?? updated?.full_name;
      if (typeof nextName === "string" && nextName.trim()) {
        merged.fullName = nextName;
        merged.full_name = nextName;
      }

      const nextGender = updated?.gender;
      if (typeof nextGender === "string" && nextGender) {
        merged.gender = nextGender;
        merged.child_profile = merged.child_profile ?? {};
        merged.child_profile.gender = merged.child_profile.gender ?? nextGender;
      }

      state.parentUser.children = existing.map((c: any, i: number) =>
        i === idx ? merged : c
      );

      if (state.actingAs === "parent") state.user = state.parentUser;
    });

    builder.addMatcher(childApi.endpoints.deleteChild.matchFulfilled, (state, { meta }) => {
      if (!state.parentUser) return;

      const argId = getChildIdFromArg(meta);
      if (!argId) return;

      const existing = Array.isArray(state.parentUser.children)
        ? state.parentUser.children
        : [];

      const next = existing.filter((c: any) => {
        const userId = String(c?.id ?? "");
        const profileId = String(c?.child_profile?.id ?? c?.childProfile?.id ?? "");
        return userId !== String(argId) && profileId !== String(argId);
      });

      state.parentUser.children = next;

      const stillExists = next.some((c: any) => String(c?.id) === String(state.activeChildId));
      if (!stillExists) state.activeChildId = getFirstChildId(state.parentUser);

      if (state.actingAs === "parent") state.user = state.parentUser;
    });
  },
});

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectParentUser = (state: RootState) => state.auth.parentUser;
export const selectActiveChildId = (state: RootState) => state.auth.activeChildId;
export const selectActingAs = (state: RootState) => state.auth.actingAs;
export const selectPendingSignupUserId = (state: RootState) => state.auth.pendingSignupUserId;
export const selectPendingResetUserId = (state: RootState) => state.auth.pendingResetUserId;

export const {
  logout,
  restoreSession,
  setPendingSignupUserId,
  setPendingResetUserId,
  setActiveChildId,
  setActingAs,
} = authSlice.actions;

export default authSlice.reducer;