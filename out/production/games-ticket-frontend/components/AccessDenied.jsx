import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
    return (
        <div className="container mt-5">
            <h2>⛔ Accès refusé</h2>
            <p>Vous devez être contrôleur  pour accéder à cette page.</p>
            <Link to="/" className="btn btn-primary mt-3">Retour à l'accueil</Link>
        </div>
    );
};

export default AccessDenied;
