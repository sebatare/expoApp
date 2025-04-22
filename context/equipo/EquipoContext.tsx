import React, { createContext, useReducer, useContext, ReactNode } from "react";
import {
  equipoReducer,
  EquipoState,
  EquipoAction,
} from "./equipoReducer";
import { initialEquipoState } from "./equipoInitialState";

type ReservaContextType = {
  equipo: EquipoState;
  dispatch: React.Dispatch<EquipoAction>;
};

const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const [equipo, dispatch] = useReducer(equipoReducer, initialEquipoState);

  return (
    <ReservaContext.Provider value={{ equipo, dispatch }}>
      {children}
    </ReservaContext.Provider>
  );
};

export const useEquipo = () => {
  const context = useContext(ReservaContext);
  if (!context) {
    throw new Error("useEquipo debe usarse dentro de ReservaProvider");
  }
  return context;
};
