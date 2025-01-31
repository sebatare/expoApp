import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import React, { useRef } from "react";
import sedesImagesMapping from "@/utils/sedesImagesMapping";
import { useRouter } from "expo-router";
type Props = {
  sede: any;
  index: number;
};

const CarouselItem = ({ sede }: Props) => {
  //rutas

  const router = useRouter();
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(1)).current; // Controla la opacidad del fondo
  const scaleAnim = useRef(new Animated.Value(1)).current; // Controla el tamaño del texto
  // Mapeo de la imagen de la sede
  const imageSource = sedesImagesMapping[sede.imageUrl];
  // Animación de opacidad del fondo al presionar
  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // Disminuimos la opacidad del fondo
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1.08, // Aumentamos el tamaño del texto
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, // El fondo vuelve a su opacidad original
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1, // El tamaño del texto regresa a su valor original
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const crearCancha = () => {
    router.push({
      pathname: "/canchas/crear_reserva",
      params: {
        data: JSON.stringify(sede), // Serializa el objeto
      },
    });
  };

  return (
    <Pressable
      onPress={crearCancha}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container]}
    >
      <Animated.Image
        source={imageSource}
        style={[styles.image, { opacity: fadeAnim }]}
      />

      {/* Texto superpuesto */}
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.title,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {sede.nombre}
        </Animated.Text>
        <Text style={styles.subtitle}>
          Dirección: {sede.address.calle}#{sede.address.numero} -{" "}
          {sede.address.comuna}
        </Text>
      </View>
    </Pressable>
  );
};

export default CarouselItem;

const styles = StyleSheet.create({
  container: {
    width: 400,
    paddingHorizontal: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 30,
  },

  textContainer: {
    position: "absolute",
    top: 120,
    left: 50,
  },
  title: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 2,
  },
  subtitle: {
    color: "rgb(255, 255, 255)",
    fontSize: 16,
    paddingVertical: 5,
    fontStyle: "italic",
  },
});
