import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";
import AddKidsScreen from "src/screens/child/AddKidsScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function OnboardingTree() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={PATHS.ONBOARDING.ADD_KIDS} component={AddKidsScreen} />
    </Stack.Navigator>
  );
}