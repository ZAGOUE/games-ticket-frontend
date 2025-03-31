import React, { useEffect, useState } from "react";
import { getUserOrders } from "../services/bookingService";
import api from "../services/api";

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await getUserOrders();
                setTickets(orders);
            } catch (err) {
                setError("Impossible de récupérer les billets.");
            }
        };

        fetchOrders();
    }, []);

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

    return (
        <div className="dashboard-container">
            <h1>🎟️ Mes Billets</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {tickets.length > 0 ? (
                <table>
                    <thead>
                    <tr>
                        <th>Événement</th>
                        <th>Date</th>
                        <th>Prix (€)</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id}>
                            <td>{ticket.eventName}</td>
                            <td>{ticket.eventDate}</td>
                            <td>{ticket.price}</td>
                            <td>{ticket.status}</td>
                            <td>
                                <button onClick={() => handleDownloadTicket(ticket.id)}>📥 Télécharger</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>Aucun billet acheté pour l'instant.</p>
            )}
        </div>
    );
};

export default Dashboard;
