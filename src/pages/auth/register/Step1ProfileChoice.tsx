import { useContext } from "react";
import { RegisterContext } from "./RegisterContext";

export default function Step1ProfileChoice() {
    const { setIsPro, nextStep } = useContext(RegisterContext);

    const handleChoice = (isPro: boolean) => {
        setIsPro(isPro);
        nextStep();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="mb-8 text-2xl font-semibold text-gray-800">
                Êtes-vous un professionnel ou un particulier ?
            </h2>
            <div className="flex gap-4">
                <button
                    className="px-6 py-3 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => handleChoice(true)}
                >
                    Professionnel
                </button>
                <button
                    className="px-6 py-3 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                    onClick={() => handleChoice(false)}
                >
                    Particulier
                </button>
            </div>
        </div>
    );
}
