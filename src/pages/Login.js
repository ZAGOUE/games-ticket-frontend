import React, { useState, useContext, useEffect } from "react";
import api from "../services/api";
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

    useEffect(() => {
        if (userEmail && localStorage.getItem("token")) {
            navigate(redirectPath);
        }
    }, [userEmail, redirectPath, navigate]);

    useEffect(() => {
        setEmail("");
        setPassword("");
    }, []);

    console.log("API URL utilisée :", process.env.REACT_APP_API_URL);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        console.log("Tentative de connexion avec :");
        console.log("Email :", email);
        console.log("Mot de passe :", password);

        try {
            const response = await api.post("/login", {
                email,
                password
            });

            const { token, roles } = response.data;
            localStorage.setItem("token", token);

            const payload = JSON.parse(atob(token.split('.')[1]));
            const userEmail = payload.username;

            const userResponse = await api.get(`/users/email/${userEmail}`);
            const { first_name, last_name } = userResponse.data;
            localStorage.setItem("first_name", first_name);
            localStorage.setItem("last_name", last_name);

            login(userEmail, roles);

            alert("Connexion réussie !");
            if (autoValidate) {
                sessionStorage.setItem("autoValidate", "true");
            }
            navigate(redirectPath);
        } catch (err) {
            console.error("Erreur attrapée :", err);

            if (err.response) {
                console.error("Status code :", err.response.status);
                console.error("Réponse data :", err.response.data);

                if (err.response.status === 401) {
                    setError("Email ou mot de passe incorrect !");
                } else if (err.response.status === 404) {
                    setError("Erreur 404 - API non trouvée !");
                } else {
                    setError(`Erreur serveur (${err.response.status})`);
                }
            } else {
                setError("Erreur de connexion au serveur.");
            }
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
