import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext({
    user: null,
    userEmail: null,
    login: () => {},
    logout: () => {},
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");

        if (token && email) {
            setUser({ email, roles });
        }
    }, []);

    const login = (email, roles = []) => {
        localStorage.setItem("email", email);
        localStorage.setItem("roles", JSON.stringify(roles));
        setUser({ email, roles });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("roles");
        setUser(null);
    };

    const userEmail = user?.email || null;

    return (
        <UserContext.Provider value={{ user, userEmail, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
