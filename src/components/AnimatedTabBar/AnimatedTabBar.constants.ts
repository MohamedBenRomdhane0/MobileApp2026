export const ANIMATED_TAB_BAR_CONFIG = {
  bubbleSize: 64,
  curveHeight: 40,
  barHeight: 80,
  activeIconSize: 28,
  inactiveIconSize: 24,
  borderRadius: 20,
  
  springConfig: {
    damping: 18,
    stiffness: 200,
    mass: 0.8,
  },
  
  iconSpringConfig: {
    damping: 12,
    stiffness: 220,
    mass: 0.6,
  },
  
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  
  bubbleShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const ANIMATION_DURATIONS = {
  labelFade: 150,
  bubbleFade: 100,
  iconScale: 200,
};
