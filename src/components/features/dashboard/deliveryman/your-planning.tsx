"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"

export default function YourPlanning() {
  const [dateRange, setDateRange] = React.useState<Date | undefined>(undefined)

  const events = [
    { date: new Date(2025, 3, 25), label: "Event 1" },
    { date: new Date(2025, 3, 28), label: "Event 2" },
    { date: new Date(2025, 4, 30), label: "Event 3" },
  ]

  const handleDateSelect = (date: Date | undefined) => {
    setDateRange(date)
  }

  const isEventDay = (date: Date) => {
    return events.some((event) => format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Votre planning</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center h-full overflow-auto">
        <div>
          <Calendar
            selected={dateRange}
            onSelect={handleDateSelect}
            mode="single"
            locale={fr}
            today={new Date()}
            numberOfMonths={1}
            modifiers={{
              eventDay: (date) => isEventDay(date),
            }}
            modifiersClassNames={{
              eventDay:
                "relative after:absolute after:w-2 after:h-2 after:bg-primary after:rounded-full after:bottom-1 after:left-1/2 after:-translate-x-1/2",
            }}
            
          />
        </div>
      </CardContent>
    </Card>
  )
}
