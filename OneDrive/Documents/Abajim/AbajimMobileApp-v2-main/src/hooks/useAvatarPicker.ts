import { useCallback } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import i18n from "i18n";

export type PickedAvatar = {
  uri: string;
  name?: string;
  type?: string;
};

type UseAvatarPickerOptions = {
  aspect?: [number, number];
  quality?: number;
  allowsEditing?: boolean;
};

export const useAvatarPicker = (options?: UseAvatarPickerOptions) => {
  const {
    aspect = [1, 1],
    quality = 0.85,
    allowsEditing = true,
  } = options ?? {};

  const pickAvatar = useCallback(async (): Promise<PickedAvatar | null> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(i18n.t("common.permission_required"));
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing,
        aspect,
        quality,
      });

      if (result.canceled || !result.assets?.length) return null;

      const asset = result.assets[0];

      return {
        uri: asset.uri,
        name: (asset as any).fileName || "avatar.jpg",
        type: (asset as any).mimeType || "image/jpeg",
      };
    } catch (e) {
      console.error("pickAvatar failed", e);
      Alert.alert(i18n.t("common.pick_image_failed"));
      return null;
    }
  }, [allowsEditing, aspect, quality]);

  return { pickAvatar };
};