import React, { useMemo } from "react";
import { Animated, Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useHomeCardEntrance, useHomeCardPress } from "@hooks/useHomeCardMotion";
import type { ActivitiesCardProps } from "../HomeScreen.type";

const CARD_INDEX = 8;
const DAYS_IN_MONTH = 31;
const FIRST_DAY_OFFSET = 6;
const COLS = 7;

export default function ActivitiesCard({
  title,
  subtitle,
  weekDays,
  reservedDays,
  today,
  styles,
  palette,
  isRTL,
}: ActivitiesCardProps) {
  const { opacity, translateY } = useHomeCardEntrance(CARD_INDEX);
  const { scale, onPressIn, onPressOut } = useHomeCardPress();

  const reservedMap = useMemo(() => {
    const map = new Map<number, (typeof reservedDays)[0]>();
    reservedDays.forEach((r) => map.set(r.day, r));
    return map;
  }, [reservedDays]);

  const totalCells = FIRST_DAY_OFFSET + DAYS_IN_MONTH;
  const totalRows = Math.ceil(totalCells / COLS);

  const rows = useMemo(() => {
    const result: (number | null)[][] = [];
    let day = 1;
    for (let r = 0; r < totalRows; r++) {
      const row: (number | null)[] = [];
      for (let c = 0; c < COLS; c++) {
        const cellIndex = r * COLS + c;
        if (cellIndex < FIRST_DAY_OFFSET || day > DAYS_IN_MONTH) {
          row.push(null);
        } else {
          row.push(day);
          day++;
        }
      }
      result.push(row);
    }
    return result;
  }, [totalRows]);

  return (
    <Animated.View
      style={[
        styles.summaryCard,
        { opacity, transform: [{ translateY }, { scale }] },
      ]}
    >
      <View style={styles.activitiesHeader}>
        <View style={styles.activitiesHeaderText}>
          <Text style={styles.activitiesSubtitle}>{subtitle}</Text>
          <Text style={styles.activitiesTitle}>{title}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.activitiesArrowBtn}
        >
          <Ionicons
            name={isRTL ? "arrow-back" : "arrow-forward"}
            size={16}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.calGrid}>
        {rows.map((row, rowIdx) => (
          <View key={rowIdx} style={styles.calRow}>
            {row.map((day, colIdx) => {
              if (day === null) {
                return <View key={colIdx} style={styles.calDay} />;
              }

              const reserved = reservedMap.get(day);
              const isToday = day === today;

              if (reserved) {
                return (
                  <View key={colIdx} style={styles.calDay}>
                    <View
                      style={[
                        styles.calDayPhotoRing,
                        { borderColor: reserved.accent },
                      ]}
                    >
                      <Image
                        source={reserved.teacherPhoto}
                        style={styles.calDayPhoto}
                      />
                    </View>
                  </View>
                );
              }

              return (
                <View
                  key={colIdx}
                  style={[styles.calDay, isToday && styles.calDayToday]}
                >
                  <Text
                    style={[
                      styles.calDayText,
                      isToday && styles.calDayTodayText,
                    ]}
                  >
                    {day}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.calLabels}>
        {weekDays.map((day, i) => (
          <Text key={i} style={styles.calLabel}>
            {day}
          </Text>
        ))}
      </View>
    </Animated.View>
  );
}
