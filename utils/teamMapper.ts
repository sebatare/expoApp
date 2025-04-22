// utils/toRegisterTeamDto.ts

import { EquipoState } from "../context/EquipoContext";
import { RegisterTeamDto } from "@/types/RegisterTeamDto";

export function toRegisterTeamDto(state: EquipoState, userId: string): RegisterTeamDto {
  if (state.miembros.length === 0) {
    throw new Error("No hay miembros en el equipo");
  }
  if (!userId) {
    throw new Error("El ID del capitán no puede ser nulo o indefinido");
  }

  return {
    clubId: state.clubId ?? undefined,
    miembrosIds: state.miembros.map((u) => u.id),
    capitanId: userId,
    fechaCreacion: new Date().toISOString(),
  };
}
