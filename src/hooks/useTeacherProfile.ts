import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useFollowTeacherMutation,
  useGetTeacherByIdQuery,
  useGetTeacherFollowersQuery,
} from "@redux/apis/teachers/teacherApi";

import type { FollowerVM, TeacherProfileVM } from "@screens/teacher/TeacherProfileScreen.type";
import { mapFollowers, mapTeacherProfileVM, toValidId } from "@utils/helpers/teacherProfile.helpers";

export type UseTeacherProfileResult = {
  teacherVM: TeacherProfileVM | null;
  showLoading: boolean;
  isError: boolean;
  refetchTeacher: () => any;

  isFollowing: boolean;
  onToggleFollow: () => Promise<void>;

  followersModalVisible: boolean;
  openFollowers: () => void;
  closeFollowers: () => void;

  followersVM: FollowerVM[];
  isFollowersLoading: boolean;
  isFollowersError: boolean;
  refetchFollowers: () => any;
};

export function useTeacherProfile(teacherIdInput: number): UseTeacherProfileResult {
  const teacherId = toValidId(teacherIdInput);
  const { t } = useTranslation();

  const [followersModalVisible, setFollowersModalVisible] = useState(false);

  const {
    data: teacherResp,
    isLoading,
    isFetching,
    isError,
    refetch: refetchTeacher,
  } = useGetTeacherByIdQuery(teacherId, { skip: !teacherId });

  const teacherVM = useMemo(() => {
    const raw = teacherResp?.data ?? null;
    return raw ? mapTeacherProfileVM(raw, t) : null;
  }, [teacherResp?.data]);

  const showLoading = isLoading || (isFetching && !teacherVM);

  const [followTeacher, { isLoading: isFollowing }] = useFollowTeacherMutation();

  const onToggleFollow = useCallback(async () => {
    if (!teacherId) return;
    try {
      await followTeacher(teacherId).unwrap();
    } catch (e) {
      console.error("[useTeacherProfile] followTeacher failed", e);
    }
  }, [followTeacher, teacherId]);

  const {
    data: followersResp,
    isFetching: isFollowersLoading,
    isError: isFollowersError,
    refetch: refetchFollowers,
  } = useGetTeacherFollowersQuery(
    { teacherId, page: 1, perPage: 50 },
    { skip: !teacherId || !followersModalVisible }
  );

  const followersVM: FollowerVM[] = useMemo(
    () => mapFollowers(followersResp?.data ?? []),
    [followersResp?.data]
  );

  const openFollowers = useCallback(() => setFollowersModalVisible(true), []);
  const closeFollowers = useCallback(() => setFollowersModalVisible(false), []);

  return {
    teacherVM,
    showLoading,
    isError: Boolean(isError),
    refetchTeacher,

    isFollowing,
    onToggleFollow,

    followersModalVisible,
    openFollowers,
    closeFollowers,

    followersVM,
    isFollowersLoading,
    isFollowersError: Boolean(isFollowersError),
    refetchFollowers,
  };
}