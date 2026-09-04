import type { CheckoutMethod } from "./CheckoutScreen.type";

export const CHECKOUT_GRADIENT = ["#0D2A52", "#163867", "#1A4A82"] as const;

export const CTA_GRADIENT = ["#22BEC8", "#1aa8b0"] as const;

export const BAQA_ACCENT = "#8B5CF6";
export const TRANSFER_ACCENT = "#22BEC8";

export const BAQA_CODE_LENGTH = 8;

export const BANK_INFO = {
  beneficiary: "SOCIETE ABAJIM",
  rib: "04204067008666779780",
  bank: "البنك التجاري",
} as const;

export const CHECKOUT_METHODS: {
  id: CheckoutMethod;
  titleKey: string;
  descKey: string;
  icon: "card-outline" | "swap-horizontal-outline";
  accent: string;
}[] = [
  {
    id: "baqa",
    titleKey: "plan.baqa_title",
    descKey: "plan.baqa_desc",
    icon: "card-outline",
    accent: BAQA_ACCENT,
  },
  {
    id: "transfer",
    titleKey: "plan.transfer_title",
    descKey: "plan.transfer_desc",
    icon: "swap-horizontal-outline",
    accent: TRANSFER_ACCENT,
  },
] as const;
