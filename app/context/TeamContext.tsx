import React, { createContext, useReducer, ReactNode, Dispatch } from 'react';

// Definir el tipo para un jugador
interface Team {
  id: string;
  members: [];
  fecha?: string;
  phone?: string;
}

// Definir el estado inicial
interface TeamState {
  players: Team[];
}

// Definir las acciones del reducer
type PlayersAction =
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string }; // Ejemplo de acción para eliminar un jugador

// Estado inicial
const initialState: PlayersState = {
  players: [],
};

// Crear el contexto con un valor por defecto
export const PlayersContext = createContext<{
  state: PlayersState;
  dispatch: Dispatch<PlayersAction>;
}>({
  state: initialState,
  dispatch: () => undefined, // Dispatch vacío solo para evitar errores al no estar dentro del provider
});

// Reducer
const playersReducer = (state: PlayersState, action: PlayersAction): PlayersState => {
  switch (action.type) {
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    case 'REMOVE_PLAYER':
      return { ...state, players: state.players.filter(player => player.id !== action.payload) };
    default:
      return state;
  }
};

// Definir las props del provider
interface PlayersProviderProps {
  children: ReactNode;
}

// Provider
export const PlayersProvider: React.FC<PlayersProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(playersReducer, initialState);

  return (
    <PlayersContext.Provider value={{ state, dispatch }}>
      {children}
    </PlayersContext.Provider>
  );
};
