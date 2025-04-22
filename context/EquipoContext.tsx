import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { TeamMember } from "@/types/TeamMember";


export type EquipoState = {
  nombre?: string;
  clubId?: string;
  miembros: TeamMember[];
  capitanId?: string;
  horaPartido?: string;
  fechaPartido?: string;
  lugarPartido?: string;
}

type EquipoAction =
  | { type: "SET_NOMBRE"; payload: string }
  | { type: "SET_CLUBID"; payload: string }
  | { type: "AGREGAR_USUARIO"; payload: TeamMember }
  | { type: "ELIMINAR_USUARIO"; payload: string }
  | { type: "SET_CAPITANID"; payload: string }
  | { type: "RESET"; payload?: EquipoState };




const equipoReducer = (
  state: EquipoState,
  action: EquipoAction
): EquipoState => {
  switch (action.type) {
    case "SET_NOMBRE":
      return { ...state, nombre: action.payload };
    case "SET_CLUBID":
      return { ...state, clubId: action.payload };
    case "AGREGAR_USUARIO":
      
      return { miembros: [...state.miembros, action.payload] };
      
    case "ELIMINAR_USUARIO":
      return {
        miembros: state.miembros.filter((user) => user.id !== action.payload),
      };
    case "SET_CAPITANID":
      return { ...state, capitanId: action.payload };
    case "RESET":
      return action.payload ? action.payload : { miembros:    [] };
    default:
      return state;
  }
};

const EquipoContext = createContext<
  { equipo: EquipoState; dispatch: React.Dispatch<EquipoAction> } | undefined
>(undefined);


export const EquipoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(equipoReducer, { miembros: [] });

  return (
    <EquipoContext.Provider value={{ equipo: state, dispatch }}>
      {children}
    </EquipoContext.Provider>
  );
};

export const useEquipo = () => {
  const context = useContext(EquipoContext);
  if (!context) {
    throw new Error("useEquipo debe usarse dentro de EquipoProvider");
  }
  return context;
};
