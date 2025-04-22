import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { register } from "../services/authService";
import { logout } from "../services/authService";
import "../App.css";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { userEmail } = useContext(UserContext);

    useEffect(() => {
        if (userEmail && localStorage.getItem("token")) {
            logout();
        }

        if (location.state?.reset) {
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            });
            navigate(location.pathname, { replace: true });
        }
    }, [location, navigate, userEmail]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            await register(formData);
            setSuccess("Inscription réussie !");

            // ✅ Réinitialiser les champs immédiatement
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: ""
            });

            // ⏳ Redirection après 2 secondes
            setTimeout(() => navigate("/login"), 2000);
        } catch (error) {
            console.log("Réponse erreur:", error.response);
            if (error.response?.status === 409) {
                setError("Cet email est déjà utilisé.");
            } else if (error.response?.data?.errors) {
                // ✅ Affiche les erreurs retournées par le backend (ex: mot de passe faible)
                setError(error.response.data.errors.join("\n"));
            } else {
                setError("Une erreur s'est produite. Veuillez réessayer.");
            }
        }
    };

    if (userEmail) {
        return <p>Vous êtes déjà connecté.</p>;
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <h1>Inscription 📝</h1>
                {error && (
                    <div style={{ color: "red", whiteSpace: "pre-line" }}>
                        {error}
                    </div>
                )}

                {success && <p style={{ color: "green" }}>{success}</p>}
                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Prénom"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Nom"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Mot de passe"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">S'inscrire</button>
                </form>
                <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
            </div>
        </div>
    );
};

export default Register;
