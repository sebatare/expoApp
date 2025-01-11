import * as SecureStore from "expo-secure-store";
import Cookies from "js-cookie"; // Instálalo usando npm o yarn si aún no lo tienes
import { Platform } from "react-native";

export const storeToken = async (token) => {
    if (Platform.OS === "web") {
        // Borrar la cookie existente antes de establecer una nueva
        Cookies.remove("jwtToken");
        console.log("Cookie jwtToken Deleted");

        // Guardar en cookies para navegador
        console.log("Guardando token en cookies");
        Cookies.set("jwtToken", token, { secure: true, sameSite: "strict" });
    } else {
        
        // Guardar en SecureStore para dispositivos móviles
        await SecureStore.setItemAsync("jwtToken", token);
        console.log("Token SecureStore Saved");
    }
};

export const getToken = async () => {
    if (Platform.OS === "web") {
        // Obtener token de las cookies
        return Cookies.get("jwtToken");
    } else {
        // Obtener token de SecureStore
        return await SecureStore.getItemAsync("jwtToken");
    }
};

export const clearToken = async () => {
    if (Platform.OS === "web") {
        // Eliminar cookie en navegador
        console.log("Eliminando cookie jwtToken");
        Cookies.remove("jwtToken");
    } else {
        console.log("Eliminando token en SecureStore");
        // Eliminar token en SecureStore
        await SecureStore.deleteItemAsync("jwtToken");
    }
};
