import { useCallback, useMemo, useState } from "react";

import { useEnsureChildSession } from "@hooks/useEnsureChildSession";
import { useGetMeetingsQuery } from "@redux/apis/meetings/meetingApi";
import { useGetMaterialsByLevelQuery } from "@redux/apis/materials/materialsApi";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { pickLevelIdFromChild } from "@utils/helpers/level.helper";

import type { MaterialUI } from "@redux/apis/materials/materialsApi.type";
import type { MeetingsScreenMeetingItem } from "@screens/meetings/MeetingsScreen.type";
import type { SelectedTeachers } from "@screens/trailers/TrailersScreen.type";
import { buildTrailerItems, toValidId } from "@utils/helpers/trailers.helpers";

export function useTrailersScreen() {
  const { isChildReady } = useEnsureChildSession();
  const headerData = useActiveChildHeaderData();

  const levelId = useMemo(
    () => toValidId(pickLevelIdFromChild(headerData?.child)),
    [headerData?.child]
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetMeetingsQuery(
    {
      page: 1,
      perPage: 100,
      pagination: true,
      orderBy: "created_at",
      direction: "desc",
    },
    {
      skip: !isChildReady,
      refetchOnMountOrArgChange: true,
    }
  );

  const { data: materialsData } = useGetMaterialsByLevelQuery(
    { levelId },
    { skip: !levelId }
  );

  const meetings = useMemo<MeetingsScreenMeetingItem[]>(() => {
    const raw = data?.data?.items ?? data?.data ?? [];
    return Array.isArray(raw) ? (raw as MeetingsScreenMeetingItem[]) : [];
  }, [data]);

  const trailerItems = useMemo(() => buildTrailerItems(meetings), [meetings]);

  const materials = useMemo<MaterialUI[]>(
    () => (Array.isArray(materialsData) ? materialsData : []),
    [materialsData]
  );

  const [activeMaterialId, setActiveMaterialId] = useState<number>(0);
  const [selectedTeachers, setSelectedTeachers] = useState<SelectedTeachers>({});

  const filteredItems = useMemo(() => {
    if (activeMaterialId === 0) {
      return trailerItems;
    }

    return trailerItems.filter((item) => item.materialId === activeMaterialId);
  }, [activeMaterialId, trailerItems]);

  const selectedCount = useMemo(
    () => Object.values(selectedTeachers).filter(Boolean).length,
    [selectedTeachers]
  );

  const toggleTeacher = useCallback((meetingId: number) => {
    setSelectedTeachers((prev) => ({
      ...prev,
      [meetingId]: !prev[meetingId],
    }));
  }, []);

  return {
    levelId,
    materials,
    filteredItems,
    activeMaterialId,
    selectedTeachers,
    selectedCount,
    setActiveMaterialId,
    toggleTeacher,
    isLoading,
    isError,
    refetch,
  };
}