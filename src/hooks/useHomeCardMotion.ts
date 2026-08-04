import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";

export type HomeCardEntrance = {
  opacity: Animated.Value;
  translateY: Animated.AnimatedInterpolation<number>;
};

/**
 * Staggered fade-and-rise entrance shared by every animated home card.
 * Duration and easing come from the motion scale in
 * `.claude/skills/frontend-design` (420ms, cubic-bezier(.2,.8,.2,1)).
 */
export function useHomeCardEntrance(index: number, rise: number = 16): HomeCardEntrance {
  const enter = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(enter, {
      toValue: 1,
      duration: HOME_TOKENS.enterDuration,
      delay: HOME_TOKENS.enterStagger * index,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    animation.start();
    return () => animation.stop();
  }, [enter, index]);

  return {
    opacity: enter,
    translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [rise, 0] }),
  };
}

export type HomeCardPress = {
  scale: Animated.Value;
  onPressIn: () => void;
  onPressOut: () => void;
};

/** Spring press feedback: settle down on touch, bounce back on release. */
export function useHomeCardPress(): HomeCardPress {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: HOME_TOKENS.pressScale,
      speed: 40,
      bounciness: 0,
      useNativeDriver: true,
    }).start();

  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      speed: 20,
      bounciness: 8,
      useNativeDriver: true,
    }).start();

  return { scale, onPressIn, onPressOut };
}
