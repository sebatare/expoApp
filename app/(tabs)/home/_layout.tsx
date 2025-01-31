import { router, Stack } from "expo-router";
import { Button } from "react-native";

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Informacion de usuario", headerShown: false }}
      />
    </Stack>
  );
}
