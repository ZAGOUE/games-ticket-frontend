import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

const TicketScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);

    const handleScan = async (result) => {
        if (result?.text) {
            console.log("🎯 QR Code détecté :", result.text);
            try {
                const res = await axios.get(`/api/orders/verify-ticket/${result.text}`);
                setScanResult(res.data);
                setError(null);
            } catch (err) {
                setError("Billet invalide ou déjà utilisé.");
                setScanResult(null);
            }
        }
        if (error) {
            console.warn("⚠️ Erreur du scanner :", error?.message);
        }
    };


    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4">🎟️ Scanner un billet</h2>
            <QrReader
                onResult={handleScan}
                constraints={{ facingMode: "environment" }}
                containerStyle={{ width: "100%" }}
            />
            {scanResult && (
                <div className="mt-4 p-3 border rounded shadow">
                    <h3 className="font-semibold">✅ Billet vérifié</h3>
                    <p><strong>Nom :</strong> {scanResult.user.name}</p>
                    <p><strong>Offre :</strong> {scanResult.offer.name}</p>
                    <p><strong>Status :</strong> {scanResult.status}</p>
                    <p><strong>Validé le :</strong> {scanResult.validated_at || "—"}</p>
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
