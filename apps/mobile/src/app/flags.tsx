import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Pill } from "@/components/pill";
import { PrimaryButton } from "@/components/primary-button";
import { env } from "@/config/env";
import { gateColor } from "@/config/theme";
import { useSession } from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import { api, type Flag } from "@/lib/api";
import { supabase } from "@/lib/supabase";

function formatFlagKey(key: string) {
  const words = key.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function gateOf(flag: Flag): keyof typeof gateColor | null {
  if (flag.requires_premium) return "premium";
  if (flag.requires_beta) return "beta";
  return null;
}

export default function FlagsScreen() {
  const { theme, isDark, setDark } = useTheme();
  const { session, loading: sessionLoading } = useSession();
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [demoFlag, setDemoFlag] = useState<Flag | null>(null);

  useEffect(() => {
    if (!session) return;
    api.flags
      .list()
      .then(setFlags)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [session]);

  if (!sessionLoading && !session) return <Redirect href="/" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: "800", color: theme.text }}>
            Flags
          </Text>
          <Pill testID="env-badge" label={env.name.toUpperCase()} />
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <Text testID="flags-error" style={{ marginTop: 28, color: "#DC2626" }}>
            {error}
          </Text>
        ) : (
          <ScrollView
            style={{ marginTop: 28 }}
            contentContainerStyle={{ gap: 12 }}
            showsVerticalScrollIndicator={false}
          >
            {flags.map((flag) => {
              const gate = gateOf(flag);
              const isDarkMode = flag.key === "dark_mode";
              return (
                <Pressable
                  key={flag.key}
                  testID={`flag-card-${flag.key}`}
                  onPress={isDarkMode ? undefined : () => setDemoFlag(flag)}
                  style={({ pressed }) => ({
                    padding: 18,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: theme.border,
                    backgroundColor: theme.card,
                    gap: 6,
                    opacity: pressed && !isDarkMode ? 0.7 : 1,
                  })}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        flexShrink: 1,
                      }}
                    >
                      <Text
                        testID={`flag-${flag.key}`}
                        style={{ fontSize: 16, fontWeight: "700", color: theme.text }}
                      >
                        {formatFlagKey(flag.key)}
                      </Text>
                      {gate ? (
                        <Pill label={gate.toUpperCase()} color={gateColor[gate]} />
                      ) : null}
                    </View>
                    {isDarkMode ? (
                      <Switch
                        testID="dark-mode-switch"
                        value={isDark}
                        onValueChange={setDark}
                        // Colors stay constant across light/dark. If they were
                        // theme-derived, the theme swap on toggle would change
                        // them mid-animation and iOS resets the switch (it
                        // flashes blank then redraws). Accent is env-based, so
                        // it's the same value in both modes.
                        trackColor={{ false: "#9A9AA1", true: theme.accent }}
                        thumbColor="#FFFFFF"
                        ios_backgroundColor="#9A9AA1"
                      />
                    ) : null}
                  </View>
                  {flag.description ? (
                    <Text style={{ fontSize: 14, color: theme.muted }}>
                      {flag.description}
                    </Text>
                  ) : null}
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        <View style={{ paddingVertical: 16 }}>
          <PrimaryButton
            testID="signout-button"
            label="Sign out"
            variant="secondary"
            onPress={() => supabase.auth.signOut()}
          />
        </View>
      </View>

      <Modal
        visible={demoFlag !== null}
        animationType="slide"
        transparent
        onRequestClose={() => setDemoFlag(null)}
      >
        <Pressable
          style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "#00000066" }}
          onPress={() => setDemoFlag(null)}
        >
          <Pressable
            testID="demo-modal"
            style={{
              backgroundColor: theme.card,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 40,
              gap: 14,
            }}
          >
            <View
              style={{
                alignSelf: "center",
                width: 40,
                height: 4,
                borderRadius: 999,
                backgroundColor: theme.border,
              }}
            />
            <Text style={{ fontSize: 22, fontWeight: "800", color: theme.text }}>
              {demoFlag ? formatFlagKey(demoFlag.key) : ""}
            </Text>
            <Text style={{ fontSize: 15, lineHeight: 22, color: theme.muted }}>
              Demo only. This feature flag is boilerplate showing
              environment-gated configuration served from the backend. No
              behavior is wired up behind it yet, unlike Dark mode, which
              actually toggles the app theme.
            </Text>
            <PrimaryButton
              testID="demo-modal-close"
              label="Got it"
              onPress={() => setDemoFlag(null)}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
