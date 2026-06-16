import { Text, View } from "react-native";

import { theme } from "@/config/theme";

type Props = {
  label: string;
  color?: string;
  testID?: string;
};

export function Pill({ label, color = theme.accent, testID }: Props) {
  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 999,
        backgroundColor: `${color}1A`,
      }}
    >
      <Text
        testID={testID}
        style={{ fontSize: 11, fontWeight: "700", letterSpacing: 0.4, color }}
      >
        {label}
      </Text>
    </View>
  );
}
