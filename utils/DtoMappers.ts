// utils/toRegisterTeamDto.ts

import { TeamMember } from "@/types/TeamMember";
import { EquipoState } from "../context/EquipoContext";
import { ReservaState } from "@/context/reserva/reservaReducer";
import { RegisterTeamDto } from "@/types/RegisterTeamDto";
import { CreateReservaDto } from "@/types/CreateReservaDto";

export function toRegisterTeamDto(state: EquipoState, userId: string): RegisterTeamDto {
  if (state.miembros.length === 0) {
    throw new Error("No hay miembros en el equipo");
  }
  if (!userId) {
    throw new Error("El ID del capitán no puede ser nulo o indefinido");
  }

  return {
    clubId: state.clubId ?? undefined,
    miembros: state.miembros.map((u) => ({ ...u } as TeamMember)),
    capitanId: userId,
    fechaCreacion: new Date().toISOString(),
  };
}

function combineDateAndTime(dateStr: string, timeStr: string): string {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(dateStr);
  date.setHours(hours);
  date.setMinutes(minutes);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date.toISOString();
}


export function toCreateReservaDto(state: ReservaState, equipoId: number): CreateReservaDto {
  return {
    usuarioId: state.usuarioId,
    fecha: new Date(state.fecha).toISOString(),
    horaInicio: combineDateAndTime(state.fecha, state.horaInicio),
    horaTermino: combineDateAndTime(state.fecha, state.horaTermino),
    canchaId: state.canchaId,
    equipoId: equipoId,
  };
}

