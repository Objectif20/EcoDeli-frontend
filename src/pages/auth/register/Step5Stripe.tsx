"use client"

import React, { useContext, useState } from "react"
import { RegisterContext } from "./RegisterContext"
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"
import LocationSelector from '@/components/ui/location-input'

export default function PaymentPage() {
  const { nextStep, setClientInfo, isPro, setCommercantInfo, setIsFinished } = useContext(RegisterContext)
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [country, setCountry] = useState("FR")
  const [postalCode, setPostalCode] = useState("")
  const [, setCountryName] = useState<string>('')
  const [,setStateName] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    if (!stripe || !elements) {
      setIsProcessing(false)
      return
    }

    const cardNumber = elements.getElement(CardNumberElement)
    const cardExpiry = elements.getElement(CardExpiryElement)
    const cardCvc = elements.getElement(CardCvcElement)

    if (!cardNumber || !cardExpiry || !cardCvc) {
      setError("Les détails de la carte ne sont pas disponibles.")
      setIsProcessing(false)
      return
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardNumber,
        billing_details: {
          address: {
            country: country,
            postal_code: postalCode,
          },
        },
      })

      if (error) {
        setError(error.message || "Une erreur inconnue s'est produite.")
        setIsProcessing(false)
      } else {
        if (isPro) {
          setCommercantInfo((prev: any) => ({ ...prev, stripe_temp_key: paymentMethod.id }))
        } else {
          setClientInfo((prev: any) => ({ ...prev, stripe_temp_key: paymentMethod.id }))
        }
        setIsFinished(true)
        nextStep()
        console.log("PaymentMethod:", paymentMethod)
      }
    } catch (err) {
      setError("Une erreur s'est produite lors du traitement du paiement.")
      console.error(err)
    } finally {
      setIsProcessing(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "hsl(var(--foreground))",
        "::placeholder": {
          color: "hsl(var(--muted-foreground))",
        },
      },
      invalid: {
        color: "hsl(var(--destructive))",
      },
    },
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Hide the left part on mobile */}
      <div className="hidden md:flex w-full md:w-1/2 bg-background p-8 flex-col items-center justify-center">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg?height=40&width=40" alt="EcoDeli Logo" className="h-10 w-10" />
            <h2 className="text-xl font-bold">EcoDeli</h2>
          </div>
        </div>

        <div className="w-full max-w-xs">
          <img src="/placeholder.svg?height=300&width=300" alt="Illustration de paiement" className="w-full h-auto" />
        </div>
      </div>

      {/* Show the form full screen on mobile */}
      <div className="w-full md:w-1/2 bg-secondary p-4 md:p-8 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-col w-full mx-4 md:mx-24">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-center">Finalisez votre inscription</h1>
          </div>

          <div className="space-y-6 flex-grow w-full">
            <div>
              <Label htmlFor="cardNumber" className="text-sm">
                Numéro de la carte
              </Label>
              <div className="mt-1 bg-background rounded-md p-3 border border-input">
                <CardNumberElement id="cardNumber" options={cardElementOptions} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cardExpiry" className="text-sm">
                  Expiration
                </Label>
                <div className="mt-1 bg-background rounded-md p-3 border border-input">
                  <CardExpiryElement id="cardExpiry" options={cardElementOptions} />
                </div>
              </div>
              <div>
                <Label htmlFor="cardCvc" className="text-sm">
                  CVC
                </Label>
                <div className="mt-1 bg-background rounded-md p-3 border border-input">
                  <CardCvcElement id="cardCvc" options={cardElementOptions} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-sm">
                  Pays
                </Label>
                <LocationSelector
                  onCountryChange={(country) => {
                    setCountry(country?.iso2 || 'FR')
                    setCountryName(country?.name || '')
                  }}
                  onStateChange={(state) => {
                    setStateName(state?.name || '')
                  }}
                  enableStateSelection={false}
                />
              </div>
              <div>
                <Label htmlFor="postalCode" className="text-sm">
                  Code Postal
                </Label>
                <Input
                  id="postalCode"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="bg-background"
                  placeholder="Code postal"
                />
              </div>
            </div>
          </div>

          {error && <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">{error}</div>}

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-primary py-3 rounded-md"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? "Traitement en cours..." : "Terminer"}
            </Button>

            <div className="mt-4 flex items-center justify-end text-sm">
              <Lock className="h-4 w-4 mr-1" />
              <span>
                Paiement sécurisé par{" "}
                <a href="https://stripe.com" className="font-bold underline">
                  Stripe
                </a>
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
