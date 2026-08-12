import type { ReactNode } from "react";
import React from "react";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutUp } from "react-native-reanimated";

interface Props {
  children: ReactNode;
}

export function ConditionalSelectionSection({ children }: Props) {
  return (
    <Animated.View entering={FadeIn.duration(200).delay(40)} exiting={FadeOut.duration(150)}>
      <Animated.View entering={SlideInDown.duration(220)} exiting={SlideOutUp.duration(140)}>
        {children}
      </Animated.View>
    </Animated.View>
  );
}
