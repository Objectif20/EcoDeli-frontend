"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", co2Saved: 150 },
  { month: "February", co2Saved: 200 },
  { month: "March", co2Saved: 180 },
  { month: "April", co2Saved: 220 },
  { month: "May", co2Saved: 210 },
  { month: "June", co2Saved: 230 },
]

const chartConfig = {
  co2Saved: {
    label: "CO2 Évité (kg)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function Co2Chart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Graphique de CO2 Évité</CardTitle>
        <CardDescription>Janvier - Juin 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="co2Saved"
              type="natural"
              stroke="var(--color-co2Saved)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-co2Saved)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          En hausse de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage des kg de CO2 évités pour les 6 derniers mois
        </div>
      </CardFooter>
    </Card>
  )
}
