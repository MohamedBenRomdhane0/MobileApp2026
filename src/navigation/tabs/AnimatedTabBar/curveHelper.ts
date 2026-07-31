import { Dimensions } from "react-native";

export interface CurveConfig {
  bubbleRadius: number;
  notchDepth: number;
  barHeight: number;
  tabWidth: number;
  activeTabX: number;
}

export const generateNotchPath = (config: CurveConfig): string => {
  const { bubbleRadius, notchDepth, barHeight, tabWidth, activeTabX } = config;
  const centerX = activeTabX + tabWidth / 2;
  const startX = centerX - bubbleRadius;
  const endX = centerX + bubbleRadius;
  const curveWidth = notchDepth * 2;

  const leftControlX = startX - curveWidth;
  const rightControlX = endX + curveWidth;

  const yTop = 0;
  const yNotch = -notchDepth;
  const yBottom = barHeight;

  return `
    M 0 ${yTop}
    L ${startX} ${yTop}
    Q ${leftControlX} ${yTop} ${startX} ${yNotch}
    Q ${centerX} ${yNotch - bubbleRadius * 0.3} ${endX} ${yNotch}
    Q ${rightControlX} ${yTop} ${endX} ${yTop}
    L ${Dimensions.get("window").width} ${yTop}
    L ${Dimensions.get("window").width} ${yBottom}
    L 0 ${yBottom}
    Z
  `.trim();
};

export const generateBubblePath = (config: CurveConfig): string => {
  const { bubbleRadius, notchDepth, activeTabX, tabWidth } = config;
  const centerX = activeTabX + tabWidth / 2;
  const centerY = -notchDepth + bubbleRadius * 0.2;

  return `
    M ${centerX - bubbleRadius} ${centerY}
    A ${bubbleRadius} ${bubbleRadius} 0 1 1 ${centerX + bubbleRadius} ${centerY}
    A ${bubbleRadius} ${bubbleRadius} 0 1 1 ${centerX - bubbleRadius} ${centerY}
    Z
  `.trim();
};

export const calculateTabPositions = (
  tabCount: number,
  screenWidth: number,
  paddingHorizontal: number,
  fabWidth: number
): { x: number; width: number }[] => {
  const availableWidth = screenWidth - paddingHorizontal * 2 - fabWidth;
  const tabWidth = availableWidth / (tabCount - 1);
  const positions: { x: number; width: number }[] = [];

  let currentX = paddingHorizontal;
  for (let i = 0; i < tabCount; i++) {
    if (i === Math.floor(tabCount / 2)) {
      currentX += fabWidth;
    }
    positions.push({ x: currentX, width: tabWidth });
    currentX += tabWidth;
  }
  return positions;
};