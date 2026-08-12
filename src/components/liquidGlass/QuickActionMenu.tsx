import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolation,
  type SharedValue,
} from "react-native-reanimated";
import { LIQUID } from "@styles/liquidTheme";

type QuickAction = (typeof LIQUID.quickActions)[number];

interface QuickActionMenuProps {
  /** 0 = hidden, 1 = fully revealed. Driven by the parent's spring. */
  progress: SharedValue<number>;
  width: number;
  open: boolean;
  onSelect: (routeName: string) => void;
}

const ACTIONS = LIQUID.quickActions;
const TAIL = LIQUID.menuTailSize;

/**
 * The bubble that pops above the center button. It scales up from its own
 * bottom edge (where the tail meets the FAB) and the three actions cascade in.
 */
function QuickActionMenu({
  progress,
  width,
  open,
  onSelect,
}: QuickActionMenuProps) {
  const bubbleStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.55, 1]);
    return {
      opacity: interpolate(progress.value, [0, 0.35, 1], [0, 1, 1], Extrapolation.CLAMP),
      transform: [
        // Compensate the scale so the growth origin sits at the bottom center.
        { translateY: (1 - scale) * (LIQUID.menuHeight / 2) },
        { translateY: interpolate(progress.value, [0, 1], [18, 0]) },
        { scale },
      ],
    };
  });

  const tailStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0.25, 0.7], [0, 1], Extrapolation.CLAMP),
    transform: [
      { translateY: interpolate(progress.value, [0, 1], [-8, 0]) },
      { rotate: "45deg" },
      { scale: interpolate(progress.value, [0, 1], [0.4, 1]) },
    ],
  }));

  return (
    <Animated.View
      style={[styles.wrapper, { width }, bubbleStyle]}
      pointerEvents={open ? "auto" : "none"}
      accessibilityViewIsModal={open}
    >
      {/* Tail pointing down at the FAB */}
      <Animated.View style={[styles.tail, tailStyle]} pointerEvents="none">
        <View style={styles.tailFace} />
      </Animated.View>

      <View style={styles.bubble}>
        <BlurView
          intensity={70}
          tint="light"
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.tint} pointerEvents="none" />
        <LinearGradient
          colors={["rgba(255,255,255,0.55)", "rgba(255,255,255,0.05)"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        />
        <View style={styles.rim} pointerEvents="none" />
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.rimTop}
          pointerEvents="none"
        />

        <View style={styles.row}>
          {ACTIONS.map((action, i) => (
            <QuickActionItem
              key={action.name}
              action={action}
              index={i}
              progress={progress}
              onSelect={onSelect}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

interface QuickActionItemProps {
  action: QuickAction;
  index: number;
  progress: SharedValue<number>;
  onSelect: (routeName: string) => void;
}

function QuickActionItem({
  action,
  index,
  progress,
  onSelect,
}: QuickActionItemProps) {
  const press = useSharedValue(1);

  // Each item enters on its own slice of the parent's progress -> cascade.
  const start = index * 0.14;
  const end = start + 0.55;

  const style = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [start, end], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        scale:
          interpolate(progress.value, [start, end], [0.3, 1], Extrapolation.CLAMP) *
          press.value,
      },
      {
        translateY: interpolate(
          progress.value,
          [start, end],
          [16, 0],
          Extrapolation.CLAMP
        ),
      },
    ],
  }));

  return (
    <Pressable
      onPress={() => onSelect(action.name)}
      onPressIn={() => {
        press.value = withSpring(0.86, { damping: 15, stiffness: 460, mass: 0.7 });
      }}
      onPressOut={() => {
        press.value = withSpring(1, { damping: 10, stiffness: 260, mass: 0.7 });
      }}
      style={styles.itemHit}
      accessibilityRole="button"
      accessibilityLabel={action.label}
    >
      <Animated.View style={[styles.item, style]}>
        <View style={styles.chip}>
          <LinearGradient
            colors={["rgba(34,190,200,0.22)", "rgba(34,190,200,0.06)"]}
            start={{ x: 0.2, y: 0 }}
            end={{ x: 0.8, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.chipFill]}
          />
          <View style={styles.chipRim} />
          <Ionicons name={action.icon} size={22} color={LIQUID.cyanDeep} />
        </View>
        <Animated.Text style={styles.itemLabel} numberOfLines={1}>
          {action.label}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const CHIP = 40;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  bubble: {
    width: "100%",
    height: LIQUID.menuHeight,
    borderRadius: LIQUID.menuRadius,
    overflow: "hidden",
    shadowColor: LIQUID.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 16,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: LIQUID.menuTint,
  },
  rim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: LIQUID.menuRadius,
    borderWidth: 1,
    borderColor: LIQUID.menuBorder,
  },
  rimTop: {
    position: "absolute",
    top: 0,
    left: 22,
    right: 22,
    height: 1.2,
  },
  tail: {
    position: "absolute",
    bottom: -TAIL / 2 + 3,
    width: TAIL,
    height: TAIL,
  },
  tailFace: {
    flex: 1,
    backgroundColor: LIQUID.menuTintSolid,
    borderBottomRightRadius: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: LIQUID.menuBorder,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  itemHit: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  chip: {
    width: CHIP,
    height: CHIP,
    borderRadius: CHIP / 2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  chipFill: {
    borderRadius: CHIP / 2,
  },
  chipRim: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: CHIP / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
  },
  itemLabel: {
    fontSize: 9.5,
    fontWeight: "800",
    letterSpacing: 0.2,
    color: LIQUID.cyanDeep,
  },
});

export default React.memo(QuickActionMenu);
