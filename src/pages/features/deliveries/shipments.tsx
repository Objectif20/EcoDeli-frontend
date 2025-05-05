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

interface ShipmentListItem {
  id: string
  name: string
  status: string
  urgent: boolean
  departure: {
    city: string
    coordinates: [number, number]
  }
  arrival: {
    city: string
    coordinates: [number, number]
  }
  departure_date: string
  arrival_date: string
  packageCount: number
  progress: number
  finished: boolean
  initial_price: number
}

const formatDate = (dateString: string) => {
  return format(new Date(dateString), "d MMM yyyy", { locale: fr })
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
    }, [dispatch, ]);

  useEffect(() => {

    const fetchShipments = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockData: ShipmentListItem[] = [
          {
            id: "SHP001",
            name: "Livraison de mobilier",
            status: "In Progress",
            urgent: true,
            departure: {
              city: "Paris",
              coordinates: [48.8566, 2.3522],
            },
            arrival: {
              city: "Lyon",
              coordinates: [45.7578, 4.832],
            },
            departure_date: "2024-05-10T10:00:00",
            arrival_date: "2024-05-12T18:00:00",
            packageCount: 3,
            progress: 65,
            finished: false,
            initial_price: 250,
          },
          {
            id: "SHP002",
            name: "Colis électroniques",
            status: "pending",
            urgent: false,
            departure: {
              city: "Marseille",
              coordinates: [43.2965, 5.3698],
            },
            arrival: {
              city: "Bordeaux",
              coordinates: [44.8378, -0.5792],
            },
            departure_date: "2024-05-15T09:00:00",
            arrival_date: "2024-05-17T14:00:00",
            packageCount: 2,
            progress: 0,
            finished: false,
            initial_price: 180,
          },
          {
            id: "SHP003",
            name: "Livraison matériel médical",
            status: "In Progress",
            urgent: true,
            departure: {
              city: "Lille",
              coordinates: [50.6292, 3.0573],
            },
            arrival: {
              city: "Strasbourg",
              coordinates: [48.5734, 7.7521],
            },
            departure_date: "2024-05-08T08:00:00",
            arrival_date: "2024-05-09T16:00:00",
            packageCount: 5,
            progress: 80,
            finished: false,
            initial_price: 320,
          },
          {
            id: "SHP004",
            name: "Documents confidentiels",
            status: "In Progress",
            urgent: false,
            departure: {
              city: "Nice",
              coordinates: [43.7102, 7.262],
            },
            arrival: {
              city: "Toulouse",
              coordinates: [43.6047, 1.4442],
            },
            departure_date: "2024-05-07T11:00:00",
            arrival_date: "2024-05-08T17:00:00",
            packageCount: 1,
            progress: 100,
            finished: true,
            initial_price: 150,
          },
          {
            id: "SHP005",
            name: "Équipement sportif",
            status: "pending",
            urgent: false,
            departure: {
              city: "Nantes",
              coordinates: [47.2184, -1.5536],
            },
            arrival: {
              city: "Rennes",
              coordinates: [48.1173, -1.6778],
            },
            departure_date: "2024-05-20T10:00:00",
            arrival_date: "2024-05-20T15:00:00",
            packageCount: 4,
            progress: 0,
            finished: false,
            initial_price: 120,
          },
          {
            id: "SHP006",
            name: "Produits alimentaires",
            status: "In Progress",
            urgent: true,
            departure: {
              city: "Montpellier",
              coordinates: [43.6108, 3.8767],
            },
            arrival: {
              city: "Grenoble",
              coordinates: [45.1885, 5.7245],
            },
            departure_date: "2024-05-09T07:00:00",
            arrival_date: "2024-05-10T12:00:00",
            packageCount: 6,
            progress: 45,
            finished: false,
            initial_price: 280,
          },
        ]

        setShipments(mockData)
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
