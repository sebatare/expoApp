import { initialReservaState } from "./reservaInitialState";

export type ReservaState = typeof initialReservaState;

export type ReservaAction =
  | { type: "SET_USUARIO_ID"; payload: string }
  | { type: "SET_FECHA"; payload: string | null }
  | { type: "SET_HORA_INICIO"; payload: string | null }
  | { type: "SET_HORA_TERMINO"; payload: string | null }
  | { type: "SET_SEDE_ID"; payload: number | null; }
  | { type: "SET_CANCHA_ID"; payload: number | null;}
  | { type: "SET_EQUIPO_ID"; payload: number | null;}
  | { type: "RESET"; payload?: ReservaState };

export const reservaReducer = (
  state: ReservaState,
  action: ReservaAction
): ReservaState => {
  switch (action.type) {
    case "SET_USUARIO_ID":
      return { ...state, usuarioId: action.payload };
    case "SET_FECHA":
      return { ...state, fecha: action.payload };
    case "SET_HORA_INICIO":
      return { ...state, horaInicio: action.payload };
    case "SET_HORA_TERMINO":
      return { ...state, horaTermino: action.payload };
    case "SET_CANCHA_ID":
      return { ...state, canchaId: action.payload };
    case "SET_EQUIPO_ID":
      return { ...state, equipoId: action.payload };
    case "RESET":
      return action.payload ?? initialReservaState;
    default:
      return state;
  }
};
