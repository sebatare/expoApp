import { router, Stack } from "expo-router";

export default function CanchasLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Canchas cerca de :", headerShown: true }}
      />
      <Stack.Screen
        name="CrearReserva"
        options={{
          title: "Realizar reserva"
        }}
      />
    </Stack>
  );
}
