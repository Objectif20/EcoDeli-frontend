"use client"

import { MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface NextDeliveryProps {
  origin: string
  destination: string
  date: Date
}

export default function NextDelivery({
  origin = "Paris",
  destination = "Marseille",
  date = new Date(2025, 1, 12, 14, 30),
}: Partial<NextDeliveryProps>) {
  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Prochaine livraison :</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex items-center justify-between w-full mt-2">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
              <MapPin className="h-6 w-6 text-foreground" />
            </div>
            <span className="mt-2 font-medium">{origin}</span>
          </div>

          <div className="flex-1 mx-4">
            <div className="h-0.5 bg-secondary w-full"></div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center">
              <MapPin className="h-6 w-6 text-foreground" />
            </div>
            <span className="mt-2 font-medium">{destination}</span>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-foreground">Prévu le {formattedDate}</p>
        </div>
      </CardContent>
    </Card>
  )
}
