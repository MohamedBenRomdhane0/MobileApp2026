import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import type { QuickActionsProps } from "@screens/home/HomeScreen.type";

/** Alpha used to tint each action tile with its own accent (8%). */
const TILE_ALPHA = "14";

/**
 * Four shortcuts on a card that overlaps the hero curve — the first thing
 * the child can act on without scrolling.
 */
export default function QuickActions({
  styles,
  actions,
  onPressAction,
}: QuickActionsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.quickCard}>
      {actions.map((action) => {
        const label = t(action.labelKey);

        return (
          <TouchableOpacity
            key={action.id}
            style={styles.quickItem}
            activeOpacity={0.8}
            onPress={() => onPressAction(action)}
            accessibilityRole="button"
            accessibilityLabel={label}
          >
            <View
              style={[styles.quickIconTile, { backgroundColor: `${action.tint}${TILE_ALPHA}` }]}
            >
              <Ionicons name={action.icon} size={22} color={action.tint} />
            </View>

            <Text style={styles.quickLabel} numberOfLines={1}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
