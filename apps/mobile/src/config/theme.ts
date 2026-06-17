import { env } from "./env";

// The environment owns the accent. Staging is amber, production is green —
// a glanceable signal of which backend the build is pointed at.
const ACCENTS = {
  staging: "#E0930C",
  production: "#16A34A",
} as const;

const accent = ACCENTS[env.name] ?? ACCENTS.staging;

export type Theme = {
  bg: string;
  field: string;
  card: string;
  border: string;
  text: string;
  muted: string;
  link: string;
  primary: string;
  onPrimary: string;
  accent: string;
};

export const lightTheme: Theme = {
  bg: "#FFFFFF",
  field: "#F3F3F4",
  card: "#FFFFFF",
  border: "#ECECEE",
  text: "#0A0A0B",
  muted: "#9A9AA1",
  link: "#2563EB",
  primary: "#0A0A0B",
  onPrimary: "#FFFFFF",
  accent,
};

export const darkTheme: Theme = {
  bg: "#0A0A0B",
  field: "#1C1C1F",
  card: "#161617",
  border: "#2A2A2E",
  text: "#FAFAFA",
  muted: "#8A8A91",
  link: "#60A5FA",
  primary: "#FAFAFA",
  onPrimary: "#0A0A0B",
  accent,
};

export type ThemeMode = "light" | "dark";

export const themes: Record<ThemeMode, Theme> = {
  light: lightTheme,
  dark: darkTheme,
};

export const gateColor = {
  premium: "#E0930C",
  beta: "#7C3AED",
} as const;
