"use client"

import { useContext } from "react"
import { RegisterContext } from "./RegisterContext"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Step2ProChoice() {
  const { setIsPrestataire, nextStep } = useContext(RegisterContext)

  const handleChoice = (isPrestataire: boolean) => {
    setIsPrestataire(isPrestataire)
    nextStep()
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12">
            Quel type de professionnel êtes-vous ?
          </h2>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center mb-12">
            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center max-w-sm mx-auto md:mx-0 w-full">
              <h3 className="text-xl font-semibold mb-4">Commerçant</h3>
              <p className="text-center mb-8 text-sm">
                Vous souhaitez utiliser EcoDeli afin de mettre en avant votre commerce et vos produits.
              </p>
              <div className="h-40 w-full mb-8">{/* Image placeholder - you'll add the image */}</div>
              <Button
                onClick={() => handleChoice(false)}
                className="w-full max-w-xs rounded-full"
                variant="default"
              >
                S&apos;inscrire
              </Button>
            </div>

            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center max-w-sm mx-auto md:mx-0 w-full">
              <h3 className="text-xl font-semibold mb-4">Prestataire</h3>
              <p className="text-center mb-8 text-sm">
                Vous avez pour ambition de rendre le monde meilleur en proposant des services à la personne.
              </p>
              <div className="h-40 w-full mb-8">{/* Image placeholder - you'll add the image */}</div>
              <Button
                onClick={() => handleChoice(true)}
                className="w-full max-w-xs rounded-full"
                variant="default"
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
