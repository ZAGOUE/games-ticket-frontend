import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const Header = () => {
    const { userEmail, logout } = useContext(UserContext);
    const { cart } = useCart();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        alert("Vous êtes déconnecté.");
        window.location.href = "/login";
    };

    const handleNewRegistration = () => {
        logout();
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    // Détection du rôle admin via token
    const token = localStorage.getItem("token");
    let isAdmin = false;
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            isAdmin = payload.roles?.includes("ROLE_ADMIN");
        } catch (e) {
            isAdmin = false;
        }
    }

    return (
        <header>
            <h1 className="games">GamesTicket</h1>
            <nav>
                {!isAdmin && (
                    <>
                        <Link to="/">Accueil</Link>
                        <Link to="/offers">Offres</Link>
                        <Link to="/booking">Réservation</Link>

                    </>
                )}
                {isAdmin && (
                    <>
                        <Link to="/dashboard">Tableau de bord</Link>
                        <Link to="/admin/orders">Toutes les réservations</Link>
                        <Link to="/scan-ticket">Scanner un billet</Link>
                        <Link to="/admin/offers">Gérer les Offres</Link>
                    </>
                )}

                {userEmail ? (
                    <>
                        <span style={{ marginLeft: "1rem" }}>👋 Bienvenue, {userEmail}</span>
                        <button onClick={handleLogout} style={{ marginLeft: "1rem" }}>Déconnexion</button>
                        {!isAdmin && (
                            <button onClick={handleNewRegistration} style={{ marginLeft: "1rem" }}>
                                Changer d'utilisateur
                            </button>
                        )}
                    </>
                ) : (
                    <>
                        <Link to="/login">Connexion</Link>
                        <Link to="/register">Inscription</Link>
                    </>
                )}

                {!isAdmin && (
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
                )}
            </nav>
        </header>
    );
};

export default Header;