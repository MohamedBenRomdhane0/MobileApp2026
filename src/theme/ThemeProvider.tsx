import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { ThemeContextValue, ThemeMode } from "./types";
import { LIGHT_THEME_TOKENS } from "./theme.light";
import { DARK_THEME_TOKENS } from "./theme.dark";

const STORAGE_KEY = "abajim_theme_mode_v1";
const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;
        if (saved === "dark" || saved === "light") setModeState(saved);
      } finally {
        if (mounted) setBooted(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

 const setMode = useCallback(async (next: ThemeMode) => {
  let prevMode: ThemeMode;

  setModeState((prev) => {
    prevMode = prev;
    return next;
  });

  try {
    await AsyncStorage.setItem(STORAGE_KEY, next);
  } catch (error) {
    setModeState(prevMode!);
  }
}, []);

  const toggleMode = useCallback(() => {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    void setMode(next);
  }, [mode, setMode]);

  const tokens = mode === "dark" ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      colors: tokens.colors,
      gradients: tokens.gradients,
      components: tokens.components,
      typography: tokens.typography,
      setMode,
      toggleMode,
    }),
    [mode, tokens, setMode, toggleMode]
  );

  if (!booted) return null;
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useAppTheme must be used within ThemeProvider");
  return ctx;
}