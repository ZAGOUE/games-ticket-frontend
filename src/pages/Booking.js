import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api"; // ✅ On utilise ton api.js

const Booking = () => {
    const [orders, setOrders] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!user) return;

        const url = user.roles.includes("ROLE_ADMIN")
            ? "/orders/all"
            : "/orders";

        api.get(url)
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("Erreur lors du chargement des réservations :", error);
            });
    }, [user]);

    useEffect(() => {
        if (location.pathname.includes("/payment/")) {
            alert("✅ Paiement effectué avec succès !");
            navigate("/booking");
        }
    }, [location.pathname, navigate]);

    const handleDownloadTicket = async (orderId) => {
        try {
            const response = await api.get(`/orders/${orderId}/download`, {
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `billet_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Erreur lors du téléchargement du billet:", error);
            alert("Échec du téléchargement du billet.");
        }
    };

    const handlePayment = async (orderId) => {
        try {
            const response = await api.post(`/orders/${orderId}/pay`, {});

            alert("Paiement simulé avec succès !");
            const { validated_at } = response.data;

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? { ...order, status: "PAID", validated_at }
                        : order
                )
            );
        } catch (error) {
            console.error("Erreur de paiement :", error);
            alert("Erreur lors du paiement.");
        }
    };

    const renderStatus = (status) => {
        const styles = {
            PENDING: { color: "orange", fontWeight: "bold" },
            PAID: { color: "green", fontWeight: "bold" },
            USED: { color: "gray", fontWeight: "bold" },
        };
        return <span style={styles[status] || {}}>{status}</span>;
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center text-primary mb-4 mt-3">
                {user?.roles.includes("ROLE_ADMIN") ? "📋 Toutes les réservations" : "🎟️ Mes Réservations 🧾"}
            </h1>

            {orders.length > 0 ? (
                <div className="ticket-scroll-container">
                    {orders.map((order) => (
                        <div key={order.id} className="border p-3 rounded shadow-sm" style={{ width: "250px" }}>
                            {user?.roles.includes("ROLE_ADMIN") && (
                                <>
                                    <p><strong>Utilisateur :</strong> {order.user}</p>
                                    <p><strong>Validé le :</strong> {order.validated_at || "—"}</p>
                                </>
                            )}
                            <p><strong>Offre :</strong> {order.offer?.name}</p>
                            <p><strong>Prix (€) :</strong> {order.offer?.price ?? "—"}</p>
                            <p><strong>Status :</strong> {renderStatus(order.status)}</p>

                            {!user?.roles.includes("ROLE_ADMIN") && order.status === "PAID" && (
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => handleDownloadTicket(order.id)}
                                >
                                    📥 Télécharger mon billet
                                </button>
                            )}

                            {!user?.roles.includes("ROLE_ADMIN") && order.status === "USED" && (
                                <button className="btn btn-outline-secondary btn-sm" disabled>
                                    🎫 Billet utilisé
                                </button>
                            )}

                            {!user?.roles.includes("ROLE_ADMIN") && order.status === "PENDING" && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handlePayment(order.id)}
                                >
                                    💳 Payer
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center">Aucune réservation trouvée.</p>
            )}
        </div>
    );
};

export default Booking;
