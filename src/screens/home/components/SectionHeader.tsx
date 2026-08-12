import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { SectionHeaderProps } from "@screens/home/HomeScreen.type";

const HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

/** Alpha suffixes layered over the section accent (see frontend-design). */
const TINT = "1A";
const TINT_BORDER = "33";

/**
 * One header for every home section: an accent tile, the title with its
 * underline rule, an optional count pill and a "see all" chip whose chevron
 * follows the reading direction. The accent is what tells two adjacent
 * sections apart while scrolling.
 */
export default function SectionHeader({
  styles,
  palette,
  isRTL,
  title,
  count,
  seeAllLabel,
  onSeeAll,
  icon,
  accent,
}: SectionHeaderProps) {
  const hue = accent || palette.teal;

  return (
    <View style={styles.sectionHeaderRow}>
      <View style={styles.sectionTitleWrap}>
        {!!icon && (
          <View
            style={[
              styles.sectionIconTile,
              { backgroundColor: `${hue}${TINT}`, borderColor: `${hue}${TINT_BORDER}` },
            ]}
          >
            <Ionicons name={icon} size={17} color={hue} />
          </View>
        )}

        <View style={styles.sectionTitleBlock}>
          <View style={styles.sectionTitleLine}>
            <Text style={styles.sectionTitle} numberOfLines={1}>
              {title}
            </Text>

            {typeof count === "number" && count > 0 && (
              <View
                style={[styles.sectionCountPill, { backgroundColor: `${hue}${TINT}` }]}
              >
                <Text style={[styles.sectionCountText, { color: hue }]}>{count}</Text>
              </View>
            )}
          </View>

          <View style={[styles.sectionTitleRule, { backgroundColor: hue }]} />
        </View>
      </View>

      {!!onSeeAll && !!seeAllLabel && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onSeeAll}
          hitSlop={HIT_SLOP}
          style={[
            styles.sectionSeeAll,
            { backgroundColor: `${hue}${TINT}`, borderColor: `${hue}${TINT_BORDER}` },
          ]}
          accessibilityRole="link"
          accessibilityLabel={seeAllLabel}
        >
          <Text style={[styles.sectionLink, { color: hue }]}>{seeAllLabel}</Text>
          <Ionicons
            name={isRTL ? "chevron-back" : "chevron-forward"}
            size={13}
            color={hue}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
