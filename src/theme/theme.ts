import type { ThemeMode, ThemeContextValue } from "./types";
import { LIGHT_THEME_TOKENS } from "./theme.light";
import { DARK_THEME_TOKENS } from "./theme.dark";


export function generateAppTheme(mode: ThemeMode): Pick<
  ThemeContextValue,
  "colors" | "gradients" | "components" | "typography"
> {
  return mode === "dark" ? DARK_THEME_TOKENS : LIGHT_THEME_TOKENS;
}