"use client"

import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinishedDeliveries() {
  const services = {
    count: 12,
    period: "mars",
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Demandes de livaisons cette année</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary">{services.count}</span>
          <span className="text-xs text-muted-foreground mt-1">demandes de livraison en {services.period}</span>
        </div>
        <div className="flex items-center justify-center  p-2 rounded-full">
          <Package className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
