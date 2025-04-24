"use client"

import { Euro } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CurrentBalance() {
  const balance = {
    amount: 32.67,
    currency: "€",
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Votre solde</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between text-sm h-full pt-0">
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="text-3xl font-bold text-primary">{balance.amount}</span>
            <span className="text-xl font-bold text-primary ml-1">{balance.currency}</span>
          </div>
          <span className="text-xs text-muted-foreground mt-1">actuellement dans votre solde</span>
        </div>
        <div className="flex items-center justify-center  p-2 rounded-full">
          <Euro className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  )
}
