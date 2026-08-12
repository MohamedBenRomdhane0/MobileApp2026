import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { PATHS } from "@config/constants/paths";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { styles } from "./ActiveChildHeaderAvatar.styles";

export default function ActiveChildHeaderAvatar() {
  const navigation = useNavigation<any>();
  const data = useActiveChildHeaderData();

  if (!data) return null;

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate(PATHS.APP.CUSTOMIZE_AVATAR as any)}
      style={styles.container}
      activeOpacity={0.85}
    >
      <View style={styles.column}>
        <View style={styles.avatarWrap}>
          {data.avatarUrl ? (
            <Image
              source={{ uri: data.avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.avatar} />
          )}
          <View style={styles.greenDot} />
        </View>

        <Text style={styles.name} numberOfLines={1}>
          {data.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}