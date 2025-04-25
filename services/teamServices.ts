import { getToken } from "@/utils/tokenFunction";
import { EquipoState } from "../context/EquipoContext";
import { ReservaState } from "@/context/reserva/reservaReducer";
import { getApiUrl } from "./apiService";
import { toRegisterTeamDto, toCreateReservaDto } from "@/utils/DtoMappers";

export const crearReserva = async (
  equipoState: EquipoState,
  reservaState: ReservaState,
  userId: string
): Promise<void> => {
  try {
    const token = await getToken();

    const equipoPayload = toRegisterTeamDto(equipoState, userId);
    console.log("📦 Payload del equipo:", equipoPayload);

    const equipoResponse = await fetch(getApiUrl("add-team"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(equipoPayload),
    });

    if (!equipoResponse.ok) {
      const errorText = await equipoResponse.text();
      console.error("❌ Error al registrar el equipo:", errorText);
      throw new Error("Error al registrar el equipo");
    }

    const equipoData = await equipoResponse.json();
    console.log("✅ Equipo registrado:", equipoData.team);

    const reservaPayload = toCreateReservaDto(reservaState, equipoData.team.id);
    console.log("📦 Payload de reserva:", reservaPayload);

    const reservaResponse = await fetch(getApiUrl("create-reserva"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(reservaPayload),
    });

    const responseText = await reservaResponse.text(); 
    if (!reservaResponse.ok) {
      console.error("❌ Error al registrar la reserva:", responseText);
      throw new Error("Error al registrar la reserva");
    }

    try {
      const reservaData = JSON.parse(responseText);
      console.log("✅ Reserva registrada:", reservaData);
    } catch (jsonError) {
      console.warn("⚠️ Respuesta de reserva no fue JSON válido:", responseText);
    }

  } catch (error) {
    console.error("🚨 Error general al crear reserva:", error);
    throw error;
  }
};
