import React from "react";
import { useCart } from "../context/CartContext";
import CartItem from "../components/CartItem";

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">🛒 Mon panier</h1>

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
                            onClick={() => alert("Simulation du paiement...")}
                        >
                            Valider la commande
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart;
