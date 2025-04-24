"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Meteo() {
  const weather = {
    city: "Paris",
    temperature: 22,
    icon: "☀️",
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Météo</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full">
        <div className="flex flex-col">
          <span className="text-3xl font-bold">{weather.temperature}°C</span>
          <span className="text-muted-foreground">{weather.city}</span>
        </div>
        <div className="text-4xl">{weather.icon}</div>
      </CardContent>
    </Card>
  )
}
