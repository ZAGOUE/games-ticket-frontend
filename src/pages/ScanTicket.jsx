import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // adapte selon ton projet
import { Navigate } from "react-router-dom";
import TicketScanner from "../components/TicketScanner";

const ScanTicket = () => {
    const { user } = useContext(AuthContext);

    // 🔐 Protection : uniquement ROLE_ADMIN
    if (!user || !user.roles.includes("ROLE_ADMIN")) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">🎫 Scanner un billet</h1>
            <p className="text-gray-600 mb-4">
                Utilisez la caméra pour scanner le billet d’un participant. Seuls les billets payés et non utilisés seront validés.
            </p>

            <TicketScanner />
        </div>
    );
};

export default ScanTicket;
