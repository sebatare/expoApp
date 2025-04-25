import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { CircleX } from "lucide-react-native";
import { useReserva } from "@/context/reserva/ReservaContext";

interface FechaSelectorProps {
  unavailableDates: string[]; // Lista de fechas no disponibles en formato YYYY-MM-DD
}

const FechaSelectorModal: React.FC<FechaSelectorProps> = ({ unavailableDates }) => {
  const { reserva, dispatch } = useReserva(); // Usamos el estado y dispatch del contexto
  const [isModalVisible, setIsModalVisible] = useState(false);

  const selectedDate = reserva.fecha;

  const handleSelect = (date: string) => {
    dispatch({ type: "SET_FECHA", payload: date });
    setIsModalVisible(false);
  };

  const iconButtonStyle = {
    paddingLeft: selectedDate ? 50 : 0,
  };

  const buttonStyle = {
    ...styles.button,
    paddingHorizontal: selectedDate ? 0 : 20,
    paddingLeft: selectedDate ? 20 : 20,
  };

  const markedDates = unavailableDates.reduce(
    (acc, date) => ({
      ...acc,
      [date]: { disabled: true, disableTouchEvent: true, marked: true },
    }),
    {}
  );

  return (
    <>
      <TouchableOpacity style={buttonStyle} onPress={() => setIsModalVisible(true)}>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <Text style={styles.buttonText}>
            {selectedDate ? `${selectedDate}` : "Seleccionar Fecha"}
          </Text>
          {selectedDate && (
            <CircleX
              style={iconButtonStyle}
              onPress={() => dispatch({ type: "SET_FECHA", payload: null })}
              size={20}
              color={"rgb(190, 0, 0)"}
            />
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedDate
                ? `Fecha seleccionada: ${selectedDate}`
                : "Selecciona una fecha"}
            </Text>
            <Calendar
              onDayPress={(day: { dateString: string }) => handleSelect(day.dateString)}
              markedDates={markedDates}
              minDate={new Date().toISOString().split("T")[0]}
              theme={{
                todayTextColor: "#00adf5",
                arrowColor: "#4CAF50",
                disabledArrowColor: "#d9e1e8",
                monthTextColor: "#4CAF50",
              }}
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

export default FechaSelectorModal;

const { width } = Dimensions.get("window");

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
    width: width * 0.9,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
