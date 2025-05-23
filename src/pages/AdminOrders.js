import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles.css";

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [offerStats, setOfferStats] = useState([]);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) return;

        const fetchOrders = async () => {
            try {
                const response = await api.get("/api/orders/all", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des réservations admin :", err);
                setError("Impossible de charger les réservations.");
            }
        };

        const fetchStats = async () => {
            try {
                const response = await api.get("/api/admin/stats/offers", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOfferStats(response.data);
            } catch (err) {
                console.error("Erreur lors du chargement des statistiques d’offres :", err);
            }
        };

        fetchOrders();
        fetchStats();
    }, [token]);

    const countByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {});

    return (
        <>
            <div className="admin-stats-container">
                <div className="stat-block">
                    <h2>📊 Total des Réservations</h2>
                    <ul>
                        <li><strong>USED :</strong> {countByStatus.USED || 0}</li>
                        <li><strong>PAID :</strong> {countByStatus.PAID || 0}</li>
                        <li><strong>PENDING :</strong> {countByStatus.PENDING || 0}</li>
                    </ul>
                </div>

                <div className="stat-block">
                    <h2>🎟️ Ventes par Offre</h2>
                    <ul>
                        {offerStats.length > 0 ? (
                            offerStats.map((stat, idx) => (
                                <li key={idx}><strong>{stat.offer}</strong> : {stat.total}</li>
                            ))
                        ) : (
                            <li>Aucune donnée disponible.</li>
                        )}
                    </ul>
                </div>
            </div>

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
        </>
    );
    };

    export default AdminOrders;

