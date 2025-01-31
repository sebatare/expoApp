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

interface HoraSelectorProps {
  blockedHours: string[];
}

const HoraSelectorModal = ({ blockedHours }: HoraSelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Generar las horas válidas entre 9:00 y 18:00
  const hours = Array.from({ length: 10 }, (_, i) => `${9 + i}:00`);
  const [hora, setHora] = useState<string | null>(null);

  const handleSelect = (time: string) => {
    setIsModalVisible(false);

    setHora(time);
  };

  return (
    <>
      {/* Botón para abrir el modal */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => setIsModalVisible(true)}
        accessibilityRole="button"
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={styles.buttonText}>
            {hora ? `${hora}` : "Seleccionar Hora"}
          </Text>
          {hora && (
            <CircleX
              style={{paddingLeft: 50}}
              onPress={() => {
                setHora(null);
              }}
              size={20}
              color={"rgb(190, 0, 0)"}
            />
          )}
        </View>
      </TouchableOpacity>

      {/* Modal para seleccionar hora */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecciona una hora</Text>

            {/* Lista de horas */}
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
                  accessible={true}
                  accessibilityLabel={`Hora ${item}`}
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

            {/* Botón de cerrar */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsModalVisible(false)}
              accessibilityRole="button"
              accessible={true}
              accessibilityLabel="Cerrar selección de hora"
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
    maxHeight: height * 0.7, // Limitar la altura del modal
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
    maxHeight: height * 0.5, // Hacer scroll manejable
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
