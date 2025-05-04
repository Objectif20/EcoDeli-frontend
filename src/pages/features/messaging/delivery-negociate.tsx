"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import CityAsyncSelectDemo from "@/components/search-place"
import { DeliveriesAPI } from "@/api/deliveries.api"
import axios from "axios"
import { Switch } from "@/components/ui/switch"

interface DeliveryNegotiateProps {
  deliveryman_user_id: string
}

interface ShipmentDetails {
  id: string
  name: string
  price: number
  last_date: string
}

interface Warehouse {
  id: string
  name: string
}

interface ApiWarehouse {
  warehouse_id: string
  city: string
  coordinates: {
    type: string
    coordinates: [number, number]
  }
  photo: string
  description: string
}

interface City {
  value: string
  label: string
  lat: number
  lon: number
}

export default function DeliveryNegotiateDialog({
  deliveryman_user_id,
}: DeliveryNegotiateProps) {
  const [open, setOpen] = useState(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [locationType, setLocationType] = useState<"warehouse" | "custom">("warehouse")
  const [date, setDate] = useState<Date | undefined>()
  const [shipments, setShipments] = useState<ShipmentDetails[]>([])
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetails | null>(null)
  const [customAddressEnabled, setCustomAddressEnabled] = useState(false)

  const [formData, setFormData] = useState<{
    delivery_person_id: string
    price: number
    new_price: number
    warehouse_id?: string
    city?: string
    latitude?: number
    longitude?: number
    end_date: string
    isbox: boolean 
  }>({
    delivery_person_id: deliveryman_user_id,
    price: 0,
    new_price: 0,
    warehouse_id: "",
    city: "",
    latitude: 0,
    longitude: 0,
    end_date: "",
    isbox: false,
  })

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data: ApiWarehouse[] = await DeliveriesAPI.getWareHouse()
        setWarehouses(
          data.map((w) => ({
            id: w.warehouse_id,
            name: w.city,
          })),
        )
      } catch (error) {
        console.error("Erreur lors du chargement des entrepôts :", error)
      }
    }

    const fetchShipments = async () => {
      try {
        const data = await DeliveriesAPI.getMyCurrentShipments()
        setShipments(data.map((shipment) => ({
          id: shipment.shipment_id,
          name: shipment.description,
          price: shipment.estimated_total_price || 0,
          last_date: shipment.deadline_date || new Date().toISOString(),
        })))
        if (data.length > 0) {
          setSelectedShipment({
            id: data[0].shipment_id,
            name: data[0].description,
            price: data[0].estimated_total_price || 0,
            last_date: data[0].deadline_date || new Date().toISOString(),
          })
          setFormData((prev) => ({
            ...prev,
            new_price: data[0].estimated_total_price || 0,
          }))
        }
      } catch (error) {
        console.error("Erreur lors du chargement des livraisons :", error)
      }
    }

    fetchWarehouses()
    fetchShipments()
  }, [])

  const getCityNameFromCoordinates = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
      );
      const cityName = response.data.address.city || response.data.address.town || response.data.address.village;
      return cityName || "Unknown";
    } catch (error) {
      console.error("Error fetching city name from OpenStreetMap:", error);
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
      isbox : false
    }));
    console.log("Form data after warehouse selection:", formData);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        end_date: selectedDate.toISOString(),
      }))
    }
  }

  const handleSubmit = async () => {
    const submissionData = { ...formData }

    console.log('locationType', locationType)

    if (locationType === "warehouse") {
      delete submissionData.city
      delete submissionData.latitude
      delete submissionData.longitude
    } else if (locationType === "custom") {
      delete submissionData.warehouse_id
    }

    submissionData.price = Number(submissionData.price)
    submissionData.new_price = Number(submissionData.new_price)

    try {
      await DeliveriesAPI.createPartialDelivery(submissionData, selectedShipment?.id || "")
    } catch (error) {
      console.error("Erreur lors de la soumission des données :", error)
    }

    console.log("Form data submitted:", submissionData)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Négocier la livraison</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Négocier la livraison</DialogTitle>
          <DialogDescription>Proposez de nouvelles conditions pour cette livraison</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">Sélection de la livraison</h3>
            <div className="space-y-2">
              <Label htmlFor="shipment">Livraison</Label>
              <Select
                onValueChange={(shipmentId) => {
                  const selected = shipments.find((s) => s.id === shipmentId)
                  if (selected) {
                    setFormData((prev) => ({
                      ...prev,
                      price: selected.price,
                    }))
                    setSelectedShipment(selected)
                  }
                }}
                defaultValue={shipments.length > 0 ? shipments[0].id : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une livraison" />
                </SelectTrigger>
                <SelectContent>
                  {shipments.map((shipment) => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      {shipment.name} - {new Date(shipment.last_date).toLocaleDateString("fr-FR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4">
            <h3 className="text-sm font-medium">Informations de prix</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="space-y-2">
                  <Label htmlFor="new_price">Modifier le prix pour le reste de la demande de livraison</Label>
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
                <Label htmlFor="price">Prix pour une livraison négociée avec ce transporteur</Label>
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
            <h3 className="text-sm font-medium">Destination</h3>
            <Tabs
              defaultValue="warehouse"
              onValueChange={(value) => setLocationType(value as "warehouse" | "custom")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="warehouse">Entrepôt</TabsTrigger>
                <TabsTrigger value="custom">Adresse personnalisée</TabsTrigger>
              </TabsList>
              <TabsContent value="warehouse" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Sélectionner un entrepôt</Label>
                  <Select onValueChange={handleWarehouseChange} value={formData.warehouse_id}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un entrepôt" />
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
                  <Label>Rechercher une adresse</Label>
                  <CityAsyncSelectDemo
                    onCitySelect={handleCitySelect}
                    placeholder="Rechercher une ville ou une adresse"
                    labelValue={selectedCity?.label || ""}
                  />
                  {selectedCity && (
                    <div className="mt-2 text-sm">
                      Coordonnées : {selectedCity.lat.toFixed(6)}, {selectedCity.lon.toFixed(6)}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="isbox" className="">S'agit-il d'un box ?</Label>
                  <Switch
                    id="isbox"
                    checked={customAddressEnabled}
                    onCheckedChange={() => {
                      setCustomAddressEnabled(!customAddressEnabled)
                      setFormData((prev) => ({
                        ...prev,
                        isbox: !customAddressEnabled,
                      }))
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Date section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">Date de fin</h3>
            <div className="space-y-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    initialFocus
                    locale={fr}
                    disabled={(d) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)

                      if (d < today) return true

                      if (selectedShipment?.last_date) {
                        const last = new Date(selectedShipment.last_date)
                        last.setHours(0, 0, 0, 0)
                        return d < last
                      }

                      return false
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Soumettre la proposition
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
