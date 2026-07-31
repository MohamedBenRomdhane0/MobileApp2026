import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import {
  useFollowTeacherMutation,
  useGetTeacherByIdQuery,
  useGetTeacherFollowersQuery,
} from "@redux/apis/teachers/teacherApi";

import {
  mapFollowers,
  mapTeacherProfileVM,
} from "@utils/helpers/teacherProfile.helpers";

export function useTeacherProfileViewModel(
  teacherId: number,
  isFollowersVisible: boolean
) {
  const { t } = useTranslation();

  const {
    data: teacherResp,
    isFetching: isTeacherLoading,
    isError: isTeacherError,
    refetch: refetchTeacher,
  } = useGetTeacherByIdQuery(teacherId, {
    skip: !teacherId,
  });

  const {
    data: followersResp,
    isFetching: isFollowersLoading,
    isError: isFollowersError,
    refetch: refetchFollowers,
  } = useGetTeacherFollowersQuery(
    { teacherId, page: 1, per_page: 20 },
    { skip: !teacherId || !isFollowersVisible }
  );

  const [followTeacher, { isLoading: isFollowing }] = useFollowTeacherMutation();

  const teacher = mapTeacherProfileVM(teacherResp?.data ?? null, t);
  const followers = mapFollowers(
    Array.isArray(followersResp?.data) ? followersResp.data : []
  );

  const onToggleFollow = useCallback(async () => {
    if (!teacherId || isFollowing) {
      return false;
    }

    try {
      await followTeacher(teacherId).unwrap();
      await refetchTeacher();

      if (isFollowersVisible) {
        await refetchFollowers();
      }

      return true;
    } catch {
      return false;
    }
  }, [
    followTeacher,
    isFollowersVisible,
    isFollowing,
    refetchFollowers,
    refetchTeacher,
    teacherId,
  ]);

  return {
    teacher,
    followers,
    isTeacherLoading,
    isTeacherError,
    refetchTeacher,
    isFollowersLoading,
    isFollowersError,
    refetchFollowers,
    isFollowing,
    onToggleFollow,
  };
}