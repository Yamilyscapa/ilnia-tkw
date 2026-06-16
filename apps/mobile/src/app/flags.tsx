import { router } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Pill } from "@/components/pill";
import { PrimaryButton } from "@/components/primary-button";
import { env } from "@/config/env";
import { gateColor, theme } from "@/config/theme";

function formatFlagKey(key: string) {
  const words = key.replace(/_/g, " ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

// TODO: replace with a fetch to `${env.apiUrl}/api/flags` using the session token.
const PLACEHOLDER_FLAGS = [
  { key: "dark_mode", description: "Dark theme for everyone", gate: null },
  { key: "new_ui", description: "Redesigned UI, staging only", gate: null },
  { key: "premium_reports", description: "Advanced analytics", gate: "premium" },
  { key: "beta_chat", description: "Experimental in-app chat", gate: "beta" },
] as const;

export default function FlagsScreen() {
  function onSignOut() {
    // TODO: clear persisted session.
    router.replace("/");
  }

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

        <ScrollView
          style={{ marginTop: 28 }}
          contentContainerStyle={{ gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {PLACEHOLDER_FLAGS.map((flag) => (
            <View
              key={flag.key}
              style={{
                padding: 18,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.card,
                gap: 6,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Text
                  testID={`flag-${flag.key}`}
                  style={{ fontSize: 16, fontWeight: "700", color: theme.text }}
                >
                  {formatFlagKey(flag.key)}
                </Text>
                {flag.gate ? (
                  <Pill label={flag.gate.toUpperCase()} color={gateColor[flag.gate]} />
                ) : null}
              </View>
              <Text style={{ fontSize: 14, color: theme.muted }}>
                {flag.description}
              </Text>
            </View>
          ))}
        </ScrollView>

        <View style={{ paddingVertical: 16 }}>
          <PrimaryButton
            testID="signout-button"
            label="Sign out"
            variant="secondary"
            onPress={onSignOut}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
