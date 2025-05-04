"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, AlertTriangle, FileText } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"

const fakeDeliveries = {
  details: {
    id: "1",
    name: "Package Delivery",
    description: "Fragile package delivery",
    complementary_info: "Package to be delivered on time",
    departure: {
      city: "Paris",
      coordinates: [48.8566, 2.3522],
    },
    arrival: {
      city: "Lyon",
      coordinates: [45.764, 4.8357],
    },
    departure_date: "2023-10-01",
    arrival_date: "2023-10-03",
    status: "In Progress",
    initial_price: 50,
    price_with_step: [
      {
        step: "Step 1",
        price: 20,
      },
      {
        step: "Step 2",
        price: 15,
      },
      {
        step: "Step 3",
        price: 25,
      },
    ],
    invoice: [
      {
        name: "Package 1",
        url_invoice: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      },
    ],
    urgent : true,
    finished: false,
  },
  package: [
    {
      id: "1",
      picture: ["https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg"],
      name: "Package 1",
      fragility: true,
      estimated_price: 20,
      weight: 2,
      volume: 1,
    },
    {
      id: "2",
      picture: ["https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg"],
      name: "Package 2",
      fragility: false,
      estimated_price: 15,
      weight: 1,
      volume: 0.5,
    },
    {
      id: "3",
      picture: ["https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg"],
      name: "Package 3",
      fragility: true,
      estimated_price: 25,
      weight: 3,
      volume: 1.5,
    },
  ],
  steps: [
    {
      id: 1,
      title: "Step 1",
      description: "Departure from the main warehouse.",
      date: "2023-10-01",
      departure: {
        city: "Paris",
        coordinates: [48.8566, 2.3522],
      },
      arrival: {
        city: "Lyon",
        coordinates: [45.764, 4.8357],
      },
      courier: {
        name: "Jean Dupont",
        photoUrl: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
      },
      idLink : 1000,
    },
    {
      id: 2,
      title: "Step 2",
      description: "Transfer to the distribution center.",
      date: "2023-10-02",
      departure: {
        city: "Lyon",
        coordinates: [45.764, 4.8357],
      },
      arrival: {
        city: "Marseille",
        coordinates: [43.2965, 5.3698],
      },
      courier: {
        name: "Marie Martin",
        photoUrl: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
      },
      idLink : 1000,
    },
    {
      id: 3,
      title: "Step 3",
      description: "Final delivery to the customer.",
      date: "2023-10-03",
      departure: {
        city: "Marseille",
        coordinates: [43.2965, 5.3698],
      },
      arrival: {
        city: "Nice",
        coordinates: [43.7102, 7.262],
      },
      courier: {
        name: "Paul Leclerc",
        photoUrl: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
      },
      idLink : 1000,
    },
  ],
}

export default function ShipmentsDetailsOfficePage() {
  const [_, setActiveTab] = useState("overview")
  const delivery = fakeDeliveries
  const navigate = useNavigate()


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Demandes de livraison", "Détails"],
        links: ["/office/dashboard", "/office/shipments"],
      })
    );
  }, [dispatch]);

  const { id } = useParams()

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
    const maxStepId = Math.max(
      ...delivery.steps.filter((step) => step.id >= 1 && step.id <= 999).map((step) => step.id),
    )
    const totalSteps = maxStepId + 1
    progress = (maxStepId / totalSteps) * 100
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr })
  }

  const totalPrice = delivery.details.price_with_step.reduce((sum, step) => sum + step.price, 0)

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
                      {formatDate(delivery.details.departure_date)}
                    </span>
                  </div>
                )}
                {delivery.details.arrival_date && (
                  <div className="flex items-center gap-2">
                    <span>Arrivée prévue:</span>
                    <span className="font-medium">
                      {formatDate(delivery.details.arrival_date)}
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
                    <p className="text-sm text-foreground">Collecte le {formatDate(delivery.details.departure_date)}</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Arrivée</p>
                    <h3 className="text-lg font-semibold">{delivery.details.arrival.city}</h3>
                    <p className="text-sm text-foreground">
                      Livraison prévue le {formatDate(delivery.details.arrival_date)}
                    </p>
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
                  <span className="font-medium">Prix total</span>
                  <span className="text-xl font-bold">{totalPrice} €</span>
                </div>
                <p className="text-sm text-foreground">Prix initial: {delivery.details.initial_price} €</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Voir la facture
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full mt-6">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Aperçu</TabsTrigger>
          <TabsTrigger value="packages">Colis ({delivery.package.length})</TabsTrigger>
          {delivery.steps.some(step => step.id !== -1) && (
            <TabsTrigger value="steps">Étapes ({delivery.steps.filter(step => step.id !== -1).length})</TabsTrigger>
          )}
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
                              {formatDate(lastStep?.date)}
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

        <TabsContent value="steps" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Étapes de livraison</CardTitle>
              <CardDescription>Suivi du parcours de votre livraison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-8">
                <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-blue-200"></div>

                {delivery.steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <div
                      className={`absolute left-[-29px] top-0 w-6 h-6 rounded-full ${
                        index === delivery.steps.length - 1 ? "bg-primary" : "bg-primary bg-opacity-30"
                      } flex items-center justify-center`}
                    >
                      {index === delivery.steps.length - 1 ? (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                      )}
                    </div>

                    <Card
                      className={`border ${index === delivery.steps.length - 1 ? "bg-secondary" : ""}`}
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{step.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {formatDate(step.date)}
                              </Badge>
                            </div>
                            <p className="text-sm mt-1">{step.description}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={step.courier.photoUrl || "/placeholder.svg"}
                                alt={step.courier.name}
                              />
                              <AvatarFallback>{step.courier.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{step.courier.name}</p>
                              <p className="text-xs">Livreur</p>
                            </div>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <div>
                              <p className="text-sm ">Départ</p>
                              <p className="font-medium">{step.departure.city}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 " />
                            <div>
                              <p className="text-sm">Arrivée</p>
                              <p className="font-medium">{step.arrival.city}</p>
                            </div>
                          </div>
                        </div>

                        <Button
                          onClick={() => navigate(`/office/deliveries/public/${step.idLink}`)}
                          className="mt-4"
                        >
                          Voir les détails
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
