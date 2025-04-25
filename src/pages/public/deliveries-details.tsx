import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, MapPin, AlertTriangle, EuroIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
      city: "Marseille",
      coordinates: [43.2965, 5.3698],
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
    },
  ],
};

export default function DeliveryDetailsPage() {
  const [_, setActiveTab] = useState("overview");

  const delivery = fakeDeliveries;

  const lastStep = delivery.steps[delivery.steps.length - 1];

  const totalPrice = delivery.details.price_with_step.reduce((sum, step) => sum + step.price, 0);

  const progress = (delivery.steps.length / 3) * 100;

  const formatDate = (dateString : string) => {
    return format(new Date(dateString), "d MMMM yyyy", { locale: fr });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary text-foreground rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">{delivery.details.name}</CardTitle>
                <CardDescription className="text-primary-foreground mt-1">Référence N°{delivery.details.id}</CardDescription>
              </div>
              <Badge variant="outline" className="bg-white/20 text-foreground border-none px-3 py-1">
                {delivery.details.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-secondary px-3 py-1">
                    <Clock className="w-4 h-4 mr-1" />
                    Livraison prévue le {formatDate(delivery.details.arrival_date)}
                  </Badge>
                </div>

                <div className="relative pl-8 space-y-6">
                  <div className="absolute left-3 top-4 bottom-4 w-0.5"></div>

                  <div className="relative">
                    <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-background"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Départ</p>
                      <h3 className="text-lg font-semibold">{lastStep.departure.city}</h3>
                      <p className="text-sm text-foreground">Collecte le {formatDate(lastStep.date)}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Arrivée</p>
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-foreground">Progression</span>
                    <span className="text-sm font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="bg-background p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Prix total</span>
                    <span className="text-xl font-bold">{totalPrice} €</span>
                  </div>
                  <p className="text-sm text-foreground">Prix initial: {delivery.details.initial_price} €</p>
                </div>

                <Button className="w-full bg-green-500 text-white hover:bg-green-600">
                  Prendre la livraison
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" onValueChange={setActiveTab} className="w-full">
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
                    <h3 className="text-lg font-semibold mb-4">Dernière mise à jour</h3>
                    <Card className="border border-primary">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10 border-2 border-primary">
                            <AvatarImage
                              src={lastStep.courier.photoUrl || "/placeholder.svg"}
                              alt={lastStep.courier.name}
                            />
                            <AvatarFallback>{lastStep.courier.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lastStep.title}</p>
                            <p className="text-sm text-foreground">{lastStep.description}</p>
                            <p className="text-sm text-foreground mt-1">
                              {formatDate(lastStep.date)} • {lastStep.courier.name}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Aperçu des colis</h3>
                    <div className="space-y-3">
                      {delivery.package.slice(0, 2).map((pkg) => (
                        <div key={pkg.id} className="flex items-center gap-3 p-3 bg-background rounded-lg">
                          <div className="w-12 h-12 rounded bg-background overflow-hidden">
                            <img
                              src={pkg.picture[0] || "/placeholder.svg"}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{pkg.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {pkg.weight} kg
                              </Badge>
                              {pkg.fragility && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                                >
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Fragile
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{pkg.estimated_price} €</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="packages" className="space-y-6">
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
                        <div className="w-full md:w-1/4 h-48 md:h-auto">
                          <img
                            src={pkg.picture[0] || "/placeholder.svg"}
                            alt={pkg.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-semibold">{pkg.name}</h3>
                              {pkg.fragility && (
                                <Badge className="mt-1 border-none">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Fragile
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="bg-primary text-foreground">
                              <EuroIcon className="w-3 h-3 mr-1" />
                              {pkg.estimated_price} €
                            </Badge>
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
    </div>
  );
}
