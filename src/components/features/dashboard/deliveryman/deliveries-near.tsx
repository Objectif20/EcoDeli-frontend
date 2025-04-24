"use client"

import { PackageSearch } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NearDeliveries() {
  const deliveries = {
    count: 12,
    period: "mars",
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Colis près de chez vous</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary">{deliveries.count}</span>
        </div>
        <div className="flex items-center justify-center p-2 rounded-full">
          <PackageSearch className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
