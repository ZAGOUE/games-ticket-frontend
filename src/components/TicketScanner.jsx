import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

const TicketScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    const handleScan = async (result) => {
        if (result?.text) {
            let orderKey = result.text;

            // Extraire la clé si un lien complet est scanné
            const prefix = "verify-ticket/";
            if (orderKey.includes(prefix)) {
                orderKey = orderKey.split(prefix).pop();
            }

            console.log("🎯 QR Code détecté :", orderKey);

            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    `/api/orders/verify-ticket/${orderKey}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setScanResult(res.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || "Billet invalide ou déjà utilisé.");
                setScanResult(null);
            }
        }
    };





    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">🎟️ Scanner un billet</h2>
            <div style={{ border: "2px dashed #999", padding: "1rem", background: "#f9f9f9" }}>
                <p className="text-sm text-gray-500">Montrez un QR code dans la zone ci-dessous.</p>

                <QrReader
                    constraints={{ facingMode: "user" }} // ou "environment"
                    videoContainerStyle={{ width: "100%", height: "auto" }}
                    videoStyle={{ width: "100%", maxHeight: "400px" }}
                    onResult={(result, error) => {
                        if (result?.text) {
                            handleScan(result);
                        }

                        // Ne logue l’erreur que si elle est réelle
                        if (error && error.message) {
                            console.warn("Erreur QR Reader :", error.message);
                        }
                    }}

                />
            </div>

            {scanResult && (
                <div className="mt-4 p-3 border rounded shadow">
                    <h3 className="font-semibold">✅ Billet vérifié</h3>
                    <p><strong>Nom :</strong> {scanResult.user}</p>
                    <p><strong>Offre :</strong> {scanResult.offer}</p>
                    <p><strong>Status :</strong> {scanResult.status}</p>
                    <p><strong>Validé le :</strong> {scanResult.validated_at || "—"}</p>
                    <button className="mt-3 btn btn-secondary" onClick={() => setScanResult(null)}>
                        🔄 Scanner un autre billet
                    </button>
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

export default TicketScanner;
