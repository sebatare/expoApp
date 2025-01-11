import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Text,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";
import { fetchAllSedes } from "@/utils/apiService";
import { getToken, clearToken } from "../../utils/tokenFunction";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
const Home = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [sedeData, setSedeData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const insets = useSafeAreaInsets(); // Usamos los márgenes seguros

  // Fetch User Details
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenFromStore = await getToken();
      setToken(tokenFromStore);
      if (!tokenFromStore) throw new Error("No se encontró un token válido.");

      const data = await fetchAllSedes();
      setSedeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  const singOut = async () => {
    clearToken();
    router.replace("/(tabs)");//NO HAY QUE ESCRIBIR, SOLO DIRIGIAR A LA CARPETA EN LA QUE SE ENCUETRA EL ARCHIVO
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "orange",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Ajuste para iOS y Android
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.container}>
              <Text>Lista</Text>
              <FlatList
                data={sedeData}
                renderItem={({ item }) => <Text>{item.nombre}</Text>}
                horizontal={true}
              />

              {/* Aquí estamos envolviendo el TextInput con un ScrollView */}
              <TextInput placeholder="INGRESE TEXTO" />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Pressable
        style={{
          padding: 10,
          backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center", // Esto asegura que el texto esté centrado dentro del botón
          width: "40%", // Ancho del botón
          borderRadius: 5, // Esquinas redondeadas (opcional, si quieres)
          marginHorizontal: "auto", // Centra el botón en la vista
        }}
        onPress={() => {
          // Cerrar sesión
          singOut();
        }}
      >
        <Text>Cerrar Sesión</Text>
      </Pressable>
    </SafeAreaView>
  );
};

// Header Component
const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

// Content es un componenete que me esta mostrando la informacion del token bajo una condicion.
// Si el token no existe, me muestra un mensaje de que no hay token, si el token existe me muestra el Content.
const Content = ({
  loading,
  error,
  data,
  token,
}: {
  loading: boolean;
  error: string | null;
  data: any;
  token: string | null;
}) => {
  if (loading) return <Text>Cargando...</Text>;
  if (error) return <Text style={styles.errorText}>Error: {error}</Text>;

  return (
    <View style={styles.content}>
      {data && data.email ? (
        <Text>Email: {data.email}</Text>
      ) : (
        <Text>No se encontró información del usuario.</Text>
      )}
      <TokenDisplay token={token} />
    </View>
  );
};

// Token Display Component
const TokenDisplay = ({ token }: { token: string | null }) => (
  <View style={styles.tokenContainer}>
    <Text style={styles.tokenTitle}>Token desde SecureStore:</Text>
    {token ? (
      <Text style={styles.token}>{token}</Text>
    ) : (
      <Text>No hay token</Text>
    )}
  </View>
);

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "orange", // Para ver el impacto del área segura
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    alignItems: "center",
  },
  errorText: {
    color: "red",
  },
  tokenContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  tokenTitle: {
    fontWeight: "bold",
  },
  token: {
    marginTop: 10,
    fontSize: 12,
    color: "gray",
  },
});

export default Home;
