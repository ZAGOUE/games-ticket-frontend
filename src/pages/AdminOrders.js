// src/pages/AdminOrders.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get("/orders/all");
                setOrders(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des réservations admin :", err);
                setError("Impossible de charger les réservations.");
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="dashboard-container">
            <h1>📋 Toutes les Réservations</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {orders.length > 0 ? (
                <div className="admin-orders-table">
                    <table>
                    <thead>
                    <tr>
                        <th>Utilisateur</th>
                        <th>Billet</th>
                        <th>Statut</th>
                        <th>Validé le</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.user}</td>
                            <td>{order.offer}</td>
                            <td className={`status ${order.status.toLowerCase()}`}>
                                {order.status}
                            </td>

                            <td>{order.validated_at || "Non validé"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            ) : (
                <p>Aucune réservation trouvée.</p>
            )}
        </div>
    );
};

export default AdminOrders;
