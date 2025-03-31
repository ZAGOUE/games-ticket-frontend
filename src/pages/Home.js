import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container">
            <h1>Bienvenue sur GamesTicket 🎟️</h1>
            <p>Réservez vos billets pour les Jeux Olympiques en toute simplicité.</p>
            <Link to="/offers" className="btn">Voir les offres</Link>
        </div>
    );
};

export default Home;
