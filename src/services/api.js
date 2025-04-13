import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000/api", // adapte au besoin
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default api;
