import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Booking from "../pages/Booking";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Offers from "../pages/Offers";
import Login from "../pages/Login";
import TicketScanner from '../components/TicketScanner';
import ScanTicket from "../pages/ScanTicket";
import Cart from "../pages/Cart";

const AppRouter = () => {
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
                <Route path="/scan-ticket" element={<ScanTicket />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default AppRouter;
