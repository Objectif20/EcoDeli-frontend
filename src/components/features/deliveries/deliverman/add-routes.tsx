"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { fr } from "date-fns/locale"
import { DeliverymanApi, RoutePostDto } from "@/api/deliveryman.api"

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
    weekday: z.string().optional(),
    tolerate_radius: z.number().min(0, "Le rayon doit être positif"),
    comeback_today_or_tomorrow: z.union([z.literal("today"), z.literal("tomorrow"), z.literal("later")]),
  })
  .refine(
    (data) => {
      if (data.permanent) {
        return !!data.weekday
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

interface AddRouteDialogProps {
  children: React.ReactNode
  onAddRoute: (route: Route) => void
}

export function AddRouteDialog({ children, onAddRoute }: AddRouteDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<Route>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      id: "",
      from: "",
      to: "",
      permanent: false,
      coordinates: {
        origin: [0, 0],
        destination: [0, 0],
      },
      tolerate_radius: 5,
      comeback_today_or_tomorrow: "tomorrow",
    },
  })

  const isPermanent = form.watch("permanent")

  async function onSubmit(data: Route) {
    const newRoute: RoutePostDto = {
      ...data,
      weekday: isPermanent ? String(weekdays.indexOf(data.weekday!)) : undefined,
    }
  
    try {
      const addedRoute = await DeliverymanApi.addDeliverymanRoute(newRoute)
      onAddRoute(addedRoute)
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Erreur lors de l'ajout du trajet:", error)
    }
  }

  const weekdays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau trajet</DialogTitle>
          <DialogDescription>Remplissez les informations pour créer un nouveau trajet.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Départ</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville de départ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrivée</FormLabel>
                    <FormControl>
                      <Input placeholder="Ville d'arrivée" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="permanent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Trajet permanent</FormLabel>
                    <FormDescription>
                      Cochez cette case si ce trajet est récurrent (ex: tous les lundis).
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {isPermanent ? (
              <FormField
                control={form.control}
                name="weekday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jour de la semaine</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un jour" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {weekdays.map((day, index) => (
                          <SelectItem key={index} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date du trajet</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP", { locale: fr })
                            ) : (
                              <span>Choisissez une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) => {
                            field.onChange(date?.toISOString())
                          }}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="tolerate_radius"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rayon de tolérance (km)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      {...field}
                      onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Distance maximale acceptable par rapport au point de départ/arrivée.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comeback_today_or_tomorrow"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Retour</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => field.onChange(value)}
                      defaultValue={field.value ? field.value.toString() : "tomorrow"}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="today" />
                        </FormControl>
                        <FormLabel className="font-normal">Retour le même jour</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="tomorrow" />
                        </FormControl>
                        <FormLabel className="font-normal">Retour le lendemain</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="later" />
                        </FormControl>
                        <FormLabel className="font-normal">Retour plus tard</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Ajouter le trajet
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
