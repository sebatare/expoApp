import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ title: "_layoutstackscreen tabs)", headerShown: false, }}
      />

    </Stack>
  );
}
