import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";
import type { PATHS } from "@config/constants/paths";

export type TopupScreenProps = NativeStackScreenProps<
  RootStackParamList,
  typeof PATHS.APP.TOPUP
>;

export type PaymentMethod = "card" | "apple_pay" | "google_pay";

export type TopupStep = "select" | "card_form" | "apple_pay" | "google_pay";
