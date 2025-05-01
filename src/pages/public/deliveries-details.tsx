import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DeliveriesAPI, Shipment } from "@/api/deliveries.api";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
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
import { toast } from "sonner";

export default function DeliveryDetailsPage() {
  const [_, setActiveTab] = useState("overview");
  const [delivery, setDelivery] = useState<Shipment>();

  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);
  const isDeliveryman = user?.profile.includes('DELIVERYMAN');
  const navigate = useNavigate();

  const {id } = useParams();

  if (!id) {
    return <div>Erreur: ID de livraison manquant</div>;
  }

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const data = await DeliveriesAPI.getShipmentDetailsById(id);
        setDelivery(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShipment();
  }, [id]);

  if (!delivery) {
    return <div>Chargement...</div>;
  }


  const lastStep = delivery.steps[delivery.steps.length - 1];

  const proposedPrice = delivery.details.initial_price;

  const progress = (delivery.steps.length / 3) * 100;

  const bookShipment = async () => {
    try {
      await DeliveriesAPI.bookShipment(id);
      toast.success("Réservation réussie !");
    } catch (error) { 
      console.error("Erreur lors de la réservation :", error);
    }
  };

  const bookPartialShipment = async () => {
    try {
      const response = await DeliveriesAPI.askToNegotiate(id);
      navigate('/office/messaging')
      console.log("Réponse de la réservation partielle :", response);
    } catch (error) {
      console.error("Erreur lors de la réservation partielle :", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary text-foreground rounded-t-lg">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl md:text-3xl font-bold">{delivery.details.description}</CardTitle>
                <CardDescription className="text-primary-foreground mt-1">Référence N°{delivery.details.id}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="flex items-center gap-2">

                </div>

                <div className="relative pl-8 space-y-6">
                  <div className="absolute left-3 top-4 bottom-4 w-0.5"></div>

                  <div className="relative">
                    <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-background"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Départ</p>
                      <h3 className="text-lg font-semibold">{lastStep?.departure?.city}</h3>

                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[-29px] top-0 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Arrivée</p>
                      <h3 className="text-lg font-semibold">{delivery.details.arrival.city}</h3>

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
                    <span className="font-medium">Prix proposé</span>
                    <span className="text-xl font-bold">{proposedPrice} €</span>
                  </div>
                </div>
                {isDeliveryman && (
                  <div className="space-y-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          Prendre la livraison
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Prise en charge complète</DialogTitle>
                          <DialogDescription>
                            Souhaitez-vous prendre en charge toute la livraison ?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                          <Button onClick={() => bookShipment()}>
                            Oui
                          </Button>
                          </DialogClose>
                          <DialogClose asChild>
                          <Button variant="outline">Non</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          Prendre en charge une partie de la livraison
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Livraison partielle</DialogTitle>
                          <DialogDescription>
                            Souhaitez-vous prendre en charge une partie de la livraison ?<br />
                            Pour ce faire, vous devez contacter l'expéditeur par message afin de discuter des conditions.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                        <DialogClose asChild>
                          <Button onClick={() => bookPartialShipment()}>
                            Oui
                          </Button>
                          </DialogClose>
                          <DialogClose asChild>
                          <Button variant="outline">Non</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
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
                              src={lastStep?.courier?.photoUrl || "/placeholder.svg"}
                              alt={lastStep?.courier?.name || "Livreur"}
                            />
                            <AvatarFallback>{lastStep?.courier?.name?.charAt(0) || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lastStep?.title}</p>
                            <p className="text-sm text-foreground">{lastStep?.description}</p>
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
