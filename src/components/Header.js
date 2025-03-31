import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const Header = () => {
    const { userEmail, logout } = useContext(UserContext);
    const { cart } = useCart();
    const navigate = useNavigate();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
        alert("Vous êtes déconnecté.");
        navigate("/login");
    };

    const handleNewRegistration = () => {
        logout();
        navigate("/register", { state: { reset: true } });
    };

    return (
        <header>
            <h1>GamesTicket</h1>
            <nav>
                <Link to="/">Accueil</Link>
                <Link to="/offers">Offres</Link>
                <Link to="/booking">Réservation</Link>
                <Link to="/scan-ticket">Scanner un billet</Link>

                {userEmail ? (
                    <>
                        <span style={{ marginLeft: "1rem" }}>👋 Bienvenue, {userEmail}</span>
                        <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Déconnexion</button>
                        <button onClick={handleNewRegistration} style={{ marginLeft: "1rem" }}>Changer d'utilisateur</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">Connexion</Link>
                        <Link to="/register">Inscription</Link>
                    </>
                )}

                <Link to="/cart" className="relative" style={{ position: "relative", marginLeft: "1rem" }}>
                    🛒 Panier
                    {totalItems > 0 && (
                        <span
                            style={{
                                position: "absolute",
                                top: "-6px",
                                right: "-12px",
                                backgroundColor: "red",
                                color: "white",
                                borderRadius: "50%",
                                padding: "2px 6px",
                                fontSize: "12px",
                            }}
                        >
                            {totalItems}
                        </span>
                    )}
                </Link>
            </nav>
        </header>
    );
};

export default Header;
