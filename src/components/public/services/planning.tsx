import { format, isBefore, isSameDay, parseISO, addMinutes, startOfDay } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const providerData = [
  {
    id: "62284293-7bbb-4467-9b89-2519301e1155",
    day_of_week: 0, // Lundi
    morning: true,
    afternoon: true,
    evening: false,
    morning_start_time: "08:00:00",
    morning_end_time: "12:00:00",
    afternoon_start_time: "14:00:00",
    afternoon_end_time: "18:00:00",
    evening_start_time: null,
    evening_end_time: null,
  },
  {
    id: "8a7ded02-638c-4690-9f5f-7a20e0495c13",
    day_of_week: 6, // Dimanche
    morning: true,
    afternoon: true,
    evening: true,
    morning_start_time: "09:00:00",
    morning_end_time: "12:00:00",
    afternoon_start_time: "13:00:00",
    afternoon_end_time: "17:00:00",
    evening_start_time: "18:00:00",
    evening_end_time: "21:00:00",
  },
]

const appointmentsData = [
  {
    date: "2025-04-2",
    time: "09:00",
    end: "09:30",
  },
  {
    date: "2023-10-01",
    time: "10:00",
    end: "10:30",
  },
  {
    date: "2023-10-01",
    time: "11:00",
    end: "11:30",
  },
  {
    date: "2023-10-01",
    time: "12:00",
    end: "12:30",
  },
]

const mapToJSWeekday = (day: number) => (day + 1) % 7

const timeStringToDate = (baseDate: Date, time: string) => {
  const [hour, minute] = time.split(":")
  const date = new Date(baseDate)
  date.setHours(Number(hour), Number(minute), 0, 0)
  return date
}

const generateSlots = (start: Date, end: Date, duration: number) => {
  const slots = []
  let current = new Date(start)
  while (addMinutes(current, duration) <= end) {
    slots.push(current)
    current = addMinutes(current, duration)
  }
  return slots
}

type TakeAppointmentProps = {
  duration: number
  service_id: string
}

export default function TakeAppointment({ duration, service_id }: TakeAppointmentProps) {
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState<Date | null>(null)

  const disabledDays = (day: Date) => {
    const jsDay = day.getDay()
    const isPast = isBefore(day, startOfDay(new Date()))
    const provider = providerData.find(p => mapToJSWeekday(p.day_of_week) === jsDay)

    if (!provider || isPast) return true

    const slots = computeAvailableSlots(day, provider, duration)
    return slots.length === 0
  }

  const computeAvailableSlots = (selectedDate: Date, provider: any, duration: number) => {
    const allSlots: Date[] = []

    const addSlots = (start: string, end: string | null) => {
      if (!start || !end) return
      const from = timeStringToDate(selectedDate, start)
      const to = timeStringToDate(selectedDate, end)
      allSlots.push(...generateSlots(from, to, duration))
    }

    if (provider.morning) addSlots(provider.morning_start_time, provider.morning_end_time)
    if (provider.afternoon) addSlots(provider.afternoon_start_time, provider.afternoon_end_time)
    if (provider.evening) addSlots(provider.evening_start_time, provider.evening_end_time)

    const dayAppointments = appointmentsData
      .filter(app => isSameDay(parseISO(app.date), selectedDate))
      .map(app => ({
        start: timeStringToDate(selectedDate, app.time),
        end: timeStringToDate(selectedDate, app.end),
      }))

    return allSlots.filter(slot => {
      const end = addMinutes(slot, duration)
      return !dayAppointments.some(app =>
        (slot >= app.start && slot < app.end) ||
        (end > app.start && end <= app.end) ||
        (slot <= app.start && end >= app.end)
      )
    })
  }

  const selectedProvider = date
    ? providerData.find(p => mapToJSWeekday(p.day_of_week) === date.getDay())
    : null

  const availableSlots = date && selectedProvider
    ? computeAvailableSlots(date, selectedProvider, duration)
    : []

  const handleReservation = () => {
    if (date && time) {
      console.log("Date:", format(date, "yyyy-MM-dd"))
      console.log("Heure:", format(time, "HH:mm"))
      console.log("ID du service:", service_id)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full font-medium py-2">Prendre un rendez-vous</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Prendre un rendez-vous</DialogTitle>
          <DialogDescription>
            Choisissez une date et un créneau horaire
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={disabledDays}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          <div className="grid grid-cols-3 gap-2 px-2">
            {availableSlots.map(slot => (
              <Button
                key={slot.toISOString()}
                variant={time?.getTime() === slot.getTime() ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => setTime(slot)}
              >
                {format(slot, "HH:mm")}
              </Button>
            ))}
            {availableSlots.length === 0 && (
              <p className="col-span-3 text-center text-sm text-muted-foreground">
                Aucun créneau disponible
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleReservation} disabled={!date || !time}>Réserver</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
