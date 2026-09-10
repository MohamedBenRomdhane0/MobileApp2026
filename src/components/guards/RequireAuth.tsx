import React, { useCallback } from "react";
import { View, TouchableOpacity } from "react-native";

import { useAppSelector } from "@redux/hooks";
import { selectIsDraftMode } from "@redux/slices/authSlice";
import LoginRequiredPopup from "./LoginRequiredPopup";

type Props = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const isDraftMode = useAppSelector(selectIsDraftMode);

  const isAuthenticated = !isDraftMode;

  const [showModal, setShowModal] = React.useState(false);

  const closeModal = useCallback(() => setShowModal(false), []);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <View style={{ flex: 1 }}>
      {children}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowModal(true)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent",
        }}
      />

      <LoginRequiredPopup visible={showModal} onClose={closeModal} />
    </View>
  );
}
