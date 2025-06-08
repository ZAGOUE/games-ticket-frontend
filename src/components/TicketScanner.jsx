import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";

const TicketScanner = ({ onScanSuccess }) => {
    const scannerRef = useRef(null);
    const [, setScanned] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);

    useEffect(() => {
        const initScanner = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                setCameraReady(true);

                const scanner = new Html5QrcodeScanner("reader", {
                    fps: 10,
                    qrbox: { width: 300, height: 300 },
                    rememberLastUsedCamera: true,
                });

                scanner.render(
                    (decodedText) => {
                        setScanned(true);
                        scanner.clear().then(() => onScanSuccess(decodedText));
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
                scannerRef.current.clear().catch((err) => console.error("Erreur clear (unmount) :", err));
            }
        };
    }, [onScanSuccess]);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new Html5Qrcode("reader");
            try {
                const result = await reader.scanFile(file, true);
                console.log("✅ QR Code détecté depuis l'image :", result);
                onScanSuccess(result);
            } catch (error) {
                console.error("Erreur lors du scan du fichier :", error);
                setCameraError("Erreur lors du scan de l'image. Vérifiez que l'image contient bien un QR Code.");
            }
        }
    };

    return (
        <div className="text-center mt-4">
            {!cameraReady && !cameraError && (
                <p className="text-gray-500">⏳ Chargement de la caméra...</p>
            )}

            <div id="reader" style={{ width: "100%", maxWidth: 500, margin: "auto" }}></div>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="mt-3 btn btn-secondary"
                style={{ display: "block", margin: "10px auto" }}
            />

            {cameraError && (
                <div className="mt-3 text-red-600 font-semibold">
                    {cameraError}
                    <button onClick={() => window.location.reload()} className="ml-2 btn btn-primary">
                        Réessayer
                    </button>
                </div>
            )}
        </div>
    );
};

export default TicketScanner;
