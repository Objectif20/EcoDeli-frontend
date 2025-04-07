"use client"

import { Button } from "@/components/ui/button"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import type { RootState } from "@/redux/store"
import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

const PrivacySettings: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user)

  const isProvider = user?.profile.includes("PROVIDER")
  const isClient = user?.profile.includes("CLIENT")
  const isMerchant = user?.profile.includes("MERCHANT")
  const isDeliveryman = user?.profile.includes("DELIVERYMAN")

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Paramètres", "Confidentialité"],
        links: ["/office/dashboard"],
      }),
    )
  }, [dispatch])

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Confidentialité</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">Paramètres généraux</Link>
          <Link to="/office/profile">Profil</Link>
          <Link to="/office/privacy" className="font-semibold text-primary active-link">
            Confidentialité
          </Link>
          <Link to="/office/contact-details">Coordonnées</Link>
          {(isMerchant || isClient) && <Link to="/office/subscriptions">Abonnements</Link>}
          {(isProvider || isDeliveryman) && <Link to="/office/billing-settings">Facturations</Link>}
          <Link to="/office/reports">Signalements</Link>
        </nav>
        <div className="grid gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">Confidentialité</h2>
              <p className="text-sm text-muted-foreground">Modifier votre configuration de confidentialité</p>
              <div className="h-px bg-border my-6"></div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium">Mise à jour de votre mot de passe</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Pour mettre à jour votre mot de passe, nous pouvons vous envoyer un email afin de le réinitialiser.
                  <br />
                  Si vous avez activé la double authentification, elle vous sera demandée avant la modification.
                </p>
              </div>
              <Button className=" px-4 py-2 rounded-md text-sm transition-colors">
                Modifier mon mot de passe
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <h3 className="text-base font-medium">Télécharger mes données</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  En conformité avec l'article 20 du RGPD, EcoDeli se doit de vous mettre à disposition un document
                  recensant l'ensemble des informations personnelles que EcoDeli possède.
                </p>
              </div>
              <Button className=" px-4 py-2 rounded-md text-sm transition-colors">
                Télécharger ce document
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <h3 className="text-base font-medium">Activer la double authentification</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Afin d'améliorer la sécurité de votre compte, EcoDeli vous recommande d'activer cette double
                  authentification. Pour se faire, vous avez besoin d'une application d'authentification (Authy...)
                </p>
              </div>
              <Button className="px-4 py-2 rounded-md text-sm transition-colors">
                Activer la double authentification
              </Button>
            </div>

            <div className="pt-2">
              <p className="text-sm">
                Qu'est-ce que l'A2F ? Retrouvez l'explication juste{" "}
                <a href="#" className="text-primary hover:underline">
                  ici
                </a>
              </p>
            </div>

            <div className="pt-6">
              <p className="text-sm">
                Accéder à la{" "}
                <a href="#" className="text-primary hover:underline">
                  politique de confidentialité de EcoDeli
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacySettings

