"use client"

import { useContext } from "react"
import { RegisterContext } from "./RegisterContext"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function Step1ProfileChoice() {
  const { setIsPro, nextStep } = useContext(RegisterContext)

  const handleChoice = (isPro: boolean) => {
    setIsPro(isPro)
    nextStep()
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">Quel est votre profil ?</h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center mb-12">
            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center max-w-sm mx-auto md:mx-0 w-full">
              <h3 className="text-xl font-semibold mb-4">Particulier</h3>
              <p className="text-center mb-8 text-sm">
                Vous utilisez l&apos;application pour vous-même et pour faire de chouettes rencontres
              </p>
              <div className="h-40 w-full mb-8">{/* Image placeholder - you'll add the image */}</div>
              <Button
                onClick={() => handleChoice(false)}
                className="py-2 px-8 rounded-full transition-colors w-full max-w-xs"
              >
                S&apos;inscrire
              </Button>
            </div>

            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center max-w-sm mx-auto md:mx-0 w-full">
              <h3 className="text-xl font-semibold mb-4">Professionnel</h3>
              <p className="text-center mb-8 text-sm">
                Vous êtes ici pour mettre en avant votre activité tout en profitant des services les plus fiables.
              </p>
              <div className="h-40 w-full mb-8">{/* Image placeholder - you'll add the image */}</div>
              <Button
                onClick={() => handleChoice(true)}
                className="py-2 px-8 rounded-full transition-colors w-full max-w-xs"
              >
                S&apos;inscrire
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p>
              Vous possédez déjà un compte ?{" "}
              <Link to="/auth/login" className="font-semibold text-primary hover:underline">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
