import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, TextInput, View, type TextInputProps } from "react-native";

import { useTheme } from "@/hooks/use-theme";

type Props = TextInputProps & { secure?: boolean };

export function TextField({ secure, ...rest }: Props) {
  const { theme } = useTheme();
  const [hidden, setHidden] = useState(true);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.field,
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
      }}
    >
      <TextInput
        style={{ flex: 1, fontSize: 17, color: theme.text, padding: 0 }}
        placeholderTextColor={theme.muted}
        secureTextEntry={secure && hidden}
        {...rest}
      />
      {secure ? (
        <Pressable
          testID="toggle-password"
          hitSlop={12}
          onPress={() => setHidden((h) => !h)}
        >
          <SymbolView
            name={hidden ? "eye" : "eye.slash"}
            size={20}
            tintColor={theme.muted}
          />
        </Pressable>
      ) : null}
    </View>
  );
}
