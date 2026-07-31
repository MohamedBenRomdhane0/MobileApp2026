import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";
import type { Ionicons } from "@expo/vector-icons";

export type Nav = NativeStackNavigationProp<RootStackParamList>;

export type PickedAvatar = {
  uri: string;
  name?: string;
  type?: string;
};

export type ParentInfoFormValues = {
  fullName: string;
  phone: string;
  address: string;
};

export type ParentInfoUi = {
  title: string;
  save: string;
  saving: string;
  resetPassword: string;
  avatarChange: string;
  avatarHint: string;

  labels: {
    fullName: string;
    phone: string;
    address: string;
  };

  placeholders: {
    fullName: string;
    phone: string;
    address: string;
  };
};

export type ParentInfoActionKey = "pickAvatar" | "save" | "resetPassword";
export type ParentInfoActionType = "pick" | "submit" | "navigate";

export type ParentInfoAction = {
  key: ParentInfoActionKey;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  action: ParentInfoActionType;
  routeName?: keyof RootStackParamList;
};

export type ParentInfoActionMap = Record<ParentInfoActionKey, ParentInfoAction>;