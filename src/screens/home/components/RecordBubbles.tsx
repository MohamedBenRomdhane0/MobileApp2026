import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { PATHS } from "@config/constants/paths";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@config/types/navigation.types";

import type { HomeBlockBaseProps } from "@screens/home/HomeScreen.type";

type BubbleItem = {
  id: string;
  labelKey: string;
  icon: keyof typeof Ionicons.glyphMap;
  tint: string;
  route: (typeof PATHS.APP)[keyof typeof PATHS.APP];
};

const RECORD_BUBBLES: BubbleItem[] = [
  {
    id: "record_meetings",
    labelKey: "home.record_meetings",
    icon: "videocam",
    tint: "#22BEC8",
    route: PATHS.APP.RECORD_MEETING_SILVER,
  },
  {
    id: "record_timeline",
    labelKey: "home.record_timeline",
    icon: "film",
    tint: "#7C5CFC",
    route: PATHS.APP.RECORD_TIMELINE,
  },
];

const TILE_ALPHA = "14";

export default function RecordBubbles({ styles, palette }: HomeBlockBaseProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.recordBubblesCard}>
      {RECORD_BUBBLES.map((item) => {
        const label = t(item.labelKey);

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.recordBubbleItem}
            activeOpacity={0.8}
            onPress={() => navigation.navigate(item.route as never)}
            accessibilityRole="button"
            accessibilityLabel={label}
          >
            <View
              style={[
                styles.recordBubbleIcon,
                { backgroundColor: `${item.tint}${TILE_ALPHA}` },
              ]}
            >
              <Ionicons name={item.icon} size={24} color={item.tint} />
            </View>

            <Text style={[styles.recordBubbleLabel, { color: palette.ink }]} numberOfLines={1}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
