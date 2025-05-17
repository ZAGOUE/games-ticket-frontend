import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="container">
            <h1>Bienvenue sur GamesTicket 🎟️</h1>
            <p style={{ color: "green", fontWeight: "bold" }}>
                Réservez vos billets pour les Jeux Olympiques en toute simplicité.
            </p>

            <Link to="/offers" className="btn">Voir les offres</Link>

            <section className="home-section">
                <h2>🇫🇷 Les Jeux Olympiques à Paris</h2>

                <p style={{ color: "#800000", fontWeight: "500" }}>
                    Cette année, la France accueille le monde entier pour célébrer le sport, la passion et l’excellence.
                    Découvrez les épreuves, vibrez avec les athlètes et participez à un moment historique !
                </p>

            </section>

            <section className="home-section">
                <h2>🏅 Épreuves à la une</h2>
                <div className="event-cards">
                    <div className="event-card">
                        <img src={`${process.env.PUBLIC_URL}/images/events/athletisme.jpg`} alt="Athlétisme" />
                        <p className="event-name">Athlétisme</p>
                    </div>
                    <div className="event-card">
                        <img src={`${process.env.PUBLIC_URL}/images/events/natation.jpg`} alt="Natation" />
                        <p className="event-name">Natation</p>
                    </div>
                    <div className="event-card">
                        <img src={`${process.env.PUBLIC_URL}/images/events/gymnastique.jpg`} alt="Gymnastique" />
                        <p className="event-name">Gymnastique</p>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;
