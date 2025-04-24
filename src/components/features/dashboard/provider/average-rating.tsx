"use client"

import { Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AverageRating() {
  const rating = {
    score: 4.3,
    total: 5,
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Note moyenne</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          <span className="text-3xl font-bold text-primary">{rating.score}</span>
          <span className="text-xs text-muted-foreground mt-1">Moyenne des avis sur vous</span>
        </div>
        <div className="flex items-center justify-center bg-yellow-100 p-2 rounded-full">
          <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
        </div>
      </CardContent>
    </Card>
  )
}
