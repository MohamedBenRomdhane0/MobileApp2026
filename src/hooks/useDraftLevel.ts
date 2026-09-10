import { useAppSelector } from "@redux/hooks";
import { selectIsDraftMode, selectDraftLevelId } from "@redux/slices/authSlice";

export const useDraftLevel = () => {
  const isDraftMode = useAppSelector(selectIsDraftMode);
  const draftLevelId = useAppSelector(selectDraftLevelId);

  return { isDraftMode, draftLevelId };
};
