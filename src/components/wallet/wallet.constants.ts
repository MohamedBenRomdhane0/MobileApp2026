import type { WithSpringConfig } from "react-native-reanimated";

/** Abajim blue sheet surface — dark-to-cyan gradient. */
export const WALLET_NAVY = "#0B1B33";
export const WALLET_CYAN = "#22BEC8";
export const WALLET_GRADIENT = [WALLET_NAVY, WALLET_CYAN] as const;
export const WALLET_NAVY_CARD = "rgba(11,27,51,0.55)";

/** Abajim blue accent for primary actions. */
export const WALLET_PURPLE = "#22BEC8";
export const WALLET_PURPLE_SOFT = "rgba(34,190,200,0.18)";

export const WALLET_CYAN_SOFT = "rgba(34,190,200,0.16)";

export const WALLET_TEXT = "#FFFFFF";
export const WALLET_SUB = "rgba(255,255,255,0.55)";
export const WALLET_HAIRLINE = "rgba(255,255,255,0.10)";
export const WALLET_INPUT_BG = "rgba(255,255,255,0.06)";

/** Preset recharge amounts shown as chips. */
export const RECHARGE_AMOUNTS = [50, 100, 500, 1000] as const;

/** Recognized card networks for the live brand badge. */
export type CardBrand = "visa" | "mastercard" | null;

/** Detect the card network from the first digits of the card number. */
export function getCardBrand(value: string): CardBrand {
  const digits = value.replace(/[^0-9]/g, "");
  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]|^2[2-7]/.test(digits)) return "mastercard";
  return null;
}

/** Blue gradient for the swipe-to-topup button. */
export const WALLET_SWIPE_GRADIENT = [
  "#0B1B33",
  "#22BEC8",
  "#0B1B33",
] as [string, string, string];

/** Blue gradient for the "Pay now" primary button. */
export const WALLET_BTN_GRADIENT = ["#22BEC8", "#15A0B0"] as [string, string];

/** Gradient for the saved-card display. */
export const WALLET_CARD_GRADIENT = [
  "#152F57",
  "#0B1B33",
  "#060F22",
] as [string, string, string];

/** Spring used for sheet presentation and snap transitions. */
export const WALLET_SPRING: WithSpringConfig = {
  damping: 18,
  stiffness: 200,
  mass: 0.9,
  overshootClamping: false,
  energyThreshold: 0.01,
};
