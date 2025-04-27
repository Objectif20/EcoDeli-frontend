"use client"

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import DeliveryCard from "@/components/features/deliveries/delivery-card"
import PackageIcon from "@/assets/illustrations/package.svg"


const deliveriesData = [
  {
    id: "#A7EHDK7",
    from: "Paris",
    to: "Marseille",
    status: "En cours de livraison",
    pickupDate: "12 mai 2025",
    estimatedDeliveryDate: "14 mai 2025",
    coordinates: {
      origin: [48.8566, 2.3522] as [number, number],
      destination: [43.2965, 5.3698] as [number, number],
      current: [45.764043, 4.835659] as [number, number],
    },
    progress: 50,
  },
  {
    id: "#B8FJLM2",
    from: "Lyon",
    to: "Bordeaux",
    status: "En transit",
    pickupDate: "10 mai 2025",
    estimatedDeliveryDate: "13 mai 2025",
    coordinates: {
      origin: [45.764043, 4.835659] as [number, number],
      destination: [44.837789, -0.57918] as [number, number],
      current: [45.1, 1.5] as [number, number],
    },
    progress: 30,
  },
  {
    id: "#C9GKNP4",
    from: "Lille",
    to: "Nice",
    status: "En préparation",
    pickupDate: "15 mai 2025",
    estimatedDeliveryDate: "18 mai 2025",
    coordinates: {
      origin: [50.62925, 3.057256] as [number, number],
      destination: [43.7102, 7.262] as [number, number],
      current: [50.62925, 3.057256] as [number, number],
    },
    progress: 10,
  },
  {
    id: "#D1HPQR6",
    from: "Strasbourg",
    to: "Toulouse",
    status: "En cours de livraison",
    pickupDate: "11 mai 2025",
    estimatedDeliveryDate: "15 mai 2025",
    coordinates: {
      origin: [48.5734, 7.7521] as [number, number],
      destination: [43.6047, 1.4442] as [number, number],
      current: [46.1, 4.2] as [number, number],
    },
    progress: 65,
  },
]




export default function OngoingDeliveries() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Mes livraisons en cours"],
        links: ["/office/dashboard"],
      }),
    )

    if (typeof window !== "undefined") {
      L.Icon.Default.mergeOptions({
        iconUrl: PackageIcon,
      })
    }
  }, [dispatch])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes livraisons en cours</h1>

      {deliveriesData.length === 0 ? (
        <Card className="rounded-xl shadow-lg border bg-background">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-semibold text-foreground">Aucune livraison en cours</CardTitle>
            <p className="text-muted">Vous n'avez pas de livraison en cours.</p>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveriesData.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
      )}
    </div>
  )
}
