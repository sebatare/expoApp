import { CreateReservaDto } from "@/types/CreateReservaDto";

export const initialReservaState: CreateReservaDto = {
  usuarioId: "",
  fecha: "",
  horaInicio: "",
  horaTermino: "",
  canchaId: 0,
  equipoId: null,
};
