import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";




const Booking = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const location = useLocation();
    const fromCart = location.state?.fromCart;
    const { user } = useContext(UserContext);
    useEffect(() => {

      //  if (fromCart) {
      //      alert("Votre commande a bien été enregistrée !");
      //  }
    }, [fromCart]);

    useEffect(() => {
        const token = localStorage.getItem("token");


        if (!token || !user) {
            alert("Vous devez être connecté pour voir vos réservations.");
            navigate("/login?redirect=/booking");
            return;
        }

        const url = user.roles.includes("ROLE_ADMIN")
            ? "http://localhost:8000/api/orders/all"
            : "http://localhost:8000/api/orders";

        axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(response => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Erreur de récupération des commandes :", error);
                setLoading(false);
            });
    }, [navigate, user]);

    const handlePayment = async (orderId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.post(
                `http://localhost:8000/api/orders/${orderId}/pay`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Paiement simulé avec succès !");

            const { validated_at } = response.data;
            // Recharge la liste
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? { ...order, status: "PAID",
                        validated_at,
                        }
                        : order
                )
            );
        } catch (error) {
            console.error("Erreur de paiement :", error);
            alert("Erreur lors du paiement.");
        }
    };
    const handleDownloadTicket = async (orderId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await axios.get(
                `http://localhost:8000/api/orders/${orderId}/download`,
                {
                    responseType: "blob",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Crée un lien de téléchargement du PDF
            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `E-Billet_${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Erreur téléchargement billet :", error);
            alert("Impossible de télécharger le billet.");
        }
    };


    return (
        <div className="container">
            <h1>Mes Réservations 📋</h1>

            {loading ? (
                <p>Chargement...</p>
            ) : orders.length === 0 ? (
                <p>Vous n'avez pas encore de réservation.</p>
            ) : (
                <div className="order-list">
                    {orders.map((order) => (
                        <div key={order.id} className="card mb-3 p-3">
                            <p><strong>Offre :</strong> {order.offer?.name}</p>
                            <p><strong>Status :</strong> {order.status}</p>
                            <p><strong>Validé le :</strong> {order.validated_at || "—"}</p>

                            {order.status !== "PAID" && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handlePayment(order.id)}
                                >
                                    💳 Payer
                                </button>
                            )}

                            {order.status === "PAID" && (
                                <>
                                <p className="text-success">✅ Payé</p>
                                <button
                                className="btn btn-outline-success mt-2"
                                onClick={() => handleDownloadTicket(order.id)}
                        >
                            📥 Télécharger mon billet
                        </button>
                        </>

                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Booking;
