import React, { useEffect, useState } from "react";
import api from "../services/api";

const AdminOffers = () => {
    const [offers, setOffers] = useState([]);
    const [form, setForm] = useState({ name: "", description: "", price: 0, max_people: 1 });
    const [editingId, setEditingId] = useState(null);
    const token = localStorage.getItem("token");

    const fetchOffers = async () => {
        try {
            const res = await api.get("/api/offers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log("📦 Offres reçues :", res.data); // Ajoute ce log pour vérifier la réponse
            setOffers(res.data);
        } catch (err) {
            console.error("Erreur chargement offres:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: name === "price" || name === "max_people" ? Number(value) : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            name: form.name,
            description: form.description,
            price: form.price,
            max_people: form.max_people,
        };
        try {
            if (editingId) {
                await api.put(`/api/offers/${editingId}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            } else {
                await api.post("/api/offers/", form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            setForm({ name: "", description: "", price: 0, max_people: 1 });
            setEditingId(null);
            fetchOffers();
        } catch (err) {
            console.error("Erreur soumission:", err);
        }
    };

    const handleEdit = (offer) => {
        setForm({
            name: offer.name,
            description: offer.description,
            price: offer.price,
            max_people: offer.max_people,
        });
        setEditingId(offer.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cette offre ?")) {
            try {
                await api.delete(`/api/offers/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                fetchOffers();
            } catch (err) {
                console.error("Erreur suppression:", err);
            }
        }
    };

    useEffect(() => {
        fetchOffers();
    }, []);

    return (
        <div className="container mt-4">
            <h2>⚙️ Gestion des Offres</h2>
            <form onSubmit={handleSubmit} className="mb-4">
                <input type="text" name="name" placeholder="Nom" value={form.name} onChange={handleChange} required />
                <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
                <input type="number" name="price" placeholder="Prix" value={form.price} onChange={handleChange} required />
                <input type="number" name="max_people" placeholder="Places" value={form.max_people} onChange={handleChange} min={1} required />
                <button type="submit" className="btn btn-primary mt-2">
                    {editingId ? "Modifier" : "Créer"} l'offre
                </button>
            </form>
            <div className="scroll-list">
            <ul className="list-group">
                {offers.map((offer) => (
                    <li key={offer.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{offer.name}</strong> — {offer.description} ({offer.price}€, {offer.max_people} pers)
                        </div>
                        <div>
                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(offer)}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(offer.id)}>🗑️</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </div>
    );
};

export default AdminOffers;
