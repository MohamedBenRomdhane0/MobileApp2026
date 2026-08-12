import { LIQUID } from "@styles/liquidTheme";

const MIN_INSET = 6;
const BOTTOM_ADJUSTMENT = -15;

/**
 * Distance (px) from the bottom of the screen to the TOP edge of the
 * floating liquid glass tab bar. Mirrors the bar's `bottomOffset` in
 * `LiquidGlassTabBar`.
 */
export function getLiquidBarBottomOffset(insetsBottom: number): number {
  return Math.max(insetsBottom, MIN_INSET) + LIQUID.bottomSpacing + BOTTOM_ADJUSTMENT;
}

/**
 * Total vertical space (px) the liquid glass tab bar occupies at the
 * bottom of the screen (bottom offset + bar height).
 */
export function getLiquidBarReserved(insetsBottom: number): number {
  return getLiquidBarBottomOffset(insetsBottom) + LIQUID.barHeight;
}
