import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";

export type Nav = NativeStackNavigationProp<RootStackParamList>;

export type KidGender = "" | "boy" | "girl";

export type Kid = {
  id?: number | string;
  fullName?: string | null;
  full_name?: string | null;
  gender?: KidGender | string | null;

  levelId?: number | null;
  level_id?: number | null;

  level?: { id?: number | null; name?: string | null } | null;

  user?: {
    id?: number | string;
    fullName?: string | null;
    full_name?: string | null;
    media?: Array<{
      full_url?: string | null;
      url?: string | null;
      file_path?: string | null;
      path?: string | null;
      thumbnail?: string | null;
      tag?: string | null;
    }> | null;
  } | null;
};

export type AddKidsParams =
  | { mode: "create" }
  | {
      mode: "edit";
      childId: number;
      initialFullName?: string;
      initialGender?: KidGender;
      initialLevelId?: number;
    };