import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fetchCanchasBySede } from "@/services/apiService";
import { useReserva } from "@/context/reserva/ReservaContext";
type Cancha = {
  nombre: string;
  id: number;
};

type Props = {
  sede: number;
};

const CanchaSelector = ({ sede }: Props) => {
  const { reserva, dispatch } = useReserva(); // Obtenemos el estado de reserva del contexto
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const selectedCancha = canchas.find(c => c.id === reserva.canchaId) || null;

  // Simulación de llamada a un endpoint (puedes reemplazarlo con fetch)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCanchasBySede(sede);
        setCanchas(response);

      } catch (error) {
        console.error("Error al cargar las canchas:", error);
      }
    };
    fetchData();
  }, []);

  // Función para manejar la selección de una cancha
  const handleSelectCancha = (cancha: Cancha) => {
    dispatch({ type: "SET_CANCHA_ID", payload: cancha.id });
    setIsModalVisible(false);
  };

  return (
    <View>
      {/* Botón para abrir el modal */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>
          {selectedCancha ? `${selectedCancha.nombre}` : "Canchas disponibles"}
        </Text>
      </TouchableOpacity>

      {/* Modal con la lista de canchas */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una cancha</Text>

            <FlatList
              data={canchas}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.canchaItem}
                  onPress={() => handleSelectCancha(item)}
                >
                  <Text style={styles.canchaText}>{item.nombre}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: "#e74c3c", marginHorizontal: 40 },
              ]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CanchaSelector;

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    maxHeight: height * 0.7,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#3498db",
    borderRadius: 10,
    padding: 15,
    margin: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  canchaItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    alignItems: "center",
  },
  canchaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
});
