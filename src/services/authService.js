import api from "./api";
import { jwtDecode } from 'jwt-decode';



const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL utilisé:", API_URL);
// Connexion
export const login = async (email, password) => {
    try {
        const response = await api.post(`${API_URL}/api/login`, { email, password });
        const token = response.data.token;

        if (token) {
            localStorage.setItem("token", token);
            saveUserInfoFromToken(token);
            return true;
        }
        return false;
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return false;
    }
};

// Déconnexion
export const logout = () => {
    localStorage.removeItem("token");
};

// Récupération du token
export const getToken = () => {
    return localStorage.getItem("token");
};

// Inscription
export const register = async (userData) => {
    const payload = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
    };

    console.log("Envoi à l'API:", JSON.stringify(payload, null, 2));

    try {
        const response = await api.post(`${API_URL}/api/users/register`, payload);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error.response);
        throw error;
    }


};

export const saveUserInfoFromToken = (token) => {
    try {
        const decoded = jwtDecode(token);
        localStorage.setItem("email", decoded.email || "");
        localStorage.setItem("first_name", decoded.first_name || "");
        localStorage.setItem("last_name", decoded.last_name || "");
        localStorage.setItem("roles", JSON.stringify(decoded.roles || []));
    } catch (error) {
        console.error("Erreur lors du décodage du token :", error);
    }
};


