import { Platform } from "react-native";
import { File as ExpoFile } from "expo-file-system";

export type UploadableAvatar = {
  uri?: string | null;
  name?: string;
  type?: string;
};

type UploadFormPart =
  | Blob
  | { uri: string; name: string; type: string }
  | { name: string; type: string; bytes: () => Promise<Uint8Array> };

export const buildFormDataPart = (
  avatar?: UploadableAvatar | null
): UploadFormPart | null => {
  if (!avatar?.uri) return null;

  if (Platform.OS === "web") {
    return {
      uri: avatar.uri,
      type: avatar.type || "image/jpeg",
      name: avatar.name || "avatar.jpg",
    };
  }

  const file = new ExpoFile(avatar.uri);

  return {
    name: avatar.name || file.name || "avatar.jpg",
    type: avatar.type || file.type || "image/jpeg",
    bytes: () => file.bytes(),
  };
};

export const appendFormDataFile = (
  fd: FormData,
  field: string,
  avatar?: UploadableAvatar | null
): void => {
  const part = buildFormDataPart(avatar);
  if (part) {
    fd.append(field, part as unknown as Blob);
  }
};