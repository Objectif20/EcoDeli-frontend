"use client"

import { useFormContext } from "react-hook-form"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, HelpCircle } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export type PriceChoiceFormValues = {
  price: string
  deadline_date: string
  shipmentName: string
  isPriorityShipping: boolean
  deliveryEmail: string
}

export const PriceFormComponent = ({
  
}: {
  onFormSubmit: (data: PriceChoiceFormValues) => void
}) => {
  const { control, watch } = useFormContext<PriceChoiceFormValues>()

  const price = Number.parseFloat(watch("price") || "0")
  const isPriorityShipping = watch("isPriorityShipping")

  const userSubscription = {
    plan: "Premium", 
    hasUsedFreeShipment: true,
  }

  const subscriptionConfig = {
    Free: {
      discountRate: 0.0,
      priorityRate: 0.15,
      insuranceLimit: 115,
      freeShipmentAvailable: false,
    },
    Starter: {
      discountRate: 0.05,
      priorityRate: 0.05,
      insuranceLimit: 115,
      freeShipmentAvailable: !userSubscription.hasUsedFreeShipment,
    },
    Premium: {
      discountRate: 0.09,
      priorityRate: 0.05,
      insuranceLimit: 3000,
      freeShipmentAvailable: !userSubscription.hasUsedFreeShipment,
    },
  }[userSubscription.plan]

  const discountAmount = price * (subscriptionConfig?.priorityRate ?? 0)
  const priorityShippingFee = isPriorityShipping
    ? price * (subscriptionConfig?.priorityRate ?? 0)
    : 0
  const hasFreeShipment = (subscriptionConfig?.priorityRate ?? 0) && price <= 150
  const handlingFee = hasFreeShipment ? 0 : price > 0 ? 29.0 : 0
  const deliveryFee = hasFreeShipment ? 0 : 15.0
  const ecoDeliFee = 5.0

  const totalPrice =
    price - discountAmount +
    (hasFreeShipment ? 0 : handlingFee + deliveryFee) +
    ecoDeliFee +
    priorityShippingFee

  const formatRangeToString = (range: DateRange | undefined): string => {
    if (!range || !range.from) return ""
    const fromDate = format(range.from, "yyyy-MM-dd")
    const toDate = range.to ? format(range.to, "yyyy-MM-dd") : fromDate
    return `${fromDate}_${toDate}`
  }

  const parseDateRange = (dateString: string): DateRange | undefined => {
    if (!dateString) return undefined
    const [fromStr, toStr] = dateString.split("_")
    if (!fromStr) return undefined
    const from = new Date(fromStr)
    const to = toStr ? new Date(toStr) : from
    return { from, to }
  }

  const formatDateRange = (dateString: string): string => {
    const range = parseDateRange(dateString)
    if (!range || !range.from) return ""
    const fromFormatted = format(range.from, "PPP", { locale: fr })
    const toFormatted = range.to
      ? format(range.to, "PPP", { locale: fr })
      : ""
    return toFormatted && toFormatted !== fromFormatted
      ? `${fromFormatted} - ${toFormatted}`
      : fromFormatted
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-lg font-medium">
        Il ne vous reste plus que quelques infos à fournir.
      </div>

      <FormField
        control={control}
        name="shipmentName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom de l'expédition</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Entrez le nom de l'expédition" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="deliveryEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email du réceptionneur final</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Entrez le nom du réceptionneur" type="email" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="deadline_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Période</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      formatDateRange(field.value)
                    ) : (
                      <span>Choisissez une période</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={parseDateRange(field.value)}
                  onSelect={(range) => {
                    if (range?.from) {
                      const formattedValue = formatRangeToString(range)
                      field.onChange(formattedValue)
                    } else {
                      field.onChange("")
                    }
                  }}
                  numberOfMonths={2}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <Card>
        <CardHeader>
          <CardTitle>Proposition tarifaire</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Choisissez un prix</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      className="peer ps-6 pe-12"
                      placeholder="0.00"
                      type="number"
                      step="0.01"
                      min="0"
                      max="1000000"
                    />
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
                      €
                    </span>
                    <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
                      EUR
                    </span>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-2 text-sm text-muted-foreground">
            Abonnement : <strong>{userSubscription.plan}</strong> —{" "}
            {(subscriptionConfig?.priorityRate ?? 0)* 100}% de réduction
            {hasFreeShipment && (
              <>
                <br />
                <strong>Premier envoi offert !</strong>
              </>
            )}
          </div>

          {price > 0 && (
            <div className="text-sm text-muted-foreground mt-2">
              Le prix généralement proposé est compris entre 41 € et 52 €.
              <br />
              Votre prix est dans la moyenne.
            </div>
          )}

          <div className="mt-4">
            <FormField
              control={control}
              name="isPriorityShipping"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Envoi prioritaire</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Ajoute {(subscriptionConfig?.priorityRate ?? 0) * 100}% au montant
                      de l'envoi
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full space-y-2">
            {!hasFreeShipment && (
              <>
                <div className="flex justify-between text-sm">
                  <span>Livraison</span>
                  <span>{deliveryFee.toFixed(2)} €</span>
                </div>
                {handlingFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Manutention</span>
                    <span>{handlingFee.toFixed(2)} €</span>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                Charge supplémentaire EcoDeli
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Cette charge correspond à la garantie EcoDeli pour
                        assurer votre expédition.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span>{ecoDeliFee.toFixed(2)} €</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-sm text-green-700">
                <span>Réduction abonnement</span>
                <span>-{discountAmount.toFixed(2)} €</span>
              </div>
            )}

            {isPriorityShipping && (
              <div className="flex justify-between text-sm">
                <span>Supplément envoi prioritaire</span>
                <span>{priorityShippingFee.toFixed(2)} €</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span>Assurance incluse</span>
              <span>Jusqu’à {subscriptionConfig?.insuranceLimit ?? 0} €</span>
            </div>

            <div className="flex justify-between font-medium text-base pt-2 border-t">
              <span>Prix total TTC</span>
              <span className="text-primary font-bold">
                {totalPrice.toFixed(2)} €
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
