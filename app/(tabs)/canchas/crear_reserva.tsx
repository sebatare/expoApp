import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Animated,
  Easing,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import HoraSelectorModal from "@/components/HoraSelector";
import FechaSelectorModal from "@/components/FechaSelector";
import sedesImagesMapping from "@/utils/sedesImagesMapping";
import CanchaSelector from "@/components/CanchaSelector";
import { XCircle } from "lucide-react-native";
import BuscarAmigos from "@/components/BuscarAmigos";
import { useEquipo } from "@/context/EquipoContext";

const CrearReserva = () => {
  const { data } = useLocalSearchParams();
  const [sede, setSede] = useState<any | null>(null);

  // Equipo global (lista de usuarios) y dispatch para eliminar
  const { equipo, dispatch } = useEquipo();

  // Animación de opacidad
  const fadeAnim = useState(new Animated.Value(0))[0];

  // Horas y fechas bloqueadas (ejemplo)
  const blockedHours = ["10:00", "12:00", "15:00"];
  const unavailableDates = ["2025-01-28", "2025-01-29", "2025-02-03"];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, []);

  // Parsear los datos de la cancha
  useEffect(() => {
    if (data) {
      try {
        const parsedItem = JSON.parse(Array.isArray(data) ? data[0] : data);
        setSede(parsedItem);
      } catch (error) {
        console.error("Error al parsear el objeto cancha:", error);
      }
    }
  }, [data]);

  // Mientras no haya sede, mostramos un loader simple
  if (!sede) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Cargando información de la cancha...</Text>
      </View>
    );
  }

  // Imagen de fondo según la sede
  const imageSource = sedesImagesMapping[sede.imageUrl];

  // Eliminar jugador del equipo
  const eliminarJugador = (userId: string) => {
    dispatch({ type: "ELIMINAR_USUARIO", payload: userId });
  };

  // Cabecera de la lista (título, descripción, botones de fecha/hora, etc.)
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Título y descripción */}
      <Text style={styles.title}>{sede.nombre}</Text>
      <Text style={styles.description}>{sede.descripcion}</Text>

      {/* Selectores de fecha/hora */}
      <View style={styles.modalcontainer}>
        <FechaSelectorModal unavailableDates={unavailableDates} />
        <HoraSelectorModal blockedHours={blockedHours} />
      </View>

      {/* Selector de canchas */}
      <CanchaSelector reserva={undefined} sede={sede.id} />

      {/* Contenedor "Equipo" + botón de buscar amigos */}
      <View style={styles.equipocontainer}>
        <View style={styles.equipoHeader}>
          <Text style={styles.titleEquipo}>Equipo</Text>
          <BuscarAmigos />
        </View>
      </View>
    </View>
  );

  // Cada elemento (jugador) en la lista
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.jugadorContainer}>
      <Text style={styles.jugadorText}>
        {item.firstName} {item.lastName}
      </Text>
      <TouchableOpacity onPress={() => eliminarJugador(item.id)}>
        <XCircle size={20} color={"#ff4d4d"} />
      </TouchableOpacity>
    </View>
  );

  // Pie de la lista (botón "Solicitar")
  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <TouchableOpacity style={styles.solicitarButton}>
        <Text style={styles.solicitarButtonText}>Solicitar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // Imagen de fondo que cubre toda la pantalla
    <ImageBackground source={imageSource} style={styles.imageBackground} blurRadius={5}>
      {/* Capa semi-transparente para oscurecer la imagen */}
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        {/* SafeAreaView para no chocar con la barra superior */}
        <SafeAreaView style={{ flex: 1 }}>
          <FlatList
            data={equipo}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            contentContainerStyle={styles.listContent}
          />
        </SafeAreaView>
      </Animated.View>
    </ImageBackground>
  );
};

export default CrearReserva;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageBackground: {
    flex: 1, // ocupa toda la pantalla
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // oscurece un poco el fondo
    padding: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  description: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 5,
  },
  modalcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  equipocontainer: {
    marginTop: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  equipoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  titleEquipo: {
    fontSize: 20,
    color: "#161616",
    fontWeight: "500",
  },
  jugadorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderRadius: 8,
    marginTop: 5,
  },
  jugadorText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  footerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  solicitarButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  solicitarButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
