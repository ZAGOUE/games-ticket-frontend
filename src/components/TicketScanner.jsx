// src/components/TicketScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const TicketScanner = ({ onScanSuccess }) => {
    const scannerRef = useRef(null);
    const [scanned, setScanned] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);

    useEffect(() => {
        // Vérification plus robuste de onScanSuccess
        if (!onScanSuccess || typeof onScanSuccess !== "function") {
            console.error("❌ onScanSuccess n'est pas une fonction valide", onScanSuccess);
            return;
        }

        const initScanner = async () => {
            try {
                // Test de permission caméra
                await navigator.mediaDevices.getUserMedia({ video: true });

                setCameraReady(true);
                const scanner = new Html5QrcodeScanner("reader", {
                    fps: 10,
                    qrbox: { width: 300, height: 300 },
                    rememberLastUsedCamera: true,
                });

                scanner.render(
                    (decodedText) => {
                        console.log("✅ QR Code détecté :", decodedText);
                        setScanned(true);
                        scanner.clear().then(() => {
                            onScanSuccess(decodedText);
                        }).catch((err) => {
                            console.error("Erreur à l'arrêt du scanner :", err);
                        });
                    },
                    (error) => {
                        console.log("Scan error (normal during operation):", error);
                    }
                );

                scannerRef.current = scanner;
            } catch (err) {
                console.error("❌ Erreur caméra :", err);
                setCameraError("Impossible d'accéder à la caméra. Vérifiez les autorisations.");
            }
        };

        initScanner();

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch((err) => {
                    console.error("Erreur clear (unmount) :", err);
                });
            }
        };
    }, [onScanSuccess]);

    const handleRestart = () => {
        setScanned(false);
        setCameraReady(false);
        setCameraError(null);
        if (scannerRef.current) {
            scannerRef.current.clear().then(() => {
                // Réinitialiser le scanner plutôt que recharger la page
                window.location.reload();
            });
        }
    };

    return (
        <div className="text-center mt-4">


            {!cameraReady && !cameraError && (
                <p className="text-gray-500">⏳ Chargement de la caméra...</p>
            )}

            <div id="reader" style={{ width: "100%", maxWidth: 500, margin: "auto" }}></div>

            {cameraError && (
                <div className="mt-3 text-red-600 font-semibold">
                    {cameraError}
                    <button onClick={handleRestart} className="ml-2 btn btn-primary">
                        Réessayer
                    </button>
                </div>
            )}


        </div>
    );
};

export default TicketScanner;