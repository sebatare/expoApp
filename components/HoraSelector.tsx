import { CircleX } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

import { useReserva } from "@/context/reserva/ReservaContext";

interface HoraSelectorProps {
  blockedHours: string[];
}

const HoraSelectorModal = ({ blockedHours }: HoraSelectorProps) => {
  const { reserva, dispatch } = useReserva();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Horas disponibles entre 9:00 y 18:00
  const hours = Array.from({ length: 10 }, (_, i) => `${(9 + i).toString().padStart(2, '0')}:00`);

  const handleSelect = (time: string) => {
    dispatch({ type: "SET_HORA_INICIO", payload: time });

    const [horaStr] = time.split(":");
    const horaFinNum = parseInt(horaStr) + 1;
    const horaTermino = `${horaFinNum.toString().padStart(2, "0")}:00`;

    dispatch({ type: "SET_HORA_TERMINO", payload: horaTermino });

    setIsModalVisible(false);
  };

  const handleClear = () => {
    dispatch({ type: "SET_HORA_INICIO", payload: null });
    dispatch({ type: "SET_HORA_TERMINO", payload: null });
  };

  const horaSeleccionada = reserva.horaInicio; // <-- directamente del contexto

  return (
    <>
      {/* Botón para abrir modal */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
        accessibilityRole="button"
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.buttonText}>
            {horaSeleccionada ? horaSeleccionada : "Seleccionar Hora"}
          </Text>
          {horaSeleccionada && (
            <CircleX
              style={{ marginLeft: 10 }}
              onPress={handleClear}
              size={20}
              color={"rgb(190, 0, 0)"}
            />
          )}
        </View>
      </TouchableOpacity>

      {/* Modal con selección de hora */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una hora</Text>

            <FlatList
              data={hours}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.hourOption,
                    blockedHours.includes(item) && styles.blockedHour,
                  ]}
                  disabled={blockedHours.includes(item)}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={
                      blockedHours.includes(item)
                        ? styles.blockedHourText
                        : styles.hourText
                    }
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 10 }}
              style={styles.flatListContainer}
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default HoraSelectorModal;


const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    maxHeight: height * 0.7,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  flatListContainer: {
    maxHeight: height * 0.5,
  },
  hourOption: {
    backgroundColor: "#E0F7FA",
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  blockedHour: {
    backgroundColor: "#FFCDD2",
  },
  hourText: {
    color: "#00796B",
    fontSize: 16,
    fontWeight: "500",
  },
  blockedHourText: {
    color: "#C62828",
    fontSize: 16,
    fontWeight: "500",
  },
  closeButton: {
    backgroundColor: "#00796B",
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
