import {
    Dimensions,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
  } from "react-native";
  import React, { useState } from "react";
  import { Search, UserPlus, CheckCircle } from "lucide-react-native";
  import {
    fetchGetUserByUsername,
    fetchGetUserByEmail,
  } from "@/utils/apiService";

  import Contactos from "./Contactos";
  
  type User = {
    id: string;
    firstName: string;
    lastName: string;
  };
  
  const BuscarAmigos = ({
    agregarAlEquipo,
  }: {
    agregarAlEquipo: (user: User) => void;
  }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [usuario, setUsuario] = useState<string>("");
    const [usersFound, setUsersFound] = useState<User[]>([]);
    const [equipo, setEquipo] = useState<User[]>([]); // Estado para usuarios en el equipo
    const [loading, setLoading] = useState(false);
  
    const fetchData = async () => {
      if (!usuario.trim()) return; // Evita llamadas vacías
      setLoading(true);
      try {
        let response: User | User[] = [];
  
        if (usuario.includes("@")) {
          response = await fetchGetUserByEmail(usuario); // Si es un correo
        } else {
          response = await fetchGetUserByUsername(usuario); // Si es un username
        }
  
        console.log("Usuarios encontrados:", response);
  
        // Asegurar que siempre sea un array
        setUsersFound(Array.isArray(response) ? response : [response]);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Función para agregar o quitar usuario del equipo
    const toggleEquipo = (user: User) => {
      if (equipo.some((u) => u.id === user.id)) {
        // Si ya está en el equipo, lo eliminamos
        setEquipo(equipo.filter((u) => u.id !== user.id));
      } else {
        // Si no está en el equipo, lo agregamos
        setEquipo([...equipo, user]);
        agregarAlEquipo(user);
      }
    };
  
    return (
      <>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsModalVisible(true)}
        >
          <UserPlus size={24} color={"#fff"} />
        </TouchableOpacity>
  
        {/* Modal buscar amigos */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Buscar amigos</Text>
  
              {/* BUSCADOR */}
              <View style={styles.searchContainer}>
                <TextInput
                  placeholder="Username o Correo"
                  value={usuario}
                  onChangeText={setUsuario}
                  style={styles.input}
                />
                <TouchableOpacity style={styles.searchButton} onPress={fetchData}>
                  <Text style={styles.searchText}>Buscar</Text>
                  <Search color={"white"} size={20} />
                </TouchableOpacity>
                <Contactos equipo={equipo} setEquipo={setEquipo} />
              </View>
  
              {/* Mostrar resultado */}
              {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
              ) : usersFound.length > 0 ? (
                <FlatList
                  data={usersFound}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => {
                    const enEquipo = equipo.some((u) => u.id === item.id);
                    return (
                      <View style={styles.userContainer}>
                        <Text style={styles.userText}>
                          {item.firstName} {item.lastName}
                        </Text>
                        <TouchableOpacity
                          onPress={() => toggleEquipo(item)}
                          disabled={enEquipo} // Deshabilita si ya está en el equipo
                        >
                          {enEquipo ? (
                            <CheckCircle color={"green"} size={20} />
                          ) : (
                            <UserPlus color={"black"} size={20} />
                          )}
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              ) : (
                <Text style={styles.noResults}>No se encontraron usuarios</Text>
              )}
  
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    );
  };
  
  export default BuscarAmigos;
  
  const { width } = Dimensions.get("window");
  
  const styles = StyleSheet.create({
    addButton: {
      backgroundColor: "#388E3C",
      padding: 8,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
    },
    closeButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    closeButton: {
      backgroundColor: "rgb(233, 31, 64)",
      marginTop: 15,
      paddingVertical: 12,
      borderRadius: 10,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
      textAlign: "center",
    },
    searchContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: "#ddd",
      padding: 8,
      borderRadius: 5,
      marginRight: 10,
    },
    searchButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#4CAF50",
      padding: 10,
      borderRadius: 5,
    },
    searchText: {
      color: "white",
      marginRight: 5,
    },
    userContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    userText: {
      fontSize: 16,
    },
    noResults: {
      textAlign: "center",
      marginTop: 10,
      color: "gray",
    },
  });
  