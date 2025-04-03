import React, { useContext, useState } from "react";
import { RegisterContext } from "./RegisterContext";

export default function Step4Subscription() {
    const { nextStep, setClientInfo, isPro, setCommercantInfo } = useContext(RegisterContext);
    const [planId, setPlanId] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isPro) {
            setCommercantInfo((prev: any) => ({ ...prev, plan_id: planId }));
        } else {
        setClientInfo((prev: any) => ({ ...prev, plan_id: planId }));
        }
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Choisir mon abonnement</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Plan d'abonnement</label>
                <select
                    value={planId}
                    onChange={(e) => setPlanId(e.target.value)}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    required
                >
                    <option value="">Sélectionnez un plan</option>
                    <option value="1">Plan Basique</option>
                    <option value="2">Plan Premium</option>
                    <option value="3">Plan Entreprise</option>
                </select>
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
