import type { ConfigContext, ExpoConfig } from "expo/config";

// Per-environment backend targets. APP_ENV (set by the start script) picks one,
// so a staging build talks to the staging API/DB and a prod build to prod.
const ENVS = {
  staging: {
    apiUrl: "http://localhost:3001",
    supabaseUrl: "http://127.0.0.1:54321",
  },
  production: {
    apiUrl: "http://localhost:3002",
    supabaseUrl: "http://127.0.0.1:55321",
  },
} as const;

type AppEnv = keyof typeof ENVS;

export default ({ config }: ConfigContext): ExpoConfig => {
  const appEnv = (process.env.APP_ENV ?? "staging") as AppEnv;
  const target = ENVS[appEnv] ?? ENVS.staging;

  return {
    ...config,
    name: config.name ?? "mobile",
    slug: config.slug ?? "mobile",
    extra: {
      ...config.extra,
      appEnv,
      apiUrl: target.apiUrl,
      supabaseUrl: target.supabaseUrl,
      // Anon key is per-env and regenerated; injected at start (see scripts).
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "",
    },
  };
};
