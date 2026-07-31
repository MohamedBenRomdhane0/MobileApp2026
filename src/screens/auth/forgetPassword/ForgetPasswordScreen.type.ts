import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";

export type Nav = NativeStackNavigationProp<RootStackParamList>;
export type ForgetPasswordForm = {
  phone: string;
  code: string;
};
export type Step = 'REQUEST' | 'VERIFY'
export type ForgetPasswordRouteParams = undefined;
