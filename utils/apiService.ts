import { Platform } from "react-native";

// Función para obtener la URL de la API basada en la plataforma
export const getApiUrl = (endpoint: string = "") => {
  const baseUrl = Platform.OS === "android"
    ? "http://10.0.2.2:5214"
    : Platform.OS === "ios"
    ? "http://192.168.0.163:5214"
    : "http://localhost:5214"; // Para otros casos como web

  return `${baseUrl}/${endpoint}`;
};

// Función para obtener detalles de usuario
export const fetchUserDetails = async (token: string) => {
  try {
    const response = await fetch(getApiUrl("user-details"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al obtener detalles del usuario:", error);
    throw error; // Re-lanzamos el error para que se pueda manejar en el componente
  }
};

// Función genérica para realizar cualquier petición GET a la API
export const fetchFromApi = async (token: string, endpoint: string) => {
  try {
    const response = await fetch(getApiUrl(endpoint), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error al obtener datos de ${endpoint}:`, error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};


export const fetchAllSedes = async () =>{
  try {
    const response = await fetch(getApiUrl("get-all-sedes"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error: No se pudo obtener la informacion de todas las sedes.", error);
    throw error; // Re-lanzamos el error para que se pueda manejar en el componente
  }
};

export const fetchCanchasBySede = async (sedeId: number) =>{
  try {
    const response = await fetch(getApiUrl(`get-canchas-by-sede/${sedeId}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error: No se pudo obtener la informacion de todas las sedes.", error);
    throw error; // Re-lanzamos el error para que se pueda manejar en el componente
  }
}

export const fetchGetUserByUsername = async (username: string) => {
  try {
    const response = await fetch(getApiUrl(`get-user-by-email/${username}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error: No se pudo obtener la informacion de todas las sedes.", error);
    throw error; // Re-lanzamos el error para que se pueda manejar en el componente
  }
}

export const fetchGetUserByEmail = async (username: string) => {
  try {
    const response = await fetch(getApiUrl(`get-user-by-email/${username}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificamos si la respuesta fue exitosa
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error: No se pudo obtener la informacion de todas las sedes.", error);
    throw error; // Re-lanzamos el error para que se pueda manejar en el componente
  }
}