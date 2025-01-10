import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  SafeAreaView,
  TouchableWithoutFeedback,
  StyleSheet,
  Keyboard,
  Text,
  Platform,
} from "react-native";
import { fetchUserDetails } from "../../utils/apiService";
import { getToken } from "../../utils/tokenFunction";

const Home = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch User Details
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const tokenFromStore = await getToken();
      setToken(tokenFromStore);
      if (!tokenFromStore) throw new Error("No se encontró un token válido.");

      const data = await fetchUserDetails(tokenFromStore);
      setUserData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Header title="Bienvenido" />
          <Content
            loading={loading}
            error={error}
            data={userData}
            token={token}
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

// Header Component
const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Text style={styles.headerText}>{title}</Text>
  </View>
);

// Content Component
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
    justifyContent: "center",
    alignItems: "center",
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
