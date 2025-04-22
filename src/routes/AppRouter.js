import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Offers from "../pages/Offers";
import Login from "../pages/Login";
import ScanTicket from "../pages/ScanTicket";
import Cart from "../pages/Cart";
import AdminOffers from "../pages/AdminOffers";
import AccessDenied from "../components/AccessDenied";
import AdminOrders from "../pages/AdminOrders";

const getUserRoleFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return [];

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.roles || [];
    } catch (e) {
        return [];
    }
};

const AppRouter = () => {
    const [role, setRole] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newRole = getUserRoleFromToken();
            if (JSON.stringify(newRole) !== JSON.stringify(role)) {
                setRole(newRole);
            }
        }, 200); // vérifie toutes les 200 ms

        return () => clearInterval(interval);
    }, [role]);

    const isAdmin = Array.isArray(role) && role.includes("ROLE_ADMIN");
    const isController = Array.isArray(role) && role.includes("ROLE_CONTROLLER");
    console.log("Rôles détectés :", role);
    console.log("isAdmin :", isAdmin);
    console.log("isController :", isController);


    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/offers" element={<Offers />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin/orders" element={<AdminOrders />} />


                <Route path="/admin/offers" element={isAdmin ? <AdminOffers /> : <AccessDenied />} />
                <Route path="/scan-ticket" element={isController ? <ScanTicket /> : <AccessDenied />} />

            </Routes>
            <Footer />
        </Router>
    );
};

export default AppRouter;