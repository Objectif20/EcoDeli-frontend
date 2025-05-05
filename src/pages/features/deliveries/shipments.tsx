"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Package } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import { DeliveriesAPI, ShipmentListItem } from "@/api/deliveries.api"

const formatDate = (dateString: string) => {
  // Ensure the date string is parsed correctly
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Date invalide" : format(date, "d MMM yyyy", { locale: fr });
}

const StatusBadge = ({ status, finished }: { status: string; finished: boolean }) => {
  if (finished) {
    return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminée</Badge>
  }

  switch (status) {
    case "pending":
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">En attente</Badge>
    case "In Progress":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">En cours</Badge>
    default:
      return <Badge>{status}</Badge>
  }
}

export default function ShipmentsListPage() {
  const [shipments, setShipments] = useState<ShipmentListItem[]>([])
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Demandes de livraison"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const data = await DeliveriesAPI.getMyCurrentShipmentsOffice();
        setShipments(data)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors de la récupération des livraisons:", error)
        setLoading(false)
      }
    }

    fetchShipments()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Demandes de livraison</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/50 p-4 flex justify-between">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Demandes de livraison</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shipments.map((shipment) => (
          <Card key={shipment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold text-lg line-clamp-1">{shipment.name}</h2>
                  {shipment.urgent && (
                    <Badge variant="destructive" className="ml-2">
                      URGENT
                    </Badge>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">De: {shipment.departure.city}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(shipment.departure_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">À: {shipment.arrival.city}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(shipment.arrival_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm">{shipment.packageCount} colis</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span>{shipment.progress}%</span>
                  </div>
                  <Progress value={shipment.progress} className="h-2" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/50 p-4 flex justify-between">
              <StatusBadge status={shipment.status} finished={shipment.finished} />
              <Link to={`/office/shipments/${shipment.id}`}>
                <Button>Voir détails</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
