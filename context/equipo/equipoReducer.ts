import { TeamMember } from "@/types/TeamMember";
import { initialEquipoState } from "./equipoInitialState";

export type EquipoState = typeof initialEquipoState;

export type EquipoAction =
  | { type: "SET_NOMBRE"; payload: string }
  | { type: "SET_CLUBID"; payload: string }
  | { type: "AGREGAR_USUARIO"; payload: TeamMember }
  | { type: "ELIMINAR_USUARIO"; payload: string }
  | { type: "SET_CAPITANID"; payload: string }
  | { type: "RESET"; payload?: EquipoState };

export const equipoReducer = (
  state: EquipoState,
  action: EquipoAction
): EquipoState => {
  switch (action.type) {
    case "SET_NOMBRE":
      return { ...state, nombre: action.payload };
    case "SET_CLUBID":
      return { ...state, clubId: action.payload };
    case "AGREGAR_USUARIO":
      return {
        ...state,
        miembros: [...state.miembros, action.payload],
      };

    case "ELIMINAR_USUARIO":
      return {
        ...state,
        miembros: state.miembros.filter((user) => user.id !== action.payload),
      };
    case "SET_CAPITANID":
      return { ...state, capitanId: action.payload };
    case "RESET":
      return action.payload ? action.payload : { ...state, miembros: [] };
    default:
      return state;
  }
};

