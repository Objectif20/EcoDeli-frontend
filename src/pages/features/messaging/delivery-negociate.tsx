import { useEffect, useState } from "react";
import { Calendar, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import CityAsyncSelectDemo from "@/components/search-place";
import { DeliveriesAPI } from "@/api/deliveries.api";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DateRange } from "react-day-picker";

interface DeliveryNegotiateProps {
  deliveryman_user_id: string;
}

interface ShipmentDetails {
  id: string;
  name: string;
  price: number;
  last_date: string;
  startDeliveryDate: string;
  endDeliveryDate: string;
}

interface Warehouse {
  id: string;
  name: string;
}

interface ApiWarehouse {
  warehouse_id: string;
  city: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  photo: string;
  description: string;
}

interface City {
  value: string;
  label: string;
  lat: number;
  lon: number;
}

export default function DeliveryNegotiateDialog({
  deliveryman_user_id,
}: DeliveryNegotiateProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [locationType, setLocationType] = useState<"warehouse" | "custom">(
    "warehouse"
  );
  const [selectedDateRange, setSelectedDateRange] = useState<
    DateRange | undefined
  >();
  const [shipments, setShipments] = useState<ShipmentDetails[]>([]);
  const [selectedShipment, setSelectedShipment] =
    useState<ShipmentDetails | null>(null);
  const [customAddressEnabled, setCustomAddressEnabled] = useState(false);

  const [formData, setFormData] = useState<{
    delivery_person_id: string;
    price: number;
    new_price: number;
    warehouse_id?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    startDate?: string;
    endDate?: string;
    isbox: boolean;
  }>({
    delivery_person_id: deliveryman_user_id,
    price: 0,
    new_price: 0,
    warehouse_id: "",
    city: "",
    latitude: 0,
    longitude: 0,
    startDate: "",
    endDate: "",
    isbox: false,
  });

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data: ApiWarehouse[] = await DeliveriesAPI.getWareHouse();
        setWarehouses(
          data.map((w) => ({
            id: w.warehouse_id,
            name: w.city,
          }))
        );
      } catch (error) {
        console.error(
          t("client.pages.office.chat-negotiation.errorLoadingWarehouses"),
          error
        );
      }
    };

    const fetchShipments = async () => {
      try {
        const data = await DeliveriesAPI.getMyCurrentShipments();
        setShipments(
          data.map((shipment) => ({
            id: shipment.shipment_id,
            name: shipment.description,
            price: shipment.estimated_total_price || 0,
            last_date: shipment.deadline_date || new Date().toISOString(),
            startDeliveryDate: shipment?.startDeliveryDate || "",
            endDeliveryDate: shipment?.endDeliveryDate || "",
          }))
        );
        if (data.length > 0) {
          setSelectedShipment({
            id: data[0].shipment_id,
            name: data[0].description,
            price: data[0].estimated_total_price || 0,
            last_date: data[0].deadline_date || new Date().toISOString(),
            startDeliveryDate: data[0].startDeliveryDate || "",
            endDeliveryDate: data[0].endDeliveryDate || "",
          });
          setFormData((prev) => ({
            ...prev,
            new_price: data[0].estimated_total_price || 0,
          }));
        }
      } catch (error) {
        console.error(
          t("client.pages.office.chat-negotiation.errorLoadingDeliveries"),
          error
        );
      }
    };

    fetchWarehouses();
    fetchShipments();
  }, [t]);

  const getCityNameFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const cityName =
        response.data.address.city ||
        response.data.address.town ||
        response.data.address.village;
      return cityName || "Unknown";
    } catch (error) {
      console.error(
        t("client.pages.office.chat-negotiation.errorFetchingCityName"),
        error
      );
      return "Unknown";
    }
  };

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city);

    const cityName = await getCityNameFromCoordinates(city.lat, city.lon);

    setFormData((prev) => ({
      ...prev,
      city: cityName,
      latitude: city.lat,
      longitude: city.lon,
      warehouse_id: "",
    }));
  };

  const handleWarehouseChange = (warehouseId: string) => {
    console.log("Warehouse selected:", warehouseId);
    setFormData((prev) => ({
      ...prev,
      warehouse_id: warehouseId,
      city: "",
      latitude: 0,
      longitude: 0,
      isbox: false,
    }));
    console.log("Form data after warehouse selection:", formData);
  };

  const handleDateRangeSelect = (range: DateRange | undefined) => {
    setSelectedDateRange(range);
    if (range?.from && range?.to) {
      setFormData((prev) => ({
        ...prev,
        startDate: range.from!.toISOString(),
        endDate: range.to!.toISOString(),
      }));
    }
  };

  const handleSubmit = async () => {
    const submissionData = { ...formData };

    console.log("locationType", locationType);

    if (locationType === "warehouse") {
      delete submissionData.city;
      delete submissionData.latitude;
      delete submissionData.longitude;
    } else if (locationType === "custom") {
      delete submissionData.warehouse_id;
    }

    submissionData.price = Number(submissionData.price);
    submissionData.new_price = Number(submissionData.new_price);

    try {
      await DeliveriesAPI.createPartialDelivery(
        submissionData,
        selectedShipment?.id || ""
      );
    } catch (error) {
      console.error(
        t("client.pages.office.chat-negotiation.errorSubmittingData"),
        error
      );
    }

    console.log("Form data submitted:", submissionData);
    setOpen(false);
  };

  // Calculer les dates min et max pour le shipment sélectionné
  const minDate = selectedShipment
    ? new Date(selectedShipment.startDeliveryDate)
    : new Date();
  const maxDate = selectedShipment
    ? new Date(selectedShipment.endDeliveryDate)
    : new Date();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {t("client.pages.office.chat-negotiation.negotiateDelivery")}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("client.pages.office.chat-negotiation.negotiateDelivery")}
          </DialogTitle>
          <DialogDescription>
            {t("client.pages.office.chat-negotiation.proposeNewConditions")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">
              {t("client.pages.office.chat-negotiation.selectDelivery")}
            </h3>
            <div className="space-y-2">
              <Label htmlFor="shipment">
                {t("client.pages.office.chat-negotiation.delivery")}
              </Label>
              <Select
                onValueChange={(shipmentId) => {
                  const selected = shipments.find((s) => s.id === shipmentId);
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      price: selected.price,
                      new_price: selected.price,
                    }));
                    setSelectedShipment(selected);
                    // Réinitialiser la plage de dates lors du changement de shipment
                    setSelectedDateRange(undefined);
                  }
                }}
                defaultValue={
                  shipments.length > 0 ? shipments[0].id : undefined
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t(
                      "client.pages.office.chat-negotiation.selectDeliveryPlaceholder"
                    )}
                  />
                </SelectTrigger>
                <SelectContent>
                  {shipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      {shipment.name} -{" "}
                      {new Date(shipment.last_date).toLocaleDateString("fr-FR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-sm font-medium">
              {t("client.pages.office.chat-negotiation.priceInformation")}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="new_price">
                    {t("client.pages.office.chat-negotiation.modifyPrice")}
                  </Label>
                  <Input
                    id="new_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.new_price}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        new_price: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">
                  {t("client.pages.office.chat-negotiation.negotiatedPrice")}
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: Number.parseFloat(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-sm font-medium">
              {t("client.pages.office.chat-negotiation.destination")}
            </h3>
            <Tabs
              defaultValue="warehouse"
              onValueChange={(value) =>
                setLocationType(value as "warehouse" | "custom")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="warehouse">
                  {t("client.pages.office.chat-negotiation.warehouse")}
                </TabsTrigger>
                <TabsTrigger value="custom">
                  {t("client.pages.office.chat-negotiation.customAddress")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="warehouse" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouse">
                    {t("client.pages.office.chat-negotiation.selectWarehouse")}
                  </Label>
                  <Select
                    onValueChange={handleWarehouseChange}
                    value={formData.warehouse_id}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          "client.pages.office.chat-negotiation.selectWarehousePlaceholder"
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              <TabsContent value="custom" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>
                    {t("client.pages.office.chat-negotiation.searchAddress")}
                  </Label>
                  <CityAsyncSelectDemo
                    onCitySelect={handleCitySelect}
                    placeholder={t(
                      "client.pages.office.chat-negotiation.searchAddressPlaceholder"
                    )}
                    labelValue={selectedCity?.label || ""}
                    width="100%"
                  />
                  {selectedCity && (
                    <div className="mt-2 text-sm">
                      {t("client.pages.office.chat-negotiation.coordinates")} :{" "}
                      {selectedCity.lat.toFixed(6)},{" "}
                      {selectedCity.lon.toFixed(6)}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="isbox" className="">
                    {t("client.pages.office.chat-negotiation.isBox")}
                  </Label>
                  <Switch
                    id="isbox"
                    checked={customAddressEnabled}
                    onCheckedChange={() => {
                      setCustomAddressEnabled(!customAddressEnabled);
                      setFormData((prev) => ({
                        ...prev,
                        isbox: !customAddressEnabled,
                      }));
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Date Range section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">
              {t("client.pages.office.chat-negotiation.deliveryPeriod")}
            </h3>

            {selectedShipment && (
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>Période disponible :</span>
                </div>
                <div className="pl-6">
                  Du {format(minDate, "dd MMMM yyyy", { locale: fr })} au{" "}
                  {format(maxDate, "dd MMMM yyyy", { locale: fr })}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDateRange && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDateRange?.from ? (
                      selectedDateRange.to ? (
                        <>
                          {format(selectedDateRange.from, "dd MMM yyyy", {
                            locale: fr,
                          })}{" "}
                          -{" "}
                          {format(selectedDateRange.to, "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </>
                      ) : (
                        format(selectedDateRange.from, "dd MMM yyyy", {
                          locale: fr,
                        })
                      )
                    ) : (
                      t("client.pages.office.chat-negotiation.selectDateRange")
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="rounded-md border">
                    <div className="flex justify-center">
                      <CalendarComponent
                        mode="range"
                        selected={selectedDateRange}
                        onSelect={handleDateRangeSelect}
                        disabled={(date) => {
                          if (!selectedShipment) return true;
                          return date < minDate || date > maxDate;
                        }}
                        locale={fr}
                        className="p-2"
                      />
                    </div>

                    {selectedDateRange?.from && selectedDateRange?.to && (
                      <div className="border-t p-3">
                        <div className="text-sm bg-muted p-3 rounded-lg">
                          <strong>Période sélectionnée :</strong>
                          <br />
                          Du{" "}
                          {format(selectedDateRange.from, "dd MMMM yyyy", {
                            locale: fr,
                          })}{" "}
                          au{" "}
                          {format(selectedDateRange.to, "dd MMMM yyyy", {
                            locale: fr,
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {t("client.pages.office.chat-negotiation.submitProposal")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
