import React, { createContext, useReducer, useContext, ReactNode } from "react";
import {
  reservaReducer,
  ReservaState,
  ReservaAction,
} from "./reservaReducer";
import { initialReservaState } from "./reservaInitialState";

type ReservaContextType = {
  reserva: ReservaState;
  dispatch: React.Dispatch<ReservaAction>;
};

const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const [reserva, dispatch] = useReducer(reservaReducer, initialReservaState);

  return (
    <ReservaContext.Provider value={{ reserva, dispatch }}>
      {children}
    </ReservaContext.Provider>
  );
};

export const useReserva = () => {
  const context = useContext(ReservaContext);
  if (!context) {
    throw new Error("useReserva debe usarse dentro de ReservaProvider");
  }
  return context;
};
