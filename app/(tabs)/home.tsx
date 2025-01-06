import {
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Text,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";

export default function Home() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      await fetchUserDetails();
    };
    fetchData();
  }, []);

  const fetchUserDetails = async () => {
    try {
      // OBTENER TOKEN
      const token = await SecureStore.getItemAsync("jwtToken");
      setToken(token);
      console.log("TOKEN GUARADO EN SECURE STORE:");
      console.log(token);

      // PETICIÓN RESTRINGIDA
      const response = await fetch("http://localhost:5214/user-details", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User Details:", data);
    } catch (error) {
      console.error("Error en la petición de información:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text>Bienvenido</Text>
          {token ? (
            <Text>Token: {token}</Text>
          ) : (
            <Text>Cargando token...</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});