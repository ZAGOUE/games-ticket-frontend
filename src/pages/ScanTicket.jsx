// src/pages/ScanTicket.jsx
import React, { useState } from "react";
import TicketScanner from "../components/TicketScanner";
import axios from "axios";

const ScanTicket = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleScanSuccess = async (text) => {
        console.log("SCAN DÉTECTÉ :", text);

        let orderKey = text;
        if (text.includes("/verify-ticket/")) {
            orderKey = text.split("/verify-ticket/")[1];
        }

        const token = localStorage.getItem("token");
        console.log("📦 Token envoyé :", token);

        if (!token) {
            setError("Aucun token trouvé.");
            return;
        }

        try {
            const response = await axios.get(`/api/orders/verify-ticket/${orderKey}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setResult(response.data);
            setError(null);
        } catch (err) {
            console.error("Erreur de vérification :", err);
            const errorMessage = err.response?.data?.message || err.message || "Erreur lors de la vérification.";
            setError(errorMessage);
            setResult(null);
        }
    };

    const handleRestartScan = () => {
        setResult(null);
        setError(null);
    };

    return (
        <div className="container text-center mt-4">
            <h2>📸 Scanner un billet</h2>

            {(!result && !error) && (
                <TicketScanner onScanSuccess={handleScanSuccess} />
            )}

            {(result || error) && (
                <button onClick={handleRestartScan} className="btn btn-secondary mt-3">
                    🔁 Scanner un autre billet
                </button>
            )}

            {result && (
                <div className="mt-4 p-3 border rounded shadow">
                    <h3 className="font-semibold">✅ Billet vérifié</h3>
                    <p><strong>Utilisateur :</strong> {result.user}</p>
                    <p><strong>Offre :</strong> {result.offer}</p>
                    <p><strong>Status :</strong> {result.status}</p>
                    <p><strong>Validé le :</strong> {result.validated_at || "—"}</p>
                </div>
            )}

            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-800 border border-red-400 rounded">
                    ❌ {error}
                </div>
            )}
        </div>
    );
};

export default ScanTicket;
