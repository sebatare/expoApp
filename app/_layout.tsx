import { Stack } from "expo-router";
import { EquipoProvider } from "@/context/EquipoContext";
import { ReservaProvider } from "@/context/reserva/ReservaContext";
import { UserProvider } from "@/context/user/UserContext";
export default function RootLayout() {
  return (
    <UserProvider>
      <EquipoProvider>
        <ReservaProvider>
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ title: "_layoutstackscreen tabs)", headerShown: false }}
            />
          </Stack>
        </ReservaProvider>
      </EquipoProvider>
    </UserProvider>

  );
}
