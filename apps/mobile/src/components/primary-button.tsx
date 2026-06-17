import { Pressable, Text } from "react-native";

import { useTheme } from "@/hooks/use-theme";

type Props = {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  testID?: string;
};

export function PrimaryButton({ label, onPress, variant = "primary", testID }: Props) {
  const { theme } = useTheme();
  const primary = variant === "primary";

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      style={({ pressed }) => ({
        height: 58,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: primary ? theme.primary : "transparent",
        borderWidth: primary ? 0 : 1,
        borderColor: theme.border,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          fontSize: 17,
          fontWeight: "700",
          color: primary ? theme.onPrimary : theme.text,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
