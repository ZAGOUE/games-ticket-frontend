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
    const { login, userEmail } = useContext(UserContext);
    const searchParams = new URLSearchParams(location.search);
    const redirectPath = searchParams.get("redirect") || "/dashboard";
    const autoValidate = searchParams.get("autoValidate") === "true";

    // Redirection immédiate si connectée
    useEffect(() => {
        if (userEmail && localStorage.getItem("token")) {
            navigate(redirectPath);
        }
    }, [userEmail, redirectPath, navigate]);

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
            const response = await axios.post("http://localhost:8000/api/login_check", {
                email,
                password
            }, {
                headers: { "Content-Type": "application/json" }
            });

            const { token, roles } = response.data;
            localStorage.setItem("token", token);

    // Décoder le token pour obtenir l'email
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userEmail = payload.username;

    // Appel à l’API pour récupérer les noms
            const userResponse = await axios.get(`http://localhost:8000/api/users/email/${userEmail}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const { first_name, last_name } = userResponse.data;
            localStorage.setItem("first_name", first_name);
            localStorage.setItem("last_name", last_name);

    // Met à jour le contexte
            login(userEmail, roles);

            alert("Connexion réussie !");
            if (autoValidate) {
                sessionStorage.setItem("autoValidate", "true");
            }
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
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
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