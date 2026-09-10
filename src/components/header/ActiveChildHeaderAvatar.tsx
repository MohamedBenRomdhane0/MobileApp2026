import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { PATHS } from "@config/constants/paths";
import { useActiveChildHeaderData } from "@hooks/useActiveChildHeaderData";
import { useActiveChild } from "@hooks/useActiveChild";
import { useChildSkinAvatar } from "@hooks/useAvatarCustomization";
import { styles } from "./ActiveChildHeaderAvatar.styles";

type Props = {
  /** Optional override for the default tap action (CustomizeAvatar). */
  onPress?: () => void;
};

export default function ActiveChildHeaderAvatar({ onPress }: Props) {
  const navigation = useNavigation<any>();
  const data = useActiveChildHeaderData();
  const child = useActiveChild();
  const skinAvatar = useChildSkinAvatar(child?.id ?? null);

  if (!data) return null;

  const hasSkin = skinAvatar != null;

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => navigation.navigate(PATHS.APP.CUSTOMIZE_AVATAR as any))}
      style={styles.container}
      activeOpacity={0.85}
    >
      <View style={styles.column}>
        <View style={styles.avatarWrap}>
          {hasSkin ? (
            <Image
              source={skinAvatar}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : data.avatarUrl ? (
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
