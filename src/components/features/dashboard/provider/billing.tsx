"use client"

import { TrendingUp } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Janvier", particuliers: 250 },
  { month: "Février", particuliers: 380 },
  { month: "Mars", particuliers: 300 },
  { month: "Avril", particuliers: 200 },
  { month: "Mai", particuliers: 280 },
  { month: "Juin", particuliers: 320 },
]

const chartConfig = {
  particuliers: {
    label: "Particuliers",
    color: "hsl(var(--chart-1))",
  }
} satisfies ChartConfig


export default function MonthlyRevenue() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Vos revenus mensuels</CardTitle>
        <CardDescription>Revenus des clients particuliers et commerçants</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
      <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={revenueData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="particuliers" fill="var(--color-particuliers)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          En hausse de 8.3% ce mois-ci <TrendingUp className="h-4 w-4 text-primary" />
        </div>
        <div className="leading-none text-muted-foreground">Affichage des revenus totaux pour les 6 derniers mois</div>
      </CardFooter>
    </Card>
  )
}
