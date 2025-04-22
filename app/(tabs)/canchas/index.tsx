import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { CarouselSede } from "@/components/CarouselSede";

const Canchas = () => {
  return (
    <View style={styles.container}>
      <View style={styles.carouselcontainer}>
        <CarouselSede />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselcontainer: {
    marginTop: 60,
  },
  container: {
    flex: 1,
    alignItems: "center", //Centra horizontalmente
    backgroundColor: "rgb(49, 49, 49)",
  },
});

export default Canchas;
