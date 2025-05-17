import React, { useContext, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../services/api"; // ✅ Remplacer axios par api

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();
    const { userEmail } = useContext(UserContext);
    const [resumePending, setResumePending] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleValidateOrder = async () => {
        const token = localStorage.getItem("token");

        if (!token || !userEmail) {
            alert("Veuillez vous connecter pour valider votre commande.");
            sessionStorage.setItem("resumeValidation", "true");
            navigate("/login?redirect=/cart");
            return;
        }

        try {
            for (const item of cart) {
                const response = await api.post(
                    "/orders",
                    {
                        offer_id: item.id,
                        quantity: item.quantity,
                    }
                );

                console.log("✅ Commande créée :", response.data);
            }

            alert("Commande validée avec succès !");
            clearCart();
            navigate("/booking", { state: { fromCart: true } });
        } catch (error) {
            console.error("❌ Erreur lors de la validation :", error);
            alert("Une erreur est survenue. Merci de réessayer.");
        }
    };

    useEffect(() => {
        const resumeFlag = sessionStorage.getItem("resumeValidation") === "true";
        if (resumeFlag) {
            setResumePending(true);
            sessionStorage.removeItem("resumeValidation");
        }
    }, []);

    return (
        <div className="cart-container">
            <h1 className="text-3xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                🛒 Mon panier
            </h1>

            {resumePending && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                    Vous êtes maintenant connecté. Cliquez sur "Valider la commande" pour finaliser votre achat.
                </div>
            )}

            {cart.length === 0 ? (
                <p className="text-gray-600">Votre panier est vide.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {cart.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onRemove={removeFromCart}
                                onUpdate={updateQuantity}
                            />
                        ))}
                    </div>

                    <div className="cart-total">
                        Total : {total.toFixed(2)} €
                    </div>

                    <div className="cart-actions">
                        <button onClick={clearCart} className="clear-btn">
                            🗑 Vider le panier
                        </button>
                        <button onClick={handleValidateOrder} className="checkout-btn">
                            ✅ Valider la commande
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
