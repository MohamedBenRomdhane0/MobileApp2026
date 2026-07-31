import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "@theme/ThemeProvider";

type HeaderVariant = "cover" | "bar";

type AppHeaderProps = {
  title: string;

  variant?: HeaderVariant;

  onBackPress?: () => void;

  leftSlot?: React.ReactNode;

  rightSlot?: React.ReactNode;

  backgroundColor?: string;

  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  statusBarStyle?: "light-content" | "dark-content";
};

function AppHeaderComponent({
  title,
  variant = "cover",
  onBackPress,
  leftSlot,
  rightSlot,
  backgroundColor,
  containerStyle,
  titleStyle,
  statusBarStyle,
}: AppHeaderProps) {
  const { colors, mode } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isDark = mode === "dark";

  const bg = backgroundColor ?? colors.header;

  const styles = useMemo(
    () => makeStyles({ bg, colors, isDark, insetsTop: insets.top, variant }),
    [bg, colors, isDark, insets.top, variant]
  );

  const barStyle =
    statusBarStyle ?? (variant === "cover" ? "light-content" : "light-content");

  return (
    <View style={[styles.root, containerStyle]}>
      <StatusBar
        backgroundColor={bg}
        barStyle={barStyle}
        translucent={Platform.OS === "android"}
      />

      {variant === "cover" ? (
        <View style={styles.coverContainer}>
          <View style={styles.coverBubbleLeft} />
          <View style={styles.coverBubbleRight} />

          {onBackPress ? (
            <TouchableOpacity
              onPress={onBackPress}
              style={styles.backButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          ) : null}

          <Text style={[styles.coverTitle, titleStyle]} numberOfLines={1}>
            {title}
          </Text>
        </View>
      ) : (
        <View style={styles.barContainer}>
          <View style={styles.barRow}>
            <View style={styles.barSide}>
              {leftSlot}
              {onBackPress ? (
                <TouchableOpacity
                  onPress={onBackPress}
                  style={styles.iconTouch}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.barSide}>{rightSlot}</View>
          </View>

          {/* Center title overlay*/}
          <View style={styles.titleCenterWrap} pointerEvents="none">
            <Text style={[styles.barTitle, titleStyle]} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

export const AppHeader = memo(AppHeaderComponent);

function makeStyles({
  bg,
  colors,
  isDark,
  insetsTop,
  variant,
}: {
  bg: string;
  colors: any;
  isDark: boolean;
  insetsTop: number;
  variant: HeaderVariant;
}) {
  const coverHeight = 150;
  const barHeight = 86;

  return StyleSheet.create({
    root: {
      width: "100%",
      backgroundColor: bg,
    },

    // ------- COVER (Settings style) -------
    coverContainer: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      borderBottomLeftRadius: 26,
      borderBottomRightRadius: 26,
      overflow: "hidden",
      backgroundColor: bg,
      height: coverHeight + (Platform.OS === "android" ? insetsTop : 0),
      paddingTop: Platform.OS === "android" ? insetsTop : 0,
    },
    coverBubbleLeft: {
      position: "absolute",
      top: -12,
      left: -40,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: "rgba(255,255,255,0.18)",
    },
    coverBubbleRight: {
      position: "absolute",
      bottom: -35,
      right: -35,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: "rgba(255,255,255,0.16)",
    },
    coverTitle: {
      fontSize: 22,
      fontWeight: "800",
      color: "#FFF",
      marginTop: 5,
      letterSpacing: 0.5,
    },
    backButton: {
      position: "absolute",
      top: (Platform.OS === "android" ? insetsTop : 0) + 14,
      left: 16,
      zIndex: 2,
    },

    // ------- BAR (Books style) -------
    barContainer: {
      height: barHeight + (Platform.OS === "android" ? insetsTop : 0),
      paddingTop: Platform.OS === "android" ? insetsTop : 0,
      backgroundColor: bg,
      justifyContent: "flex-end",
      paddingHorizontal: 14,
      paddingBottom: 12,
      borderBottomWidth: isDark ? 1 : 0,
      borderBottomColor: isDark ? "rgba(148,163,184,0.18)" : "transparent",
    },
    barRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    barSide: {
      minWidth: 90,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 10,
    },
    iconTouch: {
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    titleCenterWrap: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    barTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: "#FFF",
      letterSpacing: 0.2,
    },
  });
}