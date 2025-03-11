import React, { createContext, useReducer, useContext, ReactNode } from "react";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  confirmed: boolean;
};

type EquipoState = {
  equipo: User[];
  fecha_partido?: string;
  hora_partido?: string;
  lugar_partido?: string;
};

type EquipoAction =
  | { type: "AGREGAR_USUARIO"; payload: User }
  | { type: "ELIMINAR_USUARIO"; payload: string };

const equipoReducer = (
  state: EquipoState,
  action: EquipoAction
): EquipoState => {
  switch (action.type) {
    case "AGREGAR_USUARIO":
      return { equipo: [...state.equipo, action.payload] };
    case "ELIMINAR_USUARIO":
      return {
        equipo: state.equipo.filter((user) => user.id !== action.payload),
      };
    default:
      return state;
  }
};

const EquipoContext = createContext<
  { equipo: User[]; dispatch: React.Dispatch<EquipoAction> } | undefined
>(undefined);

export const EquipoProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(equipoReducer, { equipo: [] });

  return (
    <EquipoContext.Provider value={{ equipo: state.equipo, dispatch }}>
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
