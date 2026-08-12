import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { TeacherCard } from "@screens/home/HomeScreen.type";
import type { PlansScreenStyles } from "@screens/plans/PlansScreen.styles";
import type { getPlansPalette } from "@screens/plans/PlansScreen.styles";

interface Props {
  teachers:     TeacherCard[];
  matiereLabel: string;
  selectedIds:  number[];
  loading:      boolean;
  onToggle:     (id: number) => void;
  styles:       PlansScreenStyles;
  palette:      ReturnType<typeof getPlansPalette>;
}

export function TeacherSelectorList({
  teachers,
  matiereLabel,
  selectedIds,
  loading,
  onToggle,
  styles,
  palette,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.selectorSection}>
      <View>
        <Text style={[styles.selectorTitle, { color: palette.text }]}>
          {t("plan.live_teachers_label")}
        </Text>
        <Text style={styles.selectorSubtitle}>{matiereLabel}</Text>
      </View>

      {loading ? (
        <View style={styles.selectorList}>
          {[0, 1, 2].map((key) => (
            <View key={key} style={styles.selectorSkeleton}>
              <View style={styles.selectorSkeletonCircle} />
              <View style={styles.selectorSkeletonLines}>
                <View style={[styles.selectorSkeletonLine, { width: "55%" }]} />
                <View style={[styles.selectorSkeletonLine, { width: "35%" }]} />
              </View>
            </View>
          ))}
        </View>
      ) : teachers.length === 0 ? (
        <View style={styles.selectorEmpty}>
          <Ionicons name="people-outline" size={26} color={palette.muted} />
          <Text style={styles.selectorEmptyText}>
            {t("plan.teacher_empty")}
          </Text>
        </View>
      ) : (
        <View style={styles.selectorList}>
          {teachers.map((teacher) => {
            const selected = selectedIds.includes(teacher.id);

            return (
              <TouchableOpacity
                key={teacher.id}
                activeOpacity={0.85}
                onPress={() => onToggle(teacher.id)}
                style={[
                  styles.selectorCard,
                  {
                    backgroundColor: palette.card,
                    borderColor: selected ? palette.primary : palette.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.selectorCheck,
                    {
                      backgroundColor: selected ? palette.primary : "transparent",
                      borderColor: selected ? palette.primary : palette.border,
                    },
                  ]}
                >
                  {selected ? (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  ) : null}
                </View>

                <View
                  style={[
                    styles.selectorAvatar,
                    { backgroundColor: `${palette.primary}14` },
                  ]}
                >
                  <Image source={teacher.avatar} style={styles.selectorAvatarImage} />
                </View>

                <View style={styles.selectorInfo}>
                  <Text
                    style={[styles.selectorName, { color: palette.text }]}
                    numberOfLines={1}
                  >
                    {teacher.fullName}
                  </Text>

                  <Text style={styles.selectorMetaText} numberOfLines={1}>
                    {String(teacher.subject ?? "").trim() || matiereLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
