import React, { useContext, useState } from "react";
import { RegisterContext } from "./RegisterContext";

export default function Step4PrestataireDocuments() {
    const { nextStep, setPrestataireInfo, setIsFinished } = useContext(RegisterContext);
    const [documents, setDocuments] = useState<FileList | null>(null);
    const [signature, setSignature] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDocuments(e.target.files);
    };

    const handleSignatureChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSignature(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPrestataireInfo((prev: any) => ({ ...prev, documents, signature }));
        setIsFinished(true);
        nextStep();
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Saisir vos documents justificatifs</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Documents</label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700">Signature</label>
                <textarea
                    placeholder="Signature"
                    value={signature}
                    onChange={handleSignatureChange}
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
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
