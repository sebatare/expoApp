import React, { useEffect, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
  Animated,
  Text,
} from "react-native";
import { getToken, clearToken } from "../../../utils/tokenFunction";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { User, Goal, Atom, LogOut } from "lucide-react-native";
import NextMatchTemporizater from "@/components/NextMatchTemporizater";

const Home = () => {
  const router = useRouter();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  const insets = useSafeAreaInsets(); // Usamos los márgenes seguros
  //OBTENER TOKEN
  const getTokenJwt = useCallback(async () => {
    try {
      //OBTENER TOKEN JWT
      const tokenFromStore = await getToken();
      if (!tokenFromStore) throw new Error("No se encontró un token válido.");
    } catch (err) {
      console.log(err);
      router.replace("/"); // Redirige a la ruta
    }
  }, []);

  //CIERRE DE SESION
  const singOut = async () => {
    Alert.alert(
      "Cerrar sesión", // Título del alert
      "¿Estás seguro de que deseas cerrar sesión?", // Mensaje del alert
      [
        {
          text: "Cancelar", // Texto del botón de cancelar
          onPress: () => console.log("Cancelado"), // Acción al presionar cancelar
          style: "cancel", // Estilo del botón (en iOS se muestra diferente)
        },
        {
          text: "Sí, cerrar sesión", // Texto del botón de confirmación
          onPress: async () => {
            // Acción al confirmar
            await clearToken();
            router.replace("/"); // Redirige a la ruta especificada
          },
          style: "destructive", // Estilo de advertencia (iOS)
        },
      ],
      { cancelable: true } // Permite cerrar el alert al presionar fuera de él
    );
  };

  useEffect(() => {
    getTokenJwt();
  }, [getTokenJwt]);

  const AnimatedButton = ({
    onPress,
    children,
  }: {
    onPress?: () => void;
    children: React.ReactNode;
  }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 200,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start();
    };

    return (
      <AnimatedPressable
        style={[styles.pressable, { transform: [{ scale: scaleAnim }] }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {children}
      </AnimatedPressable>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <View style={styles.user}>
        <User style={{marginLeft:5}} color={"black"} size={80} />
        <View style={styles.userinfocontainer}>
          <Text style={styles.name}>Sebastian Tapia</Text>
          <Text style={styles.rol}>Portero</Text>
        </View>
        <Pressable style={styles.logout} onPress={singOut}>
          <LogOut color={'rgb(207, 0, 0)'}/>
        </Pressable>
      </View>
      <View>
        <Text style={styles.subtitle}>Next Match:</Text>
        <View style={styles.timercontainer}>
          <NextMatchTemporizater
            targetTime={new Date("2025-01-24T19:00:00Z")}
          />
        </View>
      </View>
      <View style={styles.iconcontainer}>
        <AnimatedButton>
          <Goal color={"black"} size={30} />
        </AnimatedButton>
        <AnimatedButton>
          <Atom color={"black"} size={30} />
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
};

// Content es un componenete que me esta mostrando la informacion del token bajo una condicion.
// Si el token no existe, me muestra un mensaje de que no hay token, si el token existe me muestra el Content.

// Styles
const styles = StyleSheet.create({
  logout:{
    marginLeft: 40,
  },
  pressable: {
    backgroundColor: "rgb(255, 255, 255)",
    width: 130,
    height: 130,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  iconcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  timercontainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  subtitle: {
    color: "rgb(212, 212, 212)",
    fontSize: 20,
    fontStyle: "italic",
    textDecorationLine: "underline",
    // shadowColor: "rgb(255, 255, 255)",
    // shadowOffset:{
    //   height: 5,
    //   width: 5,
    // },
    // shadowOpacity: 0.3,
    padding: 20,
    textShadowColor: "rgba(255, 255, 255, 0.31)",
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 3,
  },
  rol: {
    textDecorationLine: "underline",
    fontSize: 15,
    color: "rgb(49, 49, 49)",
  },
  name: {
    fontSize: 25,
    fontWeight: "bold",
  },
  userinfocontainer: {
    marginLeft: 30,
  },
  user: {
    height: 150,
    backgroundColor: "rgb(255, 255, 255)",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  container: {
    flex: 1,
    backgroundColor: "rgb(25, 25, 25)",
  },
});

export default Home;
