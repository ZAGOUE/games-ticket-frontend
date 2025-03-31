import React from "react";

const CartItem = ({ item, onRemove, onUpdate }) => {
    return (
        <div className="flex justify-between items-center p-3 border-b">
            <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p>{item.price} €</p>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => onUpdate(item.id, e.target.value)}
                    className="w-16 border px-2 py-1"
                />
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:underline"
                >
                    Supprimer
                </button>
            </div>
        </div>
    );
};

export default CartItem;
