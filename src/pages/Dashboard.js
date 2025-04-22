import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserOrders } from "../services/bookingService";
import api from "../services/api";

const getRolesFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.roles || [];
    } catch {
        return [];
    }
};

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const roles = getRolesFromToken();
    const isAdmin = roles.includes("ROLE_ADMIN");
    const isController = roles.includes("ROLE_CONTROLLER");

    useEffect(() => {
        if (isAdmin) return;

        const fetchOrders = async () => {
            try {
                const orders = await getUserOrders();
                setTickets(orders);
            } catch (err) {
                setError("Impossible de récupérer les billets.");
            }
        };

        fetchOrders();
    }, [isAdmin], [isController]);

    return (
        <div className="dashboard-container">
            {isAdmin && (
                <div className="admin-section">
                    <h1>👋 Bienvenue, Administrateur !</h1>
                    <p>Vous pouvez gérer les offres.</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
                        <button onClick={() => navigate("/admin/offers")} className="btn btn-primary">
                            ⚙️ Gérer les offres
                        </button>
                    </div>
                </div>
            )}

            {isController && !isAdmin && (
                <div className="controller-section">
                    <h1>👋 Bienvenue, Contrôleur !</h1>
                    <p>Vous pouvez scanner les billets.</p>
                    <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" }}>
                        <button onClick={() => navigate("/scan-ticket")} className="btn btn-primary">
                            📷 Scanner un billet
                        </button>
                    </div>
                </div>
            )}

            {!isAdmin && !isController && (
                <>
                    <h1>🎟️ Mes Billets</h1>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {tickets.length > 0 ? (
                        <table>
                            <thead>
                            <tr>
                                <th>Billet</th>
                                <th>Prix (€)</th>
                                <th>Statut</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tickets.map((ticket) => (
                                <tr key={ticket.id}>
                                    <td>{ticket.offer?.name || "—"}</td>
                                    <td>{ticket.offer?.price || "—"}</td>
                                    <td>{ticket.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>Aucun billet acheté pour l'instant.</p>
                    )}
                </>
            )}
        </div>
    );

};

const handleDownloadTicket = async (orderId) => {
    try {
        const response = await api.get(`/orders/${orderId}/download`, { responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `billet_${orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error("Erreur lors du téléchargement du billet:", error);
    }
};

export default Dashboard;
