"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
  { size: "S", packages: 275, fill: "var(--color-S)" },
  { size: "M", packages: 200, fill: "var(--color-M)" },
  { size: "L", packages: 287, fill: "var(--color-L)" },
  { size: "XL", packages: 173, fill: "var(--color-XL)" },
  { size: "XXL", packages: 190, fill: "var(--color-XXL)" },
]

const chartConfig = {
  packages: {
    label: "Packages",
  },
  S: {
    label: "S",
    color: "hsl(var(--chart-1))",
  },
  M: {
    label: "M",
    color: "hsl(var(--chart-2))",
  },
  L: {
    label: "L",
    color: "hsl(var(--chart-3))",
  },
  XL: {
    label: "XL",
    color: "hsl(var(--chart-4))",
  },
  XXL: {
    label: "XXL",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function PackageStats() {
  const totalPackages = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.packages, 0)
  }, [])

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Graphique en anneau - Colis envoyés</CardTitle>
        <CardDescription>Janvier - Juin 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="packages"
              nameKey="size"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalPackages.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Colis
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          En hausse de 5.2% ce mois-ci <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Affichage du nombre total de colis envoyés pour les 6 derniers mois
        </div>
      </CardFooter>
    </Card>
  )
}
