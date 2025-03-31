import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// Connexion
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        const token = response.data.token;

        if (token) {
            localStorage.setItem("token", token);
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
        const response = await axios.post(`${API_URL}/users/register`, payload);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de l'inscription :", error.response);
        throw error;
    }
};

