import {createContext, useEffect, useState} from "react";

export const UserContext = createContext({
    user: null,
    userEmail: null,
    isAdmin: false,
    roleReady: false,
    login: () => {},
    logout: () => {},
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [roleReady, setRoleReady] = useState(false);
    const [isController, setIsController] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");

        if (token && email) {
            setUser({ email, roles });
            setIsAdmin(roles.includes("ROLE_ADMIN"));
            setIsController(roles.includes("ROLE_CONTROLLER"));


        }

        setRoleReady(true);
    }, []);

    const login = (email, roles = []) => {
        localStorage.setItem("email", email);
        localStorage.setItem("roles", JSON.stringify(roles));

        setUser({ email, roles });
        setIsAdmin(roles.includes("ROLE_ADMIN"));
        setRoleReady(true);
        setIsController(roles.includes("ROLE_CONTROLLER"));
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("roles");
        setUser(null);
        setIsAdmin(false);
        setRoleReady(false);
    };

    return (
        <UserContext.Provider value={{ user, userEmail: user?.email || null, isAdmin, isController, roleReady, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
