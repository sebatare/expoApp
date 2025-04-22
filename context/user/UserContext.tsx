import React, { ReactNode, useContext, useReducer } from "react";
import { UserAction, userReducer, UserState } from "./userReducer";
import { initialUserState } from "./userInitialState";

type UserContextType = {
    user: UserState;
    dispatch: React.Dispatch<UserAction>;
}

const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, dispatch] = useReducer(userReducer, initialUserState);

    return (
        <UserContext.Provider value={{ user, dispatch }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser debe usarse dentro de UserProvider");
    }
    return context;
}