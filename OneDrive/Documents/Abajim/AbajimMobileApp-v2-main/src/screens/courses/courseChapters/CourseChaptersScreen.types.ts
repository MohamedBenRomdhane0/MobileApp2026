import type { RouteProp } from "@react-navigation/native";
import type { CourseChaptersTab } from "./CourseChaptersScreen.constants";

export type CourseChaptersRouteParams = {
  CourseChapters: { courseId: number };
};

export type CourseChaptersRouteProp = RouteProp<CourseChaptersRouteParams, "CourseChapters">;

export type EmptyBlockProps = {
  icon: any;
  text: string;
};

export type TabKey = CourseChaptersTab;