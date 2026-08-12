import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { HOME_TOKENS } from "@screens/home/HomeScreen.constants";
import { useHomeCardEntrance } from "@hooks/useHomeCardMotion";
import type { SummaryCardProps } from "../HomeScreen.type";

const CARD_INDEX = 7;
const PULSE_DURATION = 1200;

export default function SummaryCard({
  title,
  meta,
  teacherPhoto,
  liveLabel,
  joinLabel,
  onJoin,
  styles,
  palette,
  isRTL,
}: SummaryCardProps) {
  const { opacity, translateY } = useHomeCardEntrance(CARD_INDEX);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: PULSE_DURATION / 2,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: PULSE_DURATION / 2,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const glowScale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 2.2] });
  const glowOpacity = pulse.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] });

  return (
    <Animated.View
      style={[
        styles.summaryCard,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.liveGlow} pointerEvents="none" />
      <View style={styles.liveRail} pointerEvents="none" />

      <View style={styles.summaryTopRow}>
        <Image source={teacherPhoto} style={styles.summaryTeacherPhoto} />
        <View style={styles.summaryInfo}>
          
          <Text style={styles.summaryTitle} numberOfLines={1}>
            {meta}
          </Text>

          <View style={styles.summaryMetaRow}>
            <Ionicons
              name="person-outline"
              size={11}
              color="rgba(255,255,255,0.6)"
            />
            <Text style={styles.summaryMeta} numberOfLines={1}>
              14 participants
            </Text>
          </View>
        </View>
        

        
      </View>
      <View style={styles.liveBadge}>
                <View>
                  <Animated.View
                    style={{
                      position: "absolute",
                      width: 8,
                      height: 8,
                      borderRadius: 999,
                      backgroundColor: palette.live,
                      opacity: glowOpacity,
                      transform: [{ scale: glowScale }],
                    }}
                  />
                  <View style={styles.liveDot} />
                </View>
                <Text style={styles.liveBadgeText}>{liveLabel}</Text>
      </View>
      <View style={styles.summaryInfo}>
          <Text style={styles.summaryTitle} >
            {title}
          </Text>

          
        </View>
      <View style={styles.liveBottomRow}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.liveJoinBtn}
          onPress={onJoin}
          accessibilityRole="button"
          accessibilityLabel={joinLabel}
        >
          <View style={styles.summaryJoinInner}>
            <Ionicons name={isRTL ? "arrow-back" : "arrow-forward"} size={14} color="#FFFFFF" />
            <Text style={styles.liveJoinText}>{joinLabel}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
