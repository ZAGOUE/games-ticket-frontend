import React, { useEffect, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";

const Offers = () => {
    const { addToCart } = useCart();
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        const headers = token
            ? { Authorization: `Bearer ${token}` }
            : {}; // 👈 Pas d'Authorization si pas connecté

        axios
            .get("http://localhost:8000/api/offers", { headers })
            .then((res) => setOffers(res.data))
            .catch((err) => console.error("Erreur chargement des offres :", err));
    }, []);


    const handleAddToCart = (offer) => {
        addToCart(offer);
        alert(`${offer.name} ajouté au panier !`);
    };

    return (
        <div className="container">
            <h1 className="text-center mt-4 mb-4">Nos Offres 🎟️</h1>
            <div className="offers d-flex flex-wrap gap-4 justify-content-center">

                {offers.map((offer) => {
                    console.log("Offre reçue :", offer); // 👈 à ajouter temporairement
                    return (
                        <div
                            key={offer.id}
                            className="card-offer card p-3 shadow-sm d-flex flex-column justify-content-between text-center"
                        >

                        <div>
                            <h2>{offer.name}</h2>
                            <p className="description">{offer.description}</p>
                            <p className="price">{offer.price} €</p>
                            <p className="people">👥 {offer.maxPeople} personne{offer.maxPeople > 1 ? "s" : ""}</p>

                        </div>

                            <button
                                className="btn btn-secondary mt-2"
                                style={{ backgroundColor: "#1f2937", color: "#fff" }}
                                onClick={() => handleAddToCart(offer)}
                            >
                                🛒 Ajouter au panier
                            </button>
                        </div>

                    );
                })}
            </div>
        </div>
    );
};

export default Offers;