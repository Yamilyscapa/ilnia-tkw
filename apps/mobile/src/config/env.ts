import Constants from "expo-constants";

type AppEnv = "staging" | "production";

const extra = Constants.expoConfig?.extra ?? {};

export const env = {
  name: (extra.appEnv ?? "staging") as AppEnv,
  apiUrl: extra.apiUrl as string,
  supabaseUrl: extra.supabaseUrl as string,
  supabaseAnonKey: extra.supabaseAnonKey as string,
};
