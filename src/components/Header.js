import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const Header = () => {
    const { userEmail, logout } = useContext(UserContext);
    const { cart } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const token = localStorage.getItem("token");
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");

    let roles = [];
    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            roles = decoded.roles || [];
        } catch (error) {
            console.error("Erreur de décodage du token :", error);
        }
    }

    const isAdmin = roles.includes("ROLE_ADMIN");
    const isController = roles.includes("ROLE_CONTROLLER");

    const handleLogout = () => {
        logout();
        localStorage.clear();
        alert("Vous êtes déconnecté.");
        window.location.href = "/login";
    };

    const handleNewRegistration = () => {
        logout();
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="header">
            <div className="header-top">
                <h1 className="games">GamesTicket</h1>
                <button className="menu-toggle" onClick={toggleMenu}>☰</button>
            </div>

            <nav className={`nav-links ${isMenuOpen ? "open" : ""}`}>
                {isAdmin && (
                    <>
                        <Link to="/dashboard">Tableau de bord</Link>
                        <Link to="/admin/orders">Toutes les réservations</Link>
                        <Link to="/admin/offers">Gérer les Offres</Link>
                    </>
                )}

                {isController && !isAdmin && (
                    <Link to="/scan-ticket">Scanner un billet</Link>
                )}

                {!isAdmin && !isController && (
                    <>
                        <Link to="/">Accueil</Link>
                        <Link to="/offers">Offres</Link>
                        <Link to="/booking">Réservation</Link>
                    </>
                )}

                {userEmail ? (
                    <>
                        <span className="user-info">👋 {firstName && lastName ? `${firstName} ${lastName}` : userEmail}</span>
                        <button onClick={handleLogout}>Déconnexion</button>
                        {!isAdmin && <button onClick={handleNewRegistration}>Changer d'utilisateur</button>}
                    </>
                ) : (
                    <>
                        <Link to="/login">Connexion</Link>
                        <Link to="/register">Inscription</Link>
                    </>
                )}

                {!isAdmin && !isController && (
                    <Link to="/cart" className="cart-link">
                        🛒 Panier
                        {totalItems > 0 && (
                            <span className="cart-count">{totalItems}</span>
                        )}
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
