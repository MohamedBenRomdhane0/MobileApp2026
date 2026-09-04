import React from "react";
import { View, Text, Image } from "react-native";

import { useGetTeacherByIdQuery } from "@redux/apis/meetings/meetingApi";

interface TeacherPhotoProps {
  teacherId: number;
  name: string;
  accent: string;
  size?: number;
}

export default function TeacherPhoto({
  teacherId,
  name,
  accent,
  size = 28,
}: TeacherPhotoProps) {
  const { data } = useGetTeacherByIdQuery(teacherId);
  const avatarUrl =
    data?.data?.avatar_url ?? data?.data?.avatarUrl ?? data?.data?.avatar ?? null;

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: accent,
      }}
    >
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          style={{ width: "100%", height: "100%", borderRadius: 999 }}
        />
      ) : (
        <Text style={{ fontSize: size * 0.4, fontWeight: "700", color: "#FFFFFF" }}>
          {initials}
        </Text>
      )}
    </View>
  );
}
