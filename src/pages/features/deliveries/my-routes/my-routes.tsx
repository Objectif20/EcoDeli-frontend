import { useEffect, useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { z } from "zod"
import { AddRouteDialog } from "@/components/features/deliveries/deliverman/add-routes"

const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

export const routeSchema = z
  .object({
    id: z.string(),
    from: z.string().min(1, "Le lieu de départ est requis"),
    to: z.string().min(1, "Le lieu d'arrivée est requis"),
    permanent: z.boolean(),
    coordinates: z.object({
      origin: z.tuple([z.number(), z.number()]),
      destination: z.tuple([z.number(), z.number()]),
    }),
    date: z.string().optional(),
    weekday: z.string().regex(/^[0-6]$/).optional(),
    tolerate_radius: z.number().min(0, "Le rayon doit être positif"),
    comeback_today_or_tomorrow: z.union([z.literal("today"), z.literal("tomorrow"), z.literal("later")]),
  })
  .refine(
    (data) => {
      if (data.permanent) {
        return data.weekday !== undefined
      } else {
        return !!data.date
      }
    },
    {
      message: "Un jour de la semaine est requis pour les trajets permanents, une date pour les trajets ponctuels",
      path: ["weekday"],
    },
  )

export type Route = z.infer<typeof routeSchema>

export default function MyRoutes() {
  const [routes, setRoutes] = useState<Route[]>([])

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await DeliverymanApi.getDeliverymanRoutes()
        setRoutes(data)
      } catch (error) {
        console.error("Erreur lors de la récupération des trajets:", error)
      }
    }

    fetchRoutes()
  }, [])


  const addRoute = async () => {
    try {
      const data = await DeliverymanApi.getDeliverymanRoutes()
      setRoutes(data)
    } catch (error) {
      console.error("Erreur lors de l'ajout du trajet:", error)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Gestion des Trajets</h1>
        <AddRouteDialog onAddRoute={addRoute}>
          <Button className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un trajet
          </Button>
        </AddRouteDialog>
      </div>

      <RoutesList routes={routes} />
    </main>
  )
}

"use client"

import { useMemo } from "react"
import { format, isPast, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { MapPin, Calendar, Repeat, ArrowRight, CornerDownRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DeliverymanApi } from "@/api/deliveryman.api"

interface RoutesListProps {
  routes: Route[]
}

export function RoutesList({ routes }: RoutesListProps) {
  const { activeRoutes, pastRoutes } = useMemo(() => {
    return routes.reduce(
      (acc, route) => {
        if (route.permanent) {
          acc.activeRoutes.push(route)
        } else if (route.date) {
          const routeDate = parseISO(route.date)
          if (isPast(routeDate)) {
            acc.pastRoutes.push(route)
          } else {
            acc.activeRoutes.push(route)
          }
        }
        return acc
      },
      { activeRoutes: [] as Route[], pastRoutes: [] as Route[] },
    )
  }, [routes])

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4 text-foreground">Trajets actifs et permanents</h2>
        <Accordion type="multiple" defaultValue={activeRoutes.map((route) => route.id)} className="space-y-4">
          {activeRoutes.map((route) => (
            <RouteAccordionItem key={route.id} route={route} />
          ))}
        </Accordion>
        {activeRoutes.length === 0 && (
          <Card className="bg-muted">
            <CardContent className="p-6 text-center text-muted-foreground">Aucun trajet actif ou permanent</CardContent>
          </Card>
        )}
      </section>

      {pastRoutes.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Trajets passés</h2>
          <Accordion type="multiple" className="space-y-4">
            {pastRoutes.map((route) => (
              <RouteAccordionItem key={route.id} route={route} disabled />
            ))}
          </Accordion>
        </section>
      )}
    </div>
  )
}

interface RouteAccordionItemProps {
  route: Route
  disabled?: boolean
}

function RouteAccordionItem({ route, disabled = false }: RouteAccordionItemProps) {
  const weekdayName = route.weekday !== undefined ? daysOfWeek[parseInt(route.weekday, 10)] : ""

  return (
    <AccordionItem value={route.id} className={`border rounded-lg ${disabled ? "opacity-60" : ""}`} disabled={disabled}>
      <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 rounded-t-lg">
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center space-x-2 font-medium">
              <span>{route.from}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span>{route.to}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {route.permanent ? (
              <Badge variant="outline" className="bg-accent text-accent-foreground">
                <Repeat className="h-3 w-3 mr-1" />
                Permanent
              </Badge>
            ) : route.date ? (
              <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                {format(parseISO(route.date), "dd MMM yyyy", { locale: fr })}
              </Badge>
            ) : null}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-4 py-3 bg-card">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Départ:</span>
                <span className="ml-2">{route.from}</span>
              </div>
              <div className="text-xs text-muted-foreground ml-6">
                Coordonnées: {route.coordinates.origin[0]}, {route.coordinates.origin[1]}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Arrivée:</span>
                <span className="ml-2">{route.to}</span>
              </div>
              <div className="text-xs text-muted-foreground ml-6">
                Coordonnées: {route.coordinates.destination[0]}, {route.coordinates.destination[1]}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              {route.permanent ? (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">Jour:</span>
                  <span className="ml-2">{weekdayName}</span>
                </div>
              ) : route.date ? (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{format(parseISO(route.date), "dd MMMM yyyy", { locale: fr })}</span>
                </div>
              ) : null}

              <div className="flex items-center text-sm">
                <span className="font-medium ml-6">Rayon de tolérance:</span>
                <span className="ml-2">{route.tolerate_radius} km</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <CornerDownRight className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Retour:</span>
                <span className="ml-2">{route.comeback_today_or_tomorrow === "today" ? "Le même jour" : "Le lendemain"}</span>
              </div>

              <div className="flex items-center text-sm">
                <Repeat className="h-4 w-4 mr-2 text-primary" />
                <span className="font-medium">Type:</span>
                <span className="ml-2">{route.permanent ? "Permanent" : "Ponctuel"}</span>
              </div>
            </div>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
