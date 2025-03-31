import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "../App.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(UserContext);
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get("redirect") || "/dashboard";

    // Réinitialiser les champs si on vient de se déconnecter
    useEffect(() => {
        // Réinitialise toujours les champs à l'arrivée sur la page Login
        setEmail("");
        setPassword("");
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/login", {
                email,
                password
            }, {
                headers: { "Content-Type": "application/json" }
            });

            localStorage.setItem("token", response.data.token);
            login(email);
            alert("Connexion réussie !");
            navigate(redirectPath);
        } catch (err) {
            setError("Email ou mot de passe incorrect !");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Connexion 🔐</h1>
                <p>Veuillez vous connecter</p>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleLogin} className="login-form">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Se connecter</button>
                </form>
                <p>Pas encore de compte ? <a href="/register">Créer un compte</a></p>
            </div>
        </div>
    );
};

export default Login;