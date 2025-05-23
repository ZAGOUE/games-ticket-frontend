import React from "react";

const CartItem = ({ item, onRemove, onUpdate }) => {
    return (
        <div className="cart-item">
            <div className="info">
                <h4>{item.name} 🟢️</h4>
                <p>{item.price} €</p>
            </div>
            <div className="actions">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdate(item.id, e.target.value)}
                    className="quantity-input"
                />
                <button onClick={() => onRemove(item.id)} className="cart-btn">
                    🗑 Supprimer
                </button>
            </div>
        </div>
    );
};

export default CartItem;
