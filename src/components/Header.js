import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useCart } from "../context/CartContext";

const getUserInfoFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return {};

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return {
            firstName: payload.first_name || payload.firstName || "",
            lastName: payload.last_name || payload.lastName || "",
            email: payload.username || payload.email || ""
        };
    } catch (error) {
        console.error("Error decoding token:", error);
        return {};
    }
};

const Header = () => {
    const { userEmail, logout } = useContext(UserContext);
    const { cart } = useCart();

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

// Récupère les informations depuis le localStorage ou le token
    const firstName = localStorage.getItem("first_name");
    const lastName = localStorage.getItem("last_name");

    const handleLogout = () => {
        logout();
        localStorage.removeItem("token");
        localStorage.removeItem("first_name");
        localStorage.removeItem("last_name");
        alert("Vous êtes déconnecté.");
        window.location.href = "/login";
    };

    const handleNewRegistration = () => {
        logout();
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    // Détection du rôle via token
    const token = localStorage.getItem("token");
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


    return (
        <header>
            <h1 className="games">GamesTicket</h1>
            <nav>
                {isAdmin && (
                    <>
                        <Link to="/dashboard">Tableau de bord</Link>
                        <Link to="/admin/orders">Toutes les réservations</Link>
                        <Link to="/admin/offers">Gérer les Offres</Link>
                    </>
                )}

                {isController && !isAdmin && (
                    <>
                        <Link to="/scan-ticket">Scanner un billet</Link>
                    </>
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
                       <span style={{ marginLeft: "1rem" }}>
                        👋 Bienvenue, {firstName && lastName ? `${firstName} ${lastName}` : userEmail }
                        </span>


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

                {!isAdmin && !isController && (
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