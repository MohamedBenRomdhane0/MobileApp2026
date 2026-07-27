import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { PlanTeacherItem } from "@hooks/usePlanTeachers";
import { plansStyles as styles } from "@screens/plans/PlansScreen.styles";
import type { getPlansPalette } from "@screens/plans/PlansScreen.styles";

interface Props {
  teacher:    PlanTeacherItem;
  isSelected: boolean;
  onPress:    () => void;
  palette:    ReturnType<typeof getPlansPalette>;
}

export function PlanTeacherRow({ teacher, isSelected, onPress, palette }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[
        styles.teacherRow,
        {
          backgroundColor: palette.card,
          borderColor:     isSelected ? palette.primary : palette.border,
        },
      ]}
      onPress={onPress}
    >
      {/* Radio selector */}
      <View style={styles.teacherRowLeft}>
        <View style={[styles.teacherRadio, { borderColor: isSelected ? palette.primary : palette.border }]}>
          {isSelected && <Ionicons name="checkmark" size={14} color={palette.primary} />}
        </View>
      </View>

      {/* Teacher info */}
      <View style={styles.teacherRowRight}>
        <View style={styles.teacherRowInfo}>
          <View style={styles.teacherAvatar}>
            <Text style={{ fontSize: 20 }}>{teacher.emoji}</Text>
          </View>

          <View style={styles.teacherRowText}>
            <Text style={[styles.teacherRowName, { color: palette.text }]}>
              {teacher.name}
            </Text>
            <View style={styles.teacherRowMeta}>
              <Text style={[styles.teacherRowSubject, { color: palette.muted }]}>
                {teacher.subject}
              </Text>
              {teacher.rating > 0 && (
                <Text style={[styles.teacherRowRating, { color: palette.muted }]}>
                  ⭐ {teacher.rating}
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
