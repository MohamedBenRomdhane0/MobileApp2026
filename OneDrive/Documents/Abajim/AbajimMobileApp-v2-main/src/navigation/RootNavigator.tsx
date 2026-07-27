import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PATHS } from "@config/constants/paths";
import type { RootStackParamList } from "@config/types/navigation.types";

import AuthTree from "@navigation/trees/AuthTree";
import AppTree from "@navigation/trees/AppTree";
import OnboardingTree from "@navigation/trees/OnboardingTree";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={PATHS.AUTH.ROOT} component={AuthTree} />
      <Stack.Screen name={PATHS.ONBOARDING.ROOT} component={OnboardingTree} />
      <Stack.Screen name={PATHS.APP.ROOT} component={AppTree} />
    </Stack.Navigator>
  );
}