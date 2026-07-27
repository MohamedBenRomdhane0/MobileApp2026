import { useEffect, useRef, useState } from "react";

import { useAppSelector } from "@redux/hooks";
import { useSwitchToChildMutation } from "@redux/apis/child/childApi";
import { selectActiveChildId } from "@redux/slices/authSlice";

export function useEnsureChildSession() {
  const activeChildId = useAppSelector(selectActiveChildId);
  const childAccessToken = useAppSelector((state) => state.auth.childAccessToken);

  const [switchToChild, { isLoading }] = useSwitchToChildMutation();
  const [isRequestPending, setIsRequestPending] = useState(false);

  const lastRequestedChildIdRef = useRef<number | null>(null);
  const canSwitch = typeof activeChildId === "number" && activeChildId > 0;

  useEffect(() => {
    if (!canSwitch) {
      lastRequestedChildIdRef.current = null;
      setIsRequestPending(false);
      return;
    }

    if (childAccessToken) {
      lastRequestedChildIdRef.current = activeChildId;
      setIsRequestPending(false);
      return;
    }

    if (isLoading) return;
    if (lastRequestedChildIdRef.current === activeChildId && isRequestPending) return;

    lastRequestedChildIdRef.current = activeChildId;
    setIsRequestPending(true);

    switchToChild({ childId: activeChildId })
      .unwrap()
      .finally(() => {
        setIsRequestPending(false);
      })
      .catch(() => {
        if (lastRequestedChildIdRef.current === activeChildId) {
          lastRequestedChildIdRef.current = null;
        }
      });
  }, [
    activeChildId,
    canSwitch,
    childAccessToken,
    isLoading,
    isRequestPending,
    switchToChild,
  ]);

  return {
    activeChildId,
    canSwitch,
    isChildReady: canSwitch && !!childAccessToken,
    isEnsuringChildSession: canSwitch && !childAccessToken && (isLoading || isRequestPending),
  };
}