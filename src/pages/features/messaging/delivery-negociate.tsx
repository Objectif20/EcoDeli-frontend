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

interface DeliveryNegotiateProps {
  deliveryman_user_id: string
  shipments?: ShipmentDetails[]
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
  shipments = [],
}: DeliveryNegotiateProps) {
  const [open, setOpen] = useState(false)
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [locationType, setLocationType] = useState<"warehouse" | "custom">("warehouse")
  const [date, setDate] = useState<Date | undefined>()
  const [selectedShipment, setSelectedShipment] = useState<ShipmentDetails | null>(
    shipments.length > 0 ? shipments[0] : null,
  )

  const [formData, setFormData] = useState<{
    delivery_person_id: string
    price: number
    new_price: number
    warehouse_id?: string
    city?: string
    latitude?: number
    longitude?: number
    end_date: string
  }>({
    delivery_person_id: deliveryman_user_id,
    price: shipments.length > 0 ? shipments[0].price : 0,
    new_price: 0,
    warehouse_id: "",
    city: "",
    latitude: 0,
    longitude: 0,
    end_date: "",
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

    fetchWarehouses()
  }, [])

  const handleCitySelect = (city: City) => {
    setSelectedCity(city)
    setFormData({
      ...formData,
      city: city.label,
      latitude: city.lat,
      longitude: city.lon,
      warehouse_id: "",
    })
  }

  const handleWarehouseChange = (warehouseId: string) => {
    setFormData({
      ...formData,
      warehouse_id: warehouseId,
      city: "",
      latitude: 0,
      longitude: 0,
    })
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      setFormData({
        ...formData,
        end_date: selectedDate.toISOString(),
      })
    }
  }

  const handleSubmit = () => {
    const submissionData = { ...formData }

    if (locationType === "warehouse") {
      delete submissionData.city
      delete submissionData.latitude
      delete submissionData.longitude
    } else if (locationType === "custom") {
      delete submissionData.warehouse_id
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
          {/* Shipment selection */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">Sélection de la livraison</h3>
            <div className="space-y-2">
              <Label htmlFor="shipment">Livraison</Label>
              <Select
                onValueChange={(shipmentId) => {
                  const selected = shipments.find((s) => s.id === shipmentId)
                  if (selected) {
                    setFormData({
                      ...formData,
                      price: selected.price,
                    })
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

          {/* Price section */}
          <div className="grid gap-4">
            <h3 className="text-sm font-medium">Informations de prix</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prix actuel (€)</Label>
                <Input id="price" value={formData.price} readOnly className="bg-gray-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_price">Nouveau prix (€)</Label>
                <Input
                  id="new_price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.new_price || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      new_price: Number.parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Location section */}
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
                    <div className="mt-2 text-sm text-gray-500">
                      Coordonnées : {selectedCity.lat.toFixed(6)}, {selectedCity.lon.toFixed(6)}
                    </div>
                  )}
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
