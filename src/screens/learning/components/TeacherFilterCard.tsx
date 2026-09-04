import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { useGetTeacherByIdQuery } from "@redux/apis/meetings/meetingApi";

interface TeacherFilterCardProps {
  teacherId: number;
  name: string;
  subject: string;
  accent: string;
  checked: boolean;
  onPress: () => void;
  ringSize?: number;
}

export default function TeacherFilterCard({
  teacherId,
  name,
  subject,
  accent,
  checked,
  onPress,
  ringSize = 52,
}: TeacherFilterCardProps) {
  const { data } = useGetTeacherByIdQuery(teacherId);
  const avatarUrl =
    data?.data?.avatar_url ?? data?.data?.avatarUrl ?? data?.data?.avatar ?? null;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const innerSize = ringSize - 5;

  return (
    <TouchableOpacity
      style={{
        alignItems: "center",
        width: 80,
      }}
      activeOpacity={0.85}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onPress}
    >
      {/* Accent wash behind the avatar */}
      <LinearGradient
        colors={[`${accent}2E`, "transparent"]}
        style={{
          position: "absolute",
          top: -4,
          width: ringSize + 8,
          height: ringSize + 8,
          borderRadius: 999,
        }}
        pointerEvents="none"
      />

      {/* Circular ringed avatar */}
      <LinearGradient
        colors={checked ? [accent, `${accent}88`] : ["#D1D5DB", "#E5E7EB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: ringSize,
          height: ringSize,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          padding: 2.5,
        }}
      >
        <View
          style={{
            width: innerSize,
            height: innerSize,
            borderRadius: 999,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#F8FAFC",
          }}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: "100%", height: "100%", borderRadius: 999 }}
            />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: "800", color: accent }}>
              {initials}
            </Text>
          )}
        </View>
      </LinearGradient>

      {/* Checkmark badge */}
      {checked && (
        <View
          style={{
            position: "absolute",
            top: ringSize - 16,
            right: 10,
            width: 18,
            height: 18,
            borderRadius: 999,
            backgroundColor: accent,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "#FFFFFF",
          }}
        >
          <Ionicons name="checkmark" size={10} color="#FFFFFF" />
        </View>
      )}

      <Text
        style={{ fontSize: 11, fontWeight: "600", color: "#1F2937", marginTop: 6 }}
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text
        style={{ fontSize: 9, color: "#9CA3AF", marginTop: 1 }}
        numberOfLines={1}
      >
        {subject}
      </Text>
    </TouchableOpacity>
  );
}
