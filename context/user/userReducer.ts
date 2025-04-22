import { initialUserState } from "./userInitialState";

export type UserState = typeof initialUserState;
export type UserAction =
    | { type: "SET_ID"; payload: string }
    | { type: "SET_EMAIL"; payload: string }
    | { type: "RESET"; payload?: UserState };

export const userReducer = (
    state: UserState,
    action: UserAction
): UserState => {
    switch (action.type) {
        case "SET_ID":
            return { ...state, id: action.payload };
        case "SET_EMAIL":
            return { ...state, email: action.payload };
        case "RESET":
            return action.payload ?? initialUserState;
        default:
            return state;
    }
}