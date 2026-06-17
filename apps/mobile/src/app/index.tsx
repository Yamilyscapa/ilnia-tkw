import { Redirect } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Pill } from "@/components/pill";
import { PrimaryButton } from "@/components/primary-button";
import { TextField } from "@/components/text-field";
import { env } from "@/config/env";
import { useSession } from "@/hooks/use-session";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/lib/supabase";

export default function SignInScreen() {
  const { theme } = useTheme();
  const { session, loading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) return <Redirect href="/flags" />;

  async function onSignIn() {
    setError(null);
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) setError(error.message);
    // On success, the session listener routes to /flags via the guard above.
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
            Sign in
          </Text>
          <Pill testID="env-badge" label={env.name.toUpperCase()} />
        </View>
        <Text style={{ marginTop: 8, fontSize: 16, color: theme.muted }}>
          View your environment's feature flags.
        </Text>

        <View style={{ marginTop: 40, gap: 12 }}>
          <TextField
            testID="email-input"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TextField
            testID="password-input"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secure
          />
          {error ? (
            <Text testID="signin-error" style={{ color: "#DC2626", fontSize: 14 }}>
              {error}
            </Text>
          ) : null}
          <PrimaryButton
            testID="signin-button"
            label={submitting ? "Signing in…" : "Sign in"}
            onPress={onSignIn}
          />
        </View>

        <Text
          style={{
            marginTop: "auto",
            textAlign: "center",
            fontSize: 13,
            color: theme.muted,
          }}
        >
          {env.apiUrl}
        </Text>
        <Text
          style={{
            marginTop: 8,
            marginBottom: 12,
            textAlign: "center",
            fontSize: 13,
            color: theme.muted,
          }}
        >
          Developer: Yamil Yscapa
        </Text>
      </View>
    </SafeAreaView>
  );
}
