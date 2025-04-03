import React, { useContext, useState } from "react";
import { RegisterContext } from "./RegisterContext";

export default function Step3PrestataireProfile() {
    const { nextStep, setPrestataireInfo } = useContext(RegisterContext);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        company_name: "",
        siret: "",
        address: "",
        service_type: "",
        description: "",
        postal_code: "",
        city: "",
        country: "",
        phone: "",
        newsletter: false,
        language_id: "",
        first_name: "",
        last_name: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPrestataireInfo((prev: any) => ({ ...prev, ...formData }));
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Compléter votre profil prestataire</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Mot de passe</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Nom de l'entreprise</label>
                <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">SIRET</label>
                <input
                    type="text"
                    name="siret"
                    value={formData.siret}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Adresse</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Type de service</label>
                <input
                    type="text"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Code postal</label>
                <input
                    type="text"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Ville</label>
                <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Pays</label>
                <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Téléphone</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Prénom</label>
                <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Nom</label>
                <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                    className="mr-2"
                />
                <label className="text-gray-700">S'inscrire à la newsletter</label>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Langue</label>
                <input
                    type="text"
                    name="language_id"
                    value={formData.language_id}
                    onChange={handleChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                Suivant
            </button>
        </form>
    );
}
