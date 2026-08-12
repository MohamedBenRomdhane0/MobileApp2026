import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { TEACHER_COLORS } from "@screens/home/HomeScreen.constants";
import type { TeachersRowProps } from "@screens/home/HomeScreen.type";

/**
 * Horizontal row of the available teachers — the 3 real mock entries, each
 * with a ringed avatar, name, subject and a rating pill. No filler cards.
 */
export default function TeachersRow({
  styles,
  teachers,
  onPressTeacher,
}: TeachersRowProps) {
  if (teachers.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.teachersSwiper}
      contentContainerStyle={styles.teachersRow}
    >
      {teachers.map((teacher, index) => {
        const ringColor = TEACHER_COLORS[index % TEACHER_COLORS.length];

        return (
          <TouchableOpacity
            key={String(teacher.id)}
            style={styles.teacherCard}
            activeOpacity={0.8}
            onPress={() => onPressTeacher(teacher.id)}
            accessibilityRole="button"
            accessibilityLabel={teacher.fullName}
          >
            {/* Accent wash bleeding down from the top edge, tinted per teacher. */}
            <LinearGradient
              colors={[`${ringColor}2E`, "transparent"]}
              style={styles.teacherCardWash}
              pointerEvents="none"
            />

            <LinearGradient
              colors={[ringColor, `${ringColor}88`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.teacherAvatarRing}
            >
              <View style={styles.teacherAvatar}>
                <Image source={teacher.avatar} style={styles.teacherImg} />
              </View>
            </LinearGradient>

            <Text style={styles.teacherName} numberOfLines={1}>
              {teacher.fullName}
            </Text>
            <Text style={styles.teacherSubject} numberOfLines={1}>
              {teacher.subject}
            </Text>

            <View style={styles.teacherBadge}>
              <Ionicons name="star" size={10} color="#F59E0B" />
              <Text style={styles.teacherBadgeText}>4.0</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
