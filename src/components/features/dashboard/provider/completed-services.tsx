"use client"

import { Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CompletedServices() {
  const services = {
    count: 12,
    period: "mars",
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Prestations réalisées</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary">{services.count}</span>
          <span className="text-xs text-muted-foreground mt-1">prestations réalisées en {services.period}</span>
        </div>
        <div className="flex items-center justify-center bg-green-100 p-2 rounded-full">
          <Package className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
