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
            const responseData = err.response?.data;

            if (responseData?.code === 'ticket_already_used') {

                setResult({
                    status: 'error',
                    code: responseData.code,
                    validated_at: responseData.validated_at,
                    message: responseData.message
                });
                setError(null);
            } else {
                const errorMessage = responseData?.message || err.message || "Erreur lors de la vérification.";
                setError(errorMessage);
                setResult(null);
            }
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
                    {result.user && (
                        <p>
                            <strong>Utilisateur :</strong> {result.user.first_name} {result.user.last_name} ({result.user.email})
                        </p>
                    )}

                    {result.status === 'success' ? (
                        <h2 style={{ color: 'green', fontSize: '1.8em' }}>
                            ✔️ Billet validé avec succès
                        </h2>
                    ) : result.status === 'error' && result.code === 'ticket_already_used' ? (
                        <h2 style={{ color: 'red', fontSize: '1.8em' }}>
                            ❌ Billet déjà utilisé
                        </h2>
                    ) : null}


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
