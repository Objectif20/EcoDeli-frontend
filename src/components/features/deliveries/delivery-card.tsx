"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import { Truck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

type DeliveryProps = {
  delivery: {
    id: string
    from: string
    to: string
    status: string
    pickupDate: string
    estimatedDeliveryDate: string
    coordinates: {
      origin: [number, number]
      destination: [number, number]
      current: [number, number]
    }
    progress: number
  }
}

export default function DeliveryCard({ delivery }: DeliveryProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "En cours de livraison":
        return "bg-primary/20 text-primary hover:bg-primary/20"
      case "En transit":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "En préparation":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  return (
    <Card className="rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-2 rounded-full">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl font-semibold">Livraison {delivery.id}</CardTitle>
        </div>
        <Badge variant="outline" className={`${getBadgeColor(delivery.status)} px-4 py-1.5 rounded-full`}>
          {delivery.status}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-[300px] overflow-hidden rounded-md">
          {isMounted && (
            <MapContainer
              center={delivery.coordinates.current}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              zoomControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={delivery.coordinates.origin}>
                <Popup>Départ: {delivery.from}</Popup>
              </Marker>
              <Marker position={delivery.coordinates.destination}>
                <Popup>Arrivée: {delivery.to}</Popup>
              </Marker>
              <Marker position={delivery.coordinates.current}>
                <Popup>Position actuelle</Popup>
              </Marker>
            </MapContainer>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center">
              <p className="text-gray-700 font-medium">ID : </p>
              <span className="text-primary font-semibold ml-2">{delivery.id}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex flex-col items-start">
                <span className="text-xl font-semibold">{delivery.from}</span>
                <div className="flex items-center mt-2">
                  <div className="bg-primary w-4 h-4 rounded-full"></div>
                  <div className="text-sm text-foreground ml-2">
                    Colis transmis
                    <div className="font-semibold">{delivery.pickupDate}</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 mx-4 relative">
                <div className="h-1 bg-background w-full absolute top-1/2 transform -translate-y-1/2"></div>
                <div
                  className="h-1 bg-primary absolute top-1/2 transform -translate-y-1/2"
                  style={{ width: `${delivery.progress}%` }}
                ></div>
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 bg-background p-1 rounded-full border-2 border-primary"
                  style={{ left: `${delivery.progress}%` }}
                >
                  <Truck className="h-4 w-4 text-primary" />
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-xl font-semibold">{delivery.to}</span>
                <div className="flex items-center mt-2 justify-end">
                  <div className="text-sm text-gray-600 mr-2 text-right">
                    Date d'arrivée estimée pour le :
                    <div className="font-semibold">{delivery.estimatedDeliveryDate}</div>
                  </div>
                  <div className="bg-gray-200 w-4 h-4 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
