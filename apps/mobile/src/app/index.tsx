import { router } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Pill } from "@/components/pill";
import { PrimaryButton } from "@/components/primary-button";
import { TextField } from "@/components/text-field";
import { env } from "@/config/env";
import { theme } from "@/config/theme";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSignIn() {
    // TODO: sign in via Supabase Auth + persist session, then route on success.
    router.replace("/flags");
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
          <PrimaryButton testID="signin-button" label="Sign in" onPress={onSignIn} />
        </View>

        <Text
          style={{
            marginTop: "auto",
            marginBottom: 12,
            textAlign: "center",
            fontSize: 13,
            color: theme.muted,
          }}
        >
          {env.apiUrl}
        </Text>
      </View>
    </SafeAreaView>
  );
}
