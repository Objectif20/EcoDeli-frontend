import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, HelpCircle } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { DeliveriesAPI } from "@/api/deliveries.api";

export type PriceChoiceFormValues = {
  price: string;
  deadline_date: string;
  shipmentName: string;
  isPriorityShipping: boolean;
  deliveryEmail: string;
};

export interface SubscriptionForClient {
  planName: string;
  discountRate?: number;
  priorityRate: number;
  insuranceLimit?: number | null;
  additionalInsuranceCost?: number | null;
  freeShipmentAvailable?: boolean;
  freePriorityShipmentsPerMonth?: number;
  freePriotiryShipmentsIfLower?: number;
  permanentDiscount?: number;
  hasUsedFreeShipment?: boolean;
  remainingPriorityShipments?: number;
}

export const PriceFormComponent = ({
  
}: {
  onFormSubmit: (data: PriceChoiceFormValues) => void;
}) => {
  const { control, watch } = useFormContext<PriceChoiceFormValues>();

  const price = Number.parseFloat(watch("price") || "0");
  const isPriorityShipping = watch("isPriorityShipping");
  const [subscriptionConfig, setSubscriptionConfig] = useState<SubscriptionForClient | null>(null);

  useEffect(() => {
    const fetchSubscriptionStat = async () => {
      try { 
        const data = await DeliveriesAPI.getSubscriptionStat();
        setSubscriptionConfig(data);
      } catch (error) {
        console.error("Failed to fetch subscription stats:", error);
      }
    };

    fetchSubscriptionStat();
  }, []);

  if (!subscriptionConfig) {
    return <div>Loading...</div>;
  }

  const priorityShippingFee = isPriorityShipping
    ? price * subscriptionConfig.priorityRate
    : 0;
  const ecoDeliFee = 5.0;
  const additionalInsuranceCost =
    subscriptionConfig.insuranceLimit != null && price > (subscriptionConfig.insuranceLimit ?? 0)
      ? subscriptionConfig.additionalInsuranceCost ?? 0
      : 0;

  const totalPrice =
    price +
    ecoDeliFee +
    priorityShippingFee +
    additionalInsuranceCost;

  const formatRangeToString = (range: DateRange | undefined): string => {
    if (!range || !range.from) return "";
    const fromDate = format(range.from, "yyyy-MM-dd");
    const toDate = range.to ? format(range.to, "yyyy-MM-dd") : fromDate;
    return `${fromDate}_${toDate}`;
  };

  const parseDateRange = (dateString: string): DateRange | undefined => {
    if (!dateString) return undefined;
    const [fromStr, toStr] = dateString.split("_");
    if (!fromStr) return undefined;
    const from = new Date(fromStr);
    const to = toStr ? new Date(toStr) : from;
    return { from, to };
  };

  const formatDateRange = (dateString: string): string => {
    const range = parseDateRange(dateString);
    if (!range || !range.from) return "";
    const fromFormatted = format(range.from, "PPP", { locale: fr });
    const toFormatted = range.to
      ? format(range.to, "PPP", { locale: fr })
      : "";
    return toFormatted && toFormatted !== fromFormatted
      ? `${fromFormatted} - ${toFormatted}`
      : fromFormatted;
  };

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
              <Input
                {...field}
                placeholder="Entrez le nom du réceptionneur"
                type="email"
              />
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
                      const formattedValue = formatRangeToString(range);
                      field.onChange(formattedValue);
                    } else {
                      field.onChange("");
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
            Abonnement : <strong>{subscriptionConfig.planName}</strong>
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
                      Ajoute {subscriptionConfig.priorityRate * 100}% au montant de l'envoi
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
            <div className="flex justify-between text-sm">
              <span className="flex items-center">
                Charge supplémentaire EcoDeli
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-center">
                        Cette charge correspond à la garantie EcoDeli pour
                        assurer votre expédition ainsi que les frais de transaction et de gestion. Cette charge ne s'applique qu'une fois par demande de livraison.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span>{ecoDeliFee.toFixed(2)} €</span>
            </div>

            {isPriorityShipping && priorityShippingFee > 0 && (
              <div className="flex justify-between text-sm">
                <span>Supplément envoi prioritaire</span>
                <span>{priorityShippingFee.toFixed(2)} €</span>
              </div>
            )}

            {subscriptionConfig.insuranceLimit !== null && (
              <div className="flex justify-between text-sm">
                <span>Assurance incluse</span>
                <span>Jusqu’à {subscriptionConfig.insuranceLimit} €</span>
              </div>
            )}

            {additionalInsuranceCost > 0 && (
              <div className="flex justify-between text-sm">
                <span>Assurance supplémentaire</span>
                <span>{additionalInsuranceCost.toFixed(2)} €</span>
              </div>
            )}

            <div className="flex justify-between font-medium text-base pt-2 border-t">
              <div className="flex items-center">
                <span>Prix total TTC</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-center">
                        Ce prix TTC est le prix théorique dans le cas où votre demande de livraison est réalisée en une seule fois. Dans le cas d'une livraison en plusieurs étapes, le prix pourra varier.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-primary font-bold">
                {totalPrice.toFixed(2)} €
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
