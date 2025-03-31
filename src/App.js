import React from "react";
import AppRouter from "./routes/AppRouter";
import { UserProvider } from "./context/UserContext";
import "./styles.css";
import { CartProvider } from "./context/CartContext";


const App = () => {
    return (
        <UserProvider>
            <CartProvider>
                <div className="App">
                    <AppRouter />
                </div>
            </CartProvider>
        </UserProvider>

    );
};

export default App;
