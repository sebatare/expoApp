import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { getToken, storeToken } from "../utils/tokenFunction";
import { fetchLogin } from "@/services/apiService";
import { jwtDecode } from "jwt-decode";
import { useUser } from "@/context/user/UserContext";
import { JwtPayload } from "@/types/JwtPayload";

export default function () {
  const { dispatch } = useUser();
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
    try {
      const data = await fetchLogin(email, password);
      const token = data.token;

      // 1. Decodificar el JWT
      const decoded = jwtDecode<JwtPayload>(token);

      // 2. Guardar token en almacenamiento seguro
      await storeToken(token);
      dispatch({ type: "SET_ID", payload: decoded.nameid });
      dispatch({ type: "SET_EMAIL", payload: decoded.email });
      // 4. Redireccionar al home
      Alert.alert("Éxito", data.message || "Inicio de sesión exitoso");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Hubo un problema con el inicio de sesión");
    }
  };




  useEffect(() => {
    const checkToken = async () => {
      // Verificar si ya hay un token guardado
      if (await getToken()) {
        router.replace("/home");
      }
    };
    checkToken();
    ``;
  }, []);

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
