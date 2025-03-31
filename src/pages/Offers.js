import React from "react";
import { useCart } from "../context/CartContext";

const Offers = () => {
    const { addToCart } = useCart();

    const offers = [
        { id: 1, name: "Solo", price: 50, description: "Billet pour 1 personne" },
        { id: 2, name: "Duo", price: 90, description: "Billet pour 2 personnes" },
        { id: 3, name: "Familial", price: 150, description: "Billet pour 4 personnes" },
    ];

    const handleAddToCart = (offer) => {
        addToCart(offer);
        alert(`${offer.name} ajouté au panier !`);
    };

    return (
        <div className="container">
            <h1>Nos Offres 🎟️</h1>
            <div className="offers">
                {offers.map((offer) => (
                    <div key={offer.id} className="card">
                        <h2>{offer.name}</h2>
                        <p>{offer.description}</p>
                        <p className="price">{offer.price} €</p>

                        <button
                            className="btn btn-secondary"
                            style={{ marginTop: "0.5rem", backgroundColor: "#1f2937", color: "#fff" }}
                            onClick={() => handleAddToCart(offer)}
                        >
                            🛒 Ajouter au panier
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Offers;
