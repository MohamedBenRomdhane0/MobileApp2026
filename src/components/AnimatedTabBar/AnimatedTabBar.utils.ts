/**
 * Generates SVG path for the curved notch behind the active tab
 * Uses quadratic bezier curves to create a smooth, rounded cutout
 */
export const generateTabBarCurvePath = (
  screenWidth: number,
  curveHeight: number,
  tabWidth: number,
  offsetX: number = 0
): string => {
  const notchWidth = tabWidth * 0.7;
  const notchDepth = curveHeight * 0.7;
  const centerX = offsetX + tabWidth / 2;
  
  // Calculate control points for smooth curves
  const leftNotchStart = centerX - notchWidth / 2;
  const rightNotchEnd = centerX + notchWidth / 2;
  const curveSmoothness = 0.4;
  
  // Create the path: start from left, curve down to notch, curve up, continue to right
  const path = `
    M 0 ${curveHeight}
    L ${leftNotchStart - notchWidth * 0.2} ${curveHeight}
    Q ${leftNotchStart} ${curveHeight},
      ${leftNotchStart + notchWidth * 0.1} ${curveHeight * 0.6}
    Q ${centerX - notchWidth * 0.1} ${curveHeight * 0.15},
      ${centerX} ${curveHeight * 0.1}
    Q ${centerX + notchWidth * 0.1} ${curveHeight * 0.15},
      ${rightNotchEnd - notchWidth * 0.1} ${curveHeight * 0.6}
    Q ${rightNotchEnd} ${curveHeight},
      ${rightNotchEnd + notchWidth * 0.2} ${curveHeight}
    L ${screenWidth} ${curveHeight}
    L ${screenWidth} ${curveHeight + 10}
    L 0 ${curveHeight + 10}
    Z
  `;
  
  return path.trim();
};

/**
 * Creates a simple curved notch path for a single tab
 */
export const createSingleNotchPath = (
  tabWidth: number,
  curveHeight: number,
  offsetX: number = 0
): string => {
  const notchWidth = tabWidth * 0.65;
  const notchDepth = curveHeight * 0.5;
  const centerX = offsetX + tabWidth / 2;
  
  const path = `
    M ${offsetX} ${curveHeight}
    Q ${offsetX + tabWidth * 0.15} ${curveHeight},
      ${centerX - notchWidth * 0.35} ${curveHeight * 0.4}
    Q ${centerX - notchWidth * 0.15} 0,
      ${centerX} 0
    Q ${centerX + notchWidth * 0.15} 0,
      ${centerX + notchWidth * 0.35} ${curveHeight * 0.4}
    Q ${offsetX + tabWidth * 0.85} ${curveHeight},
      ${offsetX + tabWidth} ${curveHeight}
    L ${offsetX + tabWidth} ${curveHeight + 10}
    L ${offsetX} ${curveHeight + 10}
    Z
  `;
  
  return path.trim();
};

/**
 * Spring animation configuration for bouncy, elastic feel
 */
export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 200,
  mass: 0.8,
};

/**
 * Spring config for icon scale animation (more bouncy)
 */
export const ICON_SPRING_CONFIG = {
  damping: 12,
  stiffness: 220,
  mass: 0.6,
};

/**
 * Calculates the center X position for the bubble
 */
export const calculateBubbleCenter = (
  tabIndex: number,
  tabLayouts: { x: number; width: number }[],
  bubbleWidth: number = 64
): number => {
  const layout = tabLayouts[tabIndex];
  if (!layout) return 0;
  
  return layout.x + layout.width / 2;
};

/**
 * Interpolates between two values
 */
export const lerp = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};
