import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Keyboard,
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";

export default function HomeScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const router = useRouter();

  const validateEmail = (text: string): void => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(text)) {
      setEmailError("Por favor, ingresa un correo válido");
    } else {
      setEmailError("");
    }
    setEmail(text);
  };
  const handleLogin = async () => {
    const url = "http://localhost:5214/login"; // Asegúrate de usar la URL correcta
    const payload = {
      email: email,
      password: password,
      rememberMe: true,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert("Success", data.message); // Mostrar mensaje de éxito
        console.log("Token:", data.token); // Mostrar el token en consola
        const token = data.token;
        // Guarda el token en SecureStore
        await SecureStore.setItemAsync("jwtToken", token);

        //LOGIN EXITOSO
        router.replace("/home")
      } else {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Error during login:", error);

      if (error instanceof TypeError) {
        // Error relacionado con la red o la conexión
        Alert.alert(
          "Network Error",
          "Failed to connect to the server. Please check your network."
        );
      } else if (error.message) {
        // Si el error tiene un mensaje, lo mostramos
        Alert.alert("Error", `An unexpected error occurred: ${error.message}`);
      } else {
        // Otros errores desconocidos
        Alert.alert("Error", "An unknown error occurred.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.safearea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <TextInput
            placeholder="Email"
            style={styles.email}
            keyboardType="email-address"
            onChangeText={validateEmail}
            value={email}
          />

          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}

          <TextInput
            placeholder="Password"
            style={styles.password}
            secureTextEntry // Para ocultar la contraseña
            onChangeText={setPassword}
          />

          <Button
            title="Alert"
            onPress={() => Alert.alert("Cannot press this one")}
          />

          <Button title="Login" onPress={handleLogin} />

          <TouchableOpacity>
            <Text>Iniciar Sesión</Text>
          </TouchableOpacity>
          <Link href="/home" asChild>
            <Pressable>
              <Text style={styles.pressableText}>
                INICIAR SESION CON PRESSABLE
              </Text>
            </Pressable>
          </Link>

          <Text style={styles.superTexto}>SUPER TEXTO</Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: "rgb(49, 49, 49)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    padding: 10,
    fontSize: 24,
    color: "white",
  },
  email: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
  },
  errorText: {
    color: "rgb(207, 74, 74)",
    fontSize: 12,
    marginBottom: 8,
  },
  password: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: "80%",
  },
  superTexto: {
    color: "white",
    fontSize: 40,
    paddingTop: 110,
  },
  pressableText: {
    color: "orange",
    fontSize: 20,
    padding: 10,
  },
});
