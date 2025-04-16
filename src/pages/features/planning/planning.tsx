"use client"

import { useEffect, useState } from "react"
import {
  EventCalendar,
  type CalendarEvent,
} from "@/components/event-calendar"
import { SidebarRight } from "@/components/features/planning/sidebar/sidebar-right"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { ProfileAPI } from "@/api/profile.api"
import { getRandomColor } from "@/utils/random-color"



export default function PlanningPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [initialDate, setInitialDate] = useState(new Date())
  const dispatch = useDispatch()

  const getEvents = async () => {
    try {
      const data = await ProfileAPI.getMyPlanning();

      const eventsWithColor = data.map(event => ({
        ...event,
        color: event.color || getRandomColor()
      }));

      setEvents(eventsWithColor);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    getEvents();
  }, []);


  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Mon planning"],
        links: ["/office/dashboard"],
      }),
    )
  }, [dispatch])

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event])
  }

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(
      events.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    )
  }

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  const handleDateChange = (newDate: Date | undefined) => {
    setInitialDate(newDate ?? new Date())
  }

  const handleMonthChange = (newMonth: Date | undefined) => {
    setInitialDate(newMonth ?? new Date())
  }

  return (
    <div className="flex border rounded-lg">
      <div className="flex-1 overflow-auto">
        <EventCalendar
          events={events}
          onEventAdd={handleEventAdd}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
          initialDate={initialDate}
        />
      </div>
      <SidebarRight
        className="hidden lg:block rounded-lg"
        style={{ width: "17rem" }}
        onDateChange={handleDateChange}
        onMonthChange={handleMonthChange}
      />
    </div>
  )
}
