export type MaterialHubTabKey = "exercises" | "live" | "lessons" | "book";

export type MaterialHubRouteParams = {
  levelId: number;
  materialId: number;
  materialName?: string;
};