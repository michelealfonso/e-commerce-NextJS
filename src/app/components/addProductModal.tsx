"use client";

import { useState } from "react";

export default function AddProductModal({ onClose, onProductAdded }: { onClose: () => void, onProductAdded: () => void }) {

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: "",
        price: "",
        imageUrl: "",
    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                price: parseFloat(formData.price),
                slug: formData.name.toLowerCase().replace(/\s+/g, '-'), 
            })
        });

        if (!response.ok) {
            const error = await response.json();
            alert("Errore: " + (error.message || 'Errore sconosciuto'));
            return;
        }
        const product = await response.json();
        console.log("Prodotto creato:", product);
        onProductAdded(),
            onClose();
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Aggiungi Prodotto</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input name="name" placeholder="Nome" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                    <input name="slug" placeholder="Slug univoco" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                    <textarea name="description" placeholder="Descrizione" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                    <input name="price" type="number" placeholder="Prezzo" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                    <input name="imageUrl" placeholder="URL immagine" onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 border rounded"> Annulla </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded"> Salva </button>
                    </div>
                </form>
            </div>
        </div>
    )
}