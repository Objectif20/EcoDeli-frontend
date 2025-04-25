"use client"

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import type { RootState } from "@/redux/store"
import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SubscriptionDataTable } from "@/components/features/settings/subscriptions/data-tables"

const SubscriptionSettings: React.FC = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user)

  const isProvider = user?.profile.includes("PROVIDER")
  const isClient = user?.profile.includes("CLIENT")
  const isMerchant = user?.profile.includes("MERCHANT")
  const isDeliveryman = user?.profile.includes("DELIVERYMAN")

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Paramètres", "Abonnements"],
        links: ["/office/dashboard"],
      }),
    )
  }, [dispatch])

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Abonnements</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">Paramètres généraux</Link>
          <Link to="/office/profile">Profil</Link>
          <Link to="/office/privacy">Confidentialité</Link>
          <Link to="/office/contact-details">Coordonnées</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions" className="font-semibold text-primary active-link">
              Abonnements
            </Link>
          )}
          {(isProvider || isDeliveryman) && <Link to="/office/billing-settings">Facturations</Link>}
          <Link to="/office/reports">Signalements</Link>
        </nav>
        <div className="grid gap-6">
          <h1 className="text-2xl font-semibold">Votre abonnement</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Votre abonnement actuel : <span className="text-primary">Starter</span>
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-primary">
                  9,99€ <span className="text-sm font-normal text-muted-foreground">/mois</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Réduction à l'envoi de colis :</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Envoi prioritaire des 5% :</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Réduction permanente de :</span>
                    <span className="font-medium">3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Que souhaitez-vous faire ?</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/office/subscription-plans" className="text-primary hover:underline">
                      Découvrir les autres formules d'abonnements
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/office/change-subscription" className="text-primary hover:underline">
                      Changer de formule
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/office/cancel-subscription" className="text-primary hover:underline">
                      Stopper votre abonnement
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <SubscriptionDataTable />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionSettings

