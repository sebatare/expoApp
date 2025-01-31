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
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import HoraSelectorModal from "@/components/HoraSelector";
import FechaSelectorModal from "@/components/FechaSelector";
import sedesImagesMapping from "@/utils/sedesImagesMapping";
import CanchaSelector from "@/components/CanchaSelector";
import { XCircle, Expand } from "lucide-react-native";
import BuscarAmigos from "@/components/BuscarAmigos";

const CrearReserva = () => {
  const { data } = useLocalSearchParams();
  const [sede, setSede] = useState<any | null>(null);
  const [equipo, setEquipo] = useState<string[]>([]);
  const [expandido, setExpandido] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
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

  if (!sede) {
    return (
      <View style={styles.container}>
        <Text>Cargando información de la cancha...</Text>
      </View>
    );
  }

  const imageSource = sedesImagesMapping[sede.imageUrl];
  const agregarJugador = () => {
    const nuevoJugador = `Jugador ${equipo.length + 1}`;
    setEquipo([...equipo, nuevoJugador]);
  };

  const eliminarJugador = (index: number) => {
    setEquipo(equipo.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={imageSource}
        style={styles.imageBackground}
        blurRadius={5}
      >
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Text style={styles.title}>{sede.nombre}</Text>
          <Text style={styles.description}>{sede.descripcion}</Text>
          <View style={styles.modalcontainer}>
            <FechaSelectorModal unavailableDates={unavailableDates} />
            <HoraSelectorModal blockedHours={blockedHours} />
          </View>
          <CanchaSelector reserva={undefined} sede={sede.id} />

          <View
            style={[
              styles.equipocontainer,
              expandido ? styles.equipocontainerExpanded : {},
            ]}
          >
            <View style={styles.equipoHeader}>
              <TouchableOpacity
                onPress={() => setExpandido(!expandido)}
                style={styles.expandButton}
              >
                <Expand size={24} color={"#fff"} />
              </TouchableOpacity>
              <Text style={styles.titleEquipo}>Equipo</Text>
              <BuscarAmigos
                agregarAlEquipo={(user) =>
                  setEquipo([...equipo, `${user.firstName} ${user.lastName}`])
                }
              />
            </View>

            <FlatList
              data={equipo}
              keyExtractor={(item, index) => index.toString()}
              style={{ maxHeight: expandido ? 500 : 300 }}
              renderItem={({ item, index }) => (
                <Animated.View style={styles.jugadorContainer}>
                  <Text style={styles.jugadorText}>{item}</Text>
                  <TouchableOpacity onPress={() => eliminarJugador(index)}>
                    <XCircle size={20} color={"#ff4d4d"} />
                  </TouchableOpacity>
                </Animated.View>
              )}
            />
          </View>
        </Animated.View>
      </ImageBackground>
    </View>
  );
};

export default CrearReserva;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.17)",
    padding: 20,
    borderRadius: 10,
  },
  titleEquipo: {
    fontSize: 20,
    color: "rgb(22, 22, 22)",
    fontWeight: "500",
  },
  equipoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#4CAF50",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  equipocontainer: {
    marginHorizontal: 30,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingBottom: 15,
    marginTop: 20,
    overflow: "hidden",
  },
  equipocontainerExpanded: {
    maxHeight: 600,
  },
  expandButton: {
    backgroundColor: "#388E3C",
    padding: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#388E3C",
    padding: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  jugadorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 10,
    marginVertical: 5,
  },
  jugadorText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  description: {
    color: "rgb(255, 255, 255)",
    fontSize: 20,
    textAlign: "center",
    fontWeight: "500",
  },
  title: {
    fontSize: 54,
    fontWeight: "bold",
    marginVertical: 30,
    color: "#fff",
    textAlign: "center",
  },
  modalcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    marginVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  imageBackground: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
