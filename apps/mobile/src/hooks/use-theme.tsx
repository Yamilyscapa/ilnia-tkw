import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { themes, type Theme, type ThemeMode } from "@/config/theme";

type ThemeContextValue = {
  mode: ThemeMode;
  theme: Theme;
  isDark: boolean;
  setDark: (on: boolean) => void;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme: themes[mode],
      isDark: mode === "dark",
      setDark: (on) => setMode(on ? "dark" : "light"),
      toggle: () => setMode((m) => (m === "dark" ? "light" : "dark")),
    }),
    [mode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
