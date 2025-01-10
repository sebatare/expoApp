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
  Platform,
} from "react-native";
import { storeToken } from "../../utils/tokenFunction";

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

  const getApiUrl = () => {
    // Detecta si está en un dispositivo o emulador de Android/iOS
    if (Platform.OS === "android") {
      // Emulador de Android usa 10.0.2.2
      return "http://10.0.2.2:5214/login"; // Emulador Android

      // Para Android físico, usa la IP local de tu máquina:
      // return "http://<IP_LOCAL_DE_TU_MAQUINA>:5214/login";
    } else if (Platform.OS === "ios") {
      // Emulador iOS usa localhost
      //return "http://localhost:5214/login"; // Emulador iOS

      // Para iOS físico, usa la IP local de tu máquina:
      return "http://192.168.1.188:5214/login";
    }

    return "http://localhost:5214/login"; // En caso de que no sea Android ni iOS, por defecto
  };
  const handleLogin = async () => {
    const url = getApiUrl();

    const payload = {
      email: email,
      password: password,
      rememberMe: true,
    };
    console.log("URL:", url);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert("Error", errorData.message || "Login failed");
        return;
      }

      const data = await response.json();
      const token = data.token;

      // Guardar el token según el entorno
      await storeToken(token);

      Alert.alert("Success", data.message);
      router.replace("/home");
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      Alert.alert("Error", "Hubo un problema con la solicitud.");
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
