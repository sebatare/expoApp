import { jwtDecode } from "jwt-decode";
import { getToken } from "../../utils/tokenFunction"; // o desde donde tengas `getToken`

type DecodedToken = {
    sub: string;
    email?: string;
    exp?: number;
};

export const getUserId = async (): Promise<string | null> => {
    try {
        const token = await getToken();

        if (!token) return null;

        const decoded = jwtDecode<DecodedToken>(token);
        return decoded.sub || null;
    } catch (error) {
        console.warn("No se pudo obtener el userId desde el token", error);
        return null;
    }
};
