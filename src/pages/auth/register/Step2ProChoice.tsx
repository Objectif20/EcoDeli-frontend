import { useContext } from "react";
import { RegisterContext } from "./RegisterContext";

export default function Step2ProChoice() {
    const { setIsPrestataire, nextStep } = useContext(RegisterContext);

    const handleChoice = (isPrestataire: boolean) => {
        setIsPrestataire(isPrestataire);
        nextStep();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="mb-8 text-2xl font-semibold text-gray-800">
                Êtes-vous un prestataire ou un commerçant ?
            </h2>
            <div className="flex gap-4">
                <button
                    className="px-6 py-3 text-white bg-purple-500 rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    onClick={() => handleChoice(true)}
                >
                    Prestataire
                </button>
                <button
                    className="px-6 py-3 text-white bg-orange-500 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    onClick={() => handleChoice(false)}
                >
                    Commerçant
                </button>
            </div>
        </div>
    );
}
