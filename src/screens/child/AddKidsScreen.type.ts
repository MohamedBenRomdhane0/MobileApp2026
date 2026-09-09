import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "@config/types/navigation.types";

export type AddKidsMode = "create" | "edit";
export type AddKidsRedirectTo = "TABS_HOME" | "TABS_BOOKS";

export type AddKidsRouteParams = {
  mode?: AddKidsMode;

  childId?: number;
  initialFullName?: string;
  initialGender?: "boy" | "girl";
  initialLevelId?: number;
  initialAvatarPath?: string | null;

  redirectTo?: AddKidsRedirectTo;
};

export type AddKidsForm = {
  fullName: string;
  gender: "boy" | "girl" | "";
  levelId: number | null;
};

export type AddKidsPickedAvatar = {
  uri: string;
  name?: string;
  type?: string;
};

export type AddKidsApiErrorShape = {
  data?: {
    message?: string;
    errors?: Partial<Record<"full_name" | "gender" | "level_id" | "avatar", string[]>>;
  };
};

export type Nav = NativeStackNavigationProp<RootStackParamList>;
export type AddKidsRoute = RouteProp<RootStackParamList, any>;