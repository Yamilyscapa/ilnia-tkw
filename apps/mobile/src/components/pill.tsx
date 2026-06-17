import { Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

type Props = {
  label: string;
  color?: string;
  testID?: string;
};

export function Pill({ label, color, testID }: Props) {
  const { theme } = useTheme();
  const tint = color ?? theme.accent;
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: `${tint}1A`,
      }}
    >
      <Text
        testID={testID}
        style={{ fontSize: 11, fontWeight: "700", letterSpacing: 0.4, color: tint }}
      >
        {label}
      </Text>
    </View>
  );
}
