"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { DeliveriesAPI, type Shipment } from "@/api/deliveries.api"
import { DeliverymanApi } from "@/api/deliveryman.api"
import { useNavigate, useParams } from "react-router-dom"

export default function DeliveryDetailsPage() {
  const [_, setActiveTab] = useState("overview")
  const [delivery, setDelivery] = useState<Shipment>()
  const [isDeliveryman, setIsDeliveryman] = useState(false)
  const [isBooked, setIsBooked] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    if (!id) return

    const fetchShipment = async () => {
      try {
        const data = await DeliveriesAPI.getShipmentDetailsById(id)
        setDelivery(data)
      } catch (error) {
        console.error("Erreur de chargement de la livraison:", error)
      }
    }

    const checkEligibility = async () => {
      try {
        const eligible = await DeliverymanApi.isDeliverymanAvailableForThisDeliveries(id)
        setIsDeliveryman(eligible)
      } catch (error) {
        console.error("Erreur d'éligibilité:", error)
      }
    }

    fetchShipment()
    checkEligibility()
  }, [id])

  if (!id) return <div>Erreur : ID de livraison manquant</div>
  if (!delivery) return <div>Chargement...</div>

  const lastStep = delivery.steps[delivery.steps.length - 1]
  let progress = 0

  // Nouvelle logique de progression selon les IDs des étapes
  if (lastStep?.id === -1) {
    progress = 0 // Aucune étape
  } else if (lastStep?.id === 0 || lastStep?.id === 1000) {
    progress = 100 // Livraison complète
  } else if (lastStep?.id >= 1 && lastStep?.id <= 999) {
    // Trouver l'étape avec le plus grand ID entre 1 et 999
    const maxStepId = Math.max(
      ...delivery.steps.filter((step) => step.id >= 1 && step.id <= 999).map((step) => step.id),
    )
    const totalSteps = maxStepId + 1
    progress = (maxStepId / totalSteps) * 100
  }

  const handleBook = async () => {
    try {
      await DeliveriesAPI.bookShipment(id)
      toast.success("Réservation réussie !")
      setIsBooked(true)
    } catch (error) {
      console.error("Erreur de réservation:", error)
    }
  }

  const handlePartialBook = async () => {
    try {
      await DeliveriesAPI.askToNegotiate(id)
      navigate("/office/messaging")
      setIsBooked(true)
    } catch (error) {
      console.error("Erreur de négociation:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Card className="border-none shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-foreground rounded-t-lg py-8">
          <div>
            <CardTitle className="text-2xl md:text-3xl font-bold flex items-center">
              {delivery.details.name}
              {delivery.details.urgent && <Badge className="ml-2 bg-red-500 text-white border-none">URGENT</Badge>}
            </CardTitle>
            <CardDescription className="text-primary-foreground/90 mt-1">
              Référence N°{delivery.details.id}
            </CardDescription>
            {(delivery.details.departure_date || delivery.details.arrival_date) && (
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-primary-foreground/80">
                {delivery.details.departure_date && (
                  <div className="flex items-center gap-2">
                    <span>Départ prévu:</span>
                    <span className="font-medium">
                      {new Date(delivery.details.departure_date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
                {delivery.details.arrival_date && (
                  <div className="flex items-center gap-2">
                    <span>Arrivée prévue:</span>
                    <span className="font-medium">
                      {new Date(delivery.details.arrival_date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="relative pl-8 space-y-6">
                <div className="relative">
                  <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-background"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Départ</p>
                    <h3 className="text-lg font-semibold">{delivery.details.departure.city}</h3>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Arrivée</p>
                    <h3 className="text-lg font-semibold">{delivery.details.arrival.city}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Progression</span>
                  <span className="text-sm font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {lastStep?.id === -1
                    ? "Aucune étape pour le moment"
                    : lastStep?.id === 0
                      ? "Livraison entièrement prise en charge"
                      : lastStep?.id === 1000
                        ? "Dernière étape en cours"
                        : `${delivery.steps.length} étape${delivery.steps.length > 1 ? "s" : ""} sur ${Math.max(...delivery.steps.filter((step) => step.id >= 1 && step.id <= 999).map((step) => step.id)) + 1}`}
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-medium">Prix proposé</span>
                  <span className="text-xl font-bold">{delivery.details.initial_price} €</span>
                </div>
              </div>
              {isDeliveryman && !isBooked && !delivery.details.finished && (
                <div className="space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Prendre la livraison</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Prise en charge complète</DialogTitle>
                        <DialogDescription>Souhaitez-vous prendre en charge toute la livraison ?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={handleBook}>Oui</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="outline">Non</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  { delivery.details.trolleydrop === false && ( 
                    
                    <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Prise en charge partielle</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Livraison partielle</DialogTitle>
                        <DialogDescription>Vous serez redirigé vers la messagerie pour en discuter.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={handlePartialBook}>Oui</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button variant="outline">Non</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  
                  )}

                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="packages">Colis ({delivery.package.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Informations complémentaires</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{delivery.details.complementary_info}</p>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">État de la livraison</h3>
                  <Card className="border-none shadow-md bg-gradient-to-br from-background to-muted">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border-2 border-primary shadow-md">
                          <AvatarImage
                            src={lastStep?.courier?.photoUrl || "/placeholder.svg"}
                            alt={lastStep?.courier?.name || "Livreur"}
                          />
                          <AvatarFallback>{lastStep?.courier?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{lastStep?.courier?.name || "Transporteur"}</p>
                            <Badge
                              variant="outline"
                              className={delivery.details.urgent ? "bg-red-50 text-red-700 border-red-200" : "hidden"}
                            >
                              URGENT
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mt-1">
                            {lastStep?.id === -1
                              ? "Aucune étape pour le moment"
                              : lastStep?.id === 0
                                ? "Le transporteur assure toute la distance"
                                : lastStep?.id === 1000
                                  ? "Le transporteur assure le reste de la distance"
                                  : "Le transporteur assure une partie de la distance"}
                          </p>
                          {lastStep?.date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(lastStep?.date).toLocaleDateString("fr-FR", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Aperçu des colis</h3>
                  <div className="space-y-3">
                    {delivery.package.slice(0, 2).map((pkg) => (
                      <div
                        key={pkg.id}
                        className="flex items-center gap-3 p-4 bg-background rounded-lg border border-muted shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="w-14 h-14 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={pkg.picture[0] || "/placeholder.svg"}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{pkg.name}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {pkg.weight} kg
                            </Badge>
                            {pkg.estimated_price > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {pkg.estimated_price} €
                              </Badge>
                            )}
                            {pkg.fragility && (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" /> Fragile
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold mb-4">Détails de l'expédition</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-5 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Statut</span>
                      <Badge
                        className={`w-fit mt-2 ${
                          delivery.details.status === "pending"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : delivery.details.finished
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : ""
                        }`}
                      >
                        {delivery.details.status === "pending"
                          ? "En attente"
                          : delivery.details.status === "In Progress"
                            ? "En cours"
                            : delivery.details.finished
                              ? "Terminée"
                              : delivery.details.status}
                      </Badge>
                    </div>
                  </Card>
                  <Card className="p-5 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Distance</span>
                      <span className="font-medium mt-2">
                        {Math.round(
                          Math.sqrt(
                            Math.pow(
                              delivery.details.departure.coordinates[0] - delivery.details.arrival.coordinates[0],
                              2,
                            ) +
                              Math.pow(
                                delivery.details.departure.coordinates[1] - delivery.details.arrival.coordinates[1],
                                2,
                              ),
                          ) * 111.32,
                        )}{" "}
                        km
                      </span>
                    </div>
                  </Card>
                  <Card className="p-5 border-l-4 border-l-primary shadow-md hover:shadow-lg transition-shadow">
                    <div className="flex flex-col">
                      <span className="text-sm text-muted-foreground">Poids total</span>
                      <span className="font-medium mt-2">
                        {delivery.package.reduce((total, pkg) => total + pkg.weight, 0)} kg
                      </span>
                    </div>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Détails des colis</CardTitle>
              <CardDescription>{delivery.package.length} colis pour cette livraison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {delivery.package.map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <img
                        src={pkg.picture[0] || "/placeholder.svg"}
                        alt={pkg.name}
                        className="w-full md:w-1/4 h-48 object-cover"
                      />
                      <div className="flex-1 p-4">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold">{pkg.name}</h3>
                          {pkg.fragility && (
                            <Badge className="border-none">
                              <AlertTriangle className="w-3 h-3 mr-1" /> Fragile
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-foreground">Poids</p>
                            <p className="font-medium">{pkg.weight} kg</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground">Volume</p>
                            <p className="font-medium">{pkg.volume} m³</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
