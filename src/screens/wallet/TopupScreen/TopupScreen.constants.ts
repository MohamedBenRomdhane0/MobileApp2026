import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";
import type { PaymentMethod } from "./TopupScreen.type";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type PaymentMethodOption = {
  id: PaymentMethod;
  icon: IconName;
  titleKey: string;
  brandColor: string;
};

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  {
    id: "card",
    icon: "card-outline",
    titleKey: "wallet.credit_debit_card",
    brandColor: "#1A1F71",
  },
  {
    id: "apple_pay",
    icon: "logo-apple",
    titleKey: "wallet.apple_pay",
    brandColor: "#000000",
  },
  {
    id: "google_pay",
    icon: "logo-google",
    titleKey: "wallet.google_pay",
    brandColor: "#4285F4",
  },
];

export const TOPUP_GRADIENT = ["#0B1B33", "#0D2247", "#0B1B33"] as [
  string,
  string,
  string,
];

export const TOPUP_ACCENT = "#22BEC8";
export const TOPUP_CURRENCY = "DT";
