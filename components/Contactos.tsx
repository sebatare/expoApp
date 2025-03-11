import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BookUser } from "lucide-react-native";
import * as Contacts from "expo-contacts";
import { useEquipo } from "@/context/EquipoContext"; // Asegúrate de ajustar la ruta

const Contactos = () => {
  const { equipo, dispatch } = useEquipo(); // Obtenemos el equipo y la función dispatch del contexto
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.FirstName,
            Contacts.Fields.LastName,
            Contacts.Fields.Emails, // Se agrega para poder obtener el correo, si lo hay
          ],
        });
        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  const agregarContacto = (contact: Contacts.Contact) => {
    const user = {
      id: contact.id || "unknown-id",
      firstName: contact.firstName || "Nombre desconocido",
      lastName: contact.lastName || "Apellido desconocido",
      confirmed: false,
    };

    if (!equipo.some((member) => member.id === user.id)) {
      dispatch({ type: "AGREGAR_USUARIO", payload: user });
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setIsModalVisible(true)}>
        <BookUser size={40} color={"black"} />
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Contactos</Text>
            <FlatList
              data={contacts}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => agregarContacto(item)}>
                  <View style={styles.contactItem}>
                    <Text style={styles.contactName}>
                      {item.firstName} {item.lastName}
                    </Text>
                    <Text style={styles.contactEmail}>
                      {item.emails?.[0]?.email ?? "Sin correo"}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
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

export default Contactos;

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  contactItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  contactEmail: {
    fontSize: 14,
    color: "#666",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#FF5733",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
