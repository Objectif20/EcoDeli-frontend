import { useContext, useState } from "react";
import { RegisterContext } from "./RegisterContext";
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function Step5Stripe() {
    const { nextStep, setClientInfo, isPro, setCommercantInfo, setIsFinished } = useContext(RegisterContext);
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            setError("Card details are not available.");
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: {
            },
        });

        if (error) {
            setError(error.message || "An unknown error occurred.");
        } else {

            if (isPro) {
                setCommercantInfo((prev: any) => ({ ...prev, stripe_temp_key: paymentMethod.id }));
            } else {
                setClientInfo((prev: any) => ({ ...prev, stripe_temp_key: paymentMethod.id }));
            }
            setIsFinished(true);
            nextStep();
            console.log('PaymentMethod:', paymentMethod);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-md shadow-md">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Entrer vos coordonnées Stripe</h2>
            <div className="mb-4">
                <label className="block text-gray-700">Carte de crédit</label>
                <CardElement
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>
            {error && <div className="text-red-500">{error}</div>}
            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={!stripe}
            >
                Terminer
            </button>
        </form>
    );
}
