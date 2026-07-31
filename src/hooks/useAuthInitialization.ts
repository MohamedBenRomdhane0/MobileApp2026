import { useEffect, useState } from "react";
import { useAppDispatch } from "@redux/hooks";
import { restoreSession } from "@redux/slices/authSlice";
import { getFromLocalStorage } from "@utils/localStorage/storage";
import { LocalStorageKeysEnum } from "@config/enums/localStorage.enum";
import { useLazyGetParentMeQuery } from "@redux/apis/parent/parentApi";

export const useAuthInitialization = () => {
  const [isReady, setIsReady] = useState(false);
  const dispatch = useAppDispatch();
  const [triggerGetParentMe] = useLazyGetParentMeQuery();

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const [accessToken, parentToken, childToken, user, refreshToken, savedActiveChildId] =
          await Promise.all([
            getFromLocalStorage<string>(LocalStorageKeysEnum.AccessToken, false),
            getFromLocalStorage<string>(
              LocalStorageKeysEnum.ParentAccessToken,
              false
            ),
            getFromLocalStorage<string>(
              LocalStorageKeysEnum.ChildAccessToken,
              false
            ),
            getFromLocalStorage<any>(LocalStorageKeysEnum.User, true),
            getFromLocalStorage<string>(LocalStorageKeysEnum.RefreshToken, false),
            getFromLocalStorage<string>(LocalStorageKeysEnum.ActiveChildId, false),
          ]);

        const tokenToUse = parentToken || accessToken;
        const parsedChildId = savedActiveChildId ? Number(savedActiveChildId) : 0;

        if (tokenToUse && user) {
          dispatch(
            restoreSession({
              user,
              accessToken: tokenToUse,
              refreshToken: refreshToken ?? null,
              activeChildId: Number.isFinite(parsedChildId) && parsedChildId > 0 ? parsedChildId : null,
            })
          );

          void triggerGetParentMe();
        }
      } finally {
        setIsReady(true);
      }
    };

    bootstrapAsync();
  }, [dispatch, triggerGetParentMe]);

  return isReady;
};