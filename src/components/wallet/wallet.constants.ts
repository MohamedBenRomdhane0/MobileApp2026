import type { WithSpringConfig } from "react-native-reanimated";

/** Dark navy sheet surface (kept dark in both themes, like the home hero). */
export const WALLET_NAVY = "#171D3A";
export const WALLET_NAVY_CARD = "#1D2447";

/** App teal used as the single wallet accent. */
export const WALLET_CYAN = "#22BEC8";
export const WALLET_CYAN_SOFT = "rgba(34,190,200,0.16)";

export const WALLET_TEXT = "#FFFFFF";
export const WALLET_SUB = "rgba(255,255,255,0.62)";
export const WALLET_HAIRLINE = "rgba(255,255,255,0.10)";
export const WALLET_INPUT_BG = "rgba(255,255,255,0.07)";

/** The four quick recharge amounts shown as selectable cards. */
export const RECHARGE_AMOUNTS = [5, 10, 20, 50] as const;

/** Cyan gradient used by the "Pay now" primary button. */
export const WALLET_BTN_GRADIENT = ["#2AD4DF", "#0E8E9B"] as [string, string];

/** Spring used for sheet presentation and snap transitions. */
export const WALLET_SPRING: WithSpringConfig = {
  damping: 18,
  stiffness: 200,
  mass: 0.9,
  overshootClamping: false,
  energyThreshold: 0.01,
};
