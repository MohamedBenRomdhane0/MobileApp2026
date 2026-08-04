import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { SectionHeaderProps } from "@screens/home/HomeScreen.type";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

/**
 * One header for every home section: title, optional count pill and an
 * optional "see all" link whose chevron follows the reading direction.
 */
export default function SectionHeader({
  styles,
  palette,
  isRTL,
  title,
  count,
  seeAllLabel,
  onSeeAll,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionTitleWrap}>
        <Text style={styles.sectionTitle} numberOfLines={1}>
          {title}
        </Text>

        {typeof count === "number" && count > 0 && (
          <View style={styles.sectionCountPill}>
            <Text style={styles.sectionCountText}>{count}</Text>
          </View>
        )}
      </View>

      {!!onSeeAll && !!seeAllLabel && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSeeAll}
          hitSlop={HIT_SLOP}
          style={styles.sectionSeeAll}
          accessibilityRole="link"
          accessibilityLabel={seeAllLabel}
        >
          <Text style={styles.sectionLink}>{seeAllLabel}</Text>
          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={14}
            color={palette.teal}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
