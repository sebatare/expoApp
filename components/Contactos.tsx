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

type User = {
  id: string;
  firstName: string;
  lastName: string;
};

const Contactos = ({
  equipo,
  setEquipo,
}: {
  equipo: User[];
  setEquipo: React.Dispatch<React.SetStateAction<User[]>>;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.FirstName, Contacts.Fields.LastName],
        });

        if (data.length > 0) {
          setContacts(data);
        }
      }
    })();
  }, []);

  const bottonAgregar = (contact: Contacts.Contact) => {
    const user: User = {
      id: contact.id || "unknown-id",
      firstName: contact.firstName || "Nombre desconocido",
      lastName: contact.lastName || "Apellido desconocido",
    };

    if (!equipo.some((member) => member.id === user.id)) {
      setEquipo([...equipo, user]); // Se actualiza el equipo en el padre
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
                <TouchableOpacity onPress={() => bottonAgregar(item)}>
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
