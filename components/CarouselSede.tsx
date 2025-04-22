import React, { useEffect, useState } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import CarouselItem from "./CarouselItem";
import { fetchAllSedes } from "@/services/apiService";

export const CarouselSede = () => {
  const [sedes, sedSedes] = useState([]); // Estado para almacenar los datos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    // Llamada a la función fetchAllSedes y actualización del estado
    const loadData = async () => {
      try {
        const data = await fetchAllSedes();
        sedSedes(data); // Suponiendo que fetchAllSedes devuelve un arreglo
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false); // Detiene el indicador de carga
      }
    };

    loadData();
  }, []);

  if (loading) {
    // Indicador de carga mientras se obtienen los datos
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.carrouselReflect}>
      <FlatList
        data={sedes}
        renderItem={({ item, index }) => (
          <CarouselItem sede={item} index={index} />
        )}
        horizontal={true}
        pagingEnabled
        bounces={false}
        snapToInterval={30}
        contentContainerStyle={{ gap: 10 }}
        decelerationRate={"fast"}
        
      />
    </View>
  );
};

const styles = StyleSheet.create({
  carrouselReflect: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 7,
    height: 200,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#fff",
  },
});
