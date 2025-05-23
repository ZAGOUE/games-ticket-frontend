import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

// Fonction pour réserver un billet (POST /api/reservations)
export const bookTicket = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/reservations`, data, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la réservation :", error);
        throw error;
    }
};

// Fonction pour récupérer les commandes de l'utilisateur (GET /api/orders)
export const getUserOrders = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/orders`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des billets :", error);
        throw error;
    }
};

// Fonction pour télécharger un billet en PDF (GET /api/orders/{id}/download)
export const downloadTicket = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/api/orders/${orderId}/download`, {
            responseType: "blob",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Erreur lors du téléchargement du billet :", error);
        throw error;
    }
};
