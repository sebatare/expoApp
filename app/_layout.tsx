import { Stack } from "expo-router";
import { EquipoProvider } from "@/context/EquipoContext";

export default function RootLayout() {
  return (
    <EquipoProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ title: "_layoutstackscreen tabs)", headerShown: false }}
        />
      </Stack>
    </EquipoProvider>
  );
}
