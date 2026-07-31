import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";

export type Nav = NativeStackNavigationProp<RootStackParamList>;

export type SignUpFormValues = {
  fullName: string
  phone: string
  address: string
  password: string
  passwordConfirmation: string
}
