import { toRegisterTeamDto } from "@/utils/teamMapper";
import { getToken } from "@/utils/tokenFunction";
import { EquipoState } from "../context/EquipoContext";
import { ReservaState } from "@/context/reserva/reservaReducer";
import { getApiUrl } from "./apiService";

export const crearReserva = async (
  equipoState: EquipoState,
  reservaState: ReservaState,
  userId: string
): Promise<void> => {
  try {
    const token = await getToken();
    const equipoPayload = toRegisterTeamDto(equipoState, userId);

    console.log("Estado del equipo:", equipoState);
    console.log("ID del usuario:", userId);
    console.log("Payload del equipo:", equipoPayload);

    const equipoResponse = await fetch(getApiUrl("add-team"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(equipoPayload),
    });

    if (!equipoResponse.ok) throw new Error("Error al registrar el equipo");

    const equipoData = await equipoResponse.json();
    console.log("Equipo registrado:", equipoData);

    const reservaPayload = {
      ...reservaState,
      equipoId: equipoData.id,
    };

    const reservaResponse = await fetch(getApiUrl("create-reserva"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(reservaPayload),
    });

    if (!reservaResponse.ok) throw new Error("Error al registrar la reserva");

    const reservaData = await reservaResponse.json();
    console.log("Reserva registrada:", reservaData);
  } catch (error) {
    console.error("Error al enviar solicitud:", error);
    throw error;
  }
};
