/**
 * Creates SVG path for the curved notch behind the active tab
 * Uses bezier curves to create a smooth, rounded cutout
 */
export const createTabBarCurvePath = (
  tabWidth: number,
  curveHeight: number,
  offsetX: number = 0
): string => {
  const notchWidth = tabWidth * 0.7;
  const notchDepth = curveHeight * 0.6;
  const centerX = offsetX + tabWidth / 2;
  
  // Control points for smooth bezier curves
  const leftCurveStart = centerX - notchWidth / 2;
  const rightCurveEnd = centerX + notchWidth / 2;
  
  // Create path: start bottom-left, curve up to notch, curve down, end bottom-right
  const path = `
    M ${offsetX} ${curveHeight}
    C ${offsetX + notchWidth * 0.1} ${curveHeight},
      ${leftCurveStart - notchWidth * 0.15} ${curveHeight * 0.5},
      ${leftCurveStart} ${curveHeight * 0.3}
    C ${leftCurveStart + notchWidth * 0.2} 0,
      ${centerX - notchWidth * 0.1} 0,
      ${centerX} 0
    C ${centerX + notchWidth * 0.1} 0,
      ${rightCurveEnd - notchWidth * 0.2} 0,
      ${rightCurveEnd} ${curveHeight * 0.3}
    C ${rightCurveEnd + notchWidth * 0.15} ${curveHeight * 0.5},
      ${offsetX + tabWidth - notchWidth * 0.1} ${curveHeight},
      ${offsetX + tabWidth} ${curveHeight}
    Z
  `;
  
  return path.trim();
};

/**
 * Creates a complete tab bar background path with multiple notch positions
 * for smoother transitions
 */
export const createFullTabBarPath = (
  screenWidth: number,
  tabWidth: number,
  activeTabIndex: number,
  curveHeight: number = 40,
  barHeight: number = 80
): string => {
  const notchWidth = tabWidth * 0.6;
  const notchHeight = curveHeight * 0.6;
  const notchX = activeTabIndex * tabWidth + (tabWidth - notchWidth) / 2;
  
  const path = `
    M 0 ${barHeight}
    L 0 ${curveHeight}
    Q ${notchX * 0.3} ${curveHeight * 0.8},
      ${notchX * 0.5} ${curveHeight * 0.5}
    Q ${notchX} 0,
      ${notchX + notchWidth * 0.5} 0
    Q ${notchX + notchWidth} 0,
      ${notchX + notchWidth * 1.5} ${curveHeight * 0.5}
    Q ${notchX + notchWidth * 1.7} ${curveHeight * 0.8},
      ${notchX + notchWidth * 2} ${curveHeight}
    L ${screenWidth} ${curveHeight}
    L ${screenWidth} ${barHeight}
    Z
  `;
  
  return path.trim();
};

/**
 * Calculates the center X position for the bubble based on tab layout
 */
export const calculateBubblePosition = (
  tabIndex: number,
  tabLayouts: { x: number; width: number }[],
  bubbleWidth: number = 64
): number => {
  const layout = tabLayouts[tabIndex];
  if (!layout) return 0;
  
  return layout.x + layout.width / 2 - bubbleWidth / 2;
};

/**
 * Spring animation configuration for bouncy effect
 */
export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
};

/**
 * Spring config for icon scale animation
 */
export const ICON_SPRING_CONFIG = {
  damping: 12,
  stiffness: 220,
  mass: 0.6,
};

/**
 * Interpolates between two curve paths for smooth transitions
 */
export const interpolateCurvePath = (
  fromPath: string,
  toPath: string,
  progress: number
): string => {
  // Simple interpolation - in production you'd want proper path interpolation
  return progress < 0.5 ? fromPath : toPath;
};
