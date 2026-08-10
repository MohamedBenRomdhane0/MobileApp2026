import React from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import type { SummaryCardProps } from "../HomeScreen.type";

const CARD_INDEX = 7;

export default function SummaryCard({
  title,
  stats,
  liveInfo,
  styles,
  palette,
  isRTL,
}: SummaryCardProps) {
  const { opacity, translateY } = useHomeCardEntrance(CARD_INDEX);
  const { scale, onPressIn, onPressOut } = useHomeCardPress();

  return (
    <Animated.View
      style={[
        styles.summaryCard,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      <View style={styles.summaryHeader}>
        <Text style={styles.summaryTitle}>{title}</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.summaryArrowBtn}
        >
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={16}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {stats.map((stat, i) => (
        <View key={i}>
          <View style={styles.summaryStatRow}>
            <View style={styles.summaryStatLeft}>
              <View style={[styles.summaryStatDot, { backgroundColor: stat.color }]} />
              <Text style={styles.summaryStatLabel}>{stat.label}</Text>
            </View>
            <Text style={styles.summaryStatValue}>{stat.value}</Text>
          </View>
          <View style={[styles.summaryStatUnderline, { backgroundColor: stat.color }]} />
        </View>
      ))}

      {!!liveInfo && (
        <View style={styles.summaryLiveWrap}>
          <View style={styles.summaryLiveDot} />
          <View style={styles.summaryLiveInfo}>
            <Text style={styles.summaryLiveSubject} numberOfLines={1}>
              {liveInfo.subject}
            </Text>
            <Text style={styles.summaryLiveTeacher} numberOfLines={1}>
              {liveInfo.teacherName}
            </Text>
            <Text style={styles.summaryLiveParticipants}>
              {liveInfo.participants} participants
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={liveInfo.onJoin}
            style={styles.summaryJoinBtn}
          >
            <Ionicons name="videocam" size={12} color="#FFFFFF" />
            <Text style={styles.summaryJoinText}>{liveInfo.joinLabel}</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}
