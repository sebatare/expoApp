import React, { useState, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

type Props = {
  targetTime?: Date; // Fecha y hora objetivo como objeto Date
};

const NextMatchTemporizer = ({ targetTime }: Props) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [formattedTime, setFormattedTime] = useState<string>("-- : --");
  const [isMatchStarted, setIsMatchStarted] = useState<boolean>(false);

  useEffect(() => {
    if (!targetTime) {
      setFormattedTime("-- : --");
      return;
    }

    const targetTimestamp = targetTime.getTime();
    const nowTimestamp = Date.now();

    if (targetTimestamp <= nowTimestamp) {
      setFormattedTime("Match iniciado!");
      setIsMatchStarted(true);
      return;
    }

    setTimeLeft(Math.floor((targetTimestamp - nowTimestamp) / 1000));
  }, [targetTime]);

  useEffect(() => {
    if (timeLeft === null || isMatchStarted) return;

    if (timeLeft <= 0) {
      setFormattedTime("Match iniciado!");
      setIsMatchStarted(true);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : null));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isMatchStarted]);

  useEffect(() => {
    if (timeLeft === null || isMatchStarted) return;

    if (timeLeft > 86400) {
      // Más de un día
      const days = Math.floor(timeLeft / 86400);
      const hours = Math.floor((timeLeft % 86400) / 3600);
      setFormattedTime(`${days}D : ${hours} hrs`);
    } else if (timeLeft > 0) {
      // Menos de un día
      const hours = Math.floor(timeLeft / 3600).toString().padStart(2, "0");
      const minutes = Math.floor((timeLeft % 3600) / 60)
        .toString()
        .padStart(2, "0");
      setFormattedTime(`${hours} hr : ${minutes} min`);
    }
  }, [timeLeft, isMatchStarted]);

  const resetTimer = () => {
    setTimeLeft(null);
    setFormattedTime("-- : --");
    setIsMatchStarted(false);
  };

  return (
    <View style={styles.container}>
      {isMatchStarted ? (
        <Text style={styles.matchStartedText}>Match iniciado!</Text>
      ) : (
        <>
          <Text style={styles.fecha}>Fecha: {targetTime?.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} Hora: {targetTime?.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })} </Text>

          <Text style={styles.timeText}>{formattedTime}</Text>
        </>
      )}

      <Button title="Reiniciar" onPress={resetTimer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 5
  },
  fecha: {
    fontSize: 14,
    color: "rgb(160, 160, 160)",
  },
  timeText: {
    fontSize: 52,
    fontWeight: "bold",
    color: "red",
  },
  matchStartedText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
  },
});

export default NextMatchTemporizer;
