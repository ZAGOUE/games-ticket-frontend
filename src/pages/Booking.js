import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Booking = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const defaultOffer = searchParams.get("offer") || "Solo";

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Vous devez être connecté pour réserver.");
            navigate("/login");
        }
    }, [navigate]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        offer: defaultOffer,
        quantity: 1,
    });

    const offers = ["Solo", "Duo", "Familial"];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Réservation envoyée :", formData);
        alert("Votre réservation a été prise en compte !");
    };

    return (
        <div className="container">
            <h1>Réservation de Tickets 🎫</h1>
            <p>Réservez vos billets pour les Jeux Olympiques en toute simplicité</p>
            <form onSubmit={handleSubmit} className="form">
                <label>Nom :</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label>Email :</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>Offre :</label>
                <select name="offer" value={formData.offer} onChange={handleChange}>
                    {offers.map((offer, index) => (
                        <option key={index} value={offer}>
                            {offer}
                        </option>
                    ))}
                </select>

                <label>Quantité :</label>
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    min="1"
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="btn">Réserver</button>
            </form>
        </div>
    );
};

export default Booking;
