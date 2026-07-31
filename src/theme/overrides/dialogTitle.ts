import { Theme } from "@mui/material";

export function dialogTitle(theme: Theme) {
  return {
    styleOverrides: {
      root: {
        padding: '16px 24px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
        fontSize: '1.25rem',
        fontWeight: 700,
        lineHeight: 1.6,
        letterSpacing: '0.0075em',
        color: theme.palette.primary.dark,
      },
    },
  }
}