import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  setAudioModeAsync,
  type InterruptionMode,
} from "expo-audio";

import { store } from "@redux/store";
import { ThemeProvider } from "@theme/ThemeProvider";
import RouteNavigator from "./src/navigation/RootNavigator";
import { useAuthInitialization } from "@hooks/useAuthInitialization";
import { useLanguageOrientation } from "@hooks/useLanguageOrientation";

function AppBootstrap() {
  const isReady = useAuthInitialization();
  useLanguageOrientation();

  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          shouldPlayInBackground: false,
          playsInSilentMode: true,
          interruptionMode: "doNotMix" as InterruptionMode,
          shouldRouteThroughEarpiece: false,
        });

      } catch (error) {
      }
    };

    void configureAudio();
  }, []);

  if (!isReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RouteNavigator />
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AppBootstrap />
    </Provider>
  );
}