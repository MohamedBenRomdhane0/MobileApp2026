export type CoursesRouteParams = {
  levelId?: number;
  materialId?: number;
  materialName?: string;
};

export type ToggleFavArg = {
  courseId: number;
  queryKey?: string;
};