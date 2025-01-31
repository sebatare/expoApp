import { Tabs } from "expo-router";
import { DoorClosed, House, Handshake } from "lucide-react-native";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          display: route.name === "/canchas/crear_reserva" ? "none" : "flex",
        },
      })}
    >
      <Tabs.Screen
        name="club/index"
        options={{
          title: "Mi Club",
          headerShown: true,
          tabBarIcon: () => <DoorClosed color={"black"} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: () => <House color={"black"} />,
          
        }}
      />
      <Tabs.Screen
        name="canchas"
        options={{
          title: "Canchas",
          headerShown: false,
          tabBarIcon: () => <Handshake color={"black"} />,
          
        }}
      />
    </Tabs>
  );
}
