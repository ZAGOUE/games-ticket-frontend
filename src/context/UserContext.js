import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        if (token && email) {
            setUserEmail(email);
        }
    }, []);

    const login = (email) => {
        localStorage.setItem("email", email);
        setUserEmail(email);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        setUserEmail(null);
    };

    return (
        <UserContext.Provider value={{ userEmail, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};