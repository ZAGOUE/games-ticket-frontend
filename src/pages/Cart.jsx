
import React, { useContext, useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

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
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/orders",
                    {
                        offer_id: item.id,
                        quantity: item.quantity,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Commande créée :", response.data);
            }

            alert("Commande validée avec succès !");
            clearCart();
            navigate("/booking", { state: { fromCart: true } });
        } catch (error) {
            console.error("Erreur lors de la validation :", error);
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
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">🛒 Mon panier</h1>

            {resumePending && (
                <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                    Vous êtes maintenant connecté. Cliquez sur "Valider la commande" pour finaliser votre achat.
                </div>
            )}

            {cart.length === 0 ? (
                <p className="text-gray-600">Votre panier est vide.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onRemove={removeFromCart}
                            onUpdate={updateQuantity}
                        />
                    ))}

                    <div className="mt-6 text-right font-bold text-lg">
                        Total : {total.toFixed(2)} €
                    </div>

                    <div className="mt-4 flex justify-end gap-4">
                        <button
                            onClick={clearCart}
                            className="bg-gray-200 px-4 py-2 rounded"
                        >
                            Vider le panier
                        </button>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            onClick={handleValidateOrder}
                        >
                            ✅ Valider la commande
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
