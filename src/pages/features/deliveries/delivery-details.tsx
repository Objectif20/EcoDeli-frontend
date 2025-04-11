import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function PackageCarousel({ images }: { images: string[] }) {
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <img src={image} alt={`Package ${index + 1}`} className="w-full h-full object-cover" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListCollapse, Map, Package } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

const markerIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const fakeDeliveries = {
  package: [
    {
      id: "1",
      picture: [
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      ],
      name: "Colis 1",
      fragility: true,
      estimed_price: 20,
      weight: 2,
      volume: 1,
    },
    {
      id: "2",
      picture: [
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      ],
      name: "Colis 2",
      fragility: false,
      estimed_price: 15,
      weight: 1,
      volume: 0.5,
    },
    {
      id: "3",
      picture: [
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      ],
      name: "Colis 3",
      fragility: true,
      estimed_price: 25,
      weight: 3,
      volume: 1.5,
    },
  ],
  steps: [
    {
      id: 1,
      title: "Étape 1",
      description: "Départ de l'entrepôt principal.",
      date: "2023-10-01",
      departure: {
        city: "Paris",
        coordinates: [48.8566, 2.3522],
      },
      arrival: {
        city: "Lyon",
        coordinates: [45.7640, 4.8357],
      },
      courier: {
        name: "Jean Dupont",
        photoUrl: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      },
    },
    {
      id: 2,
      title: "Étape 2",
      description: "Transfert vers le centre de distribution.",
      date: "2023-10-02",
      departure: {
        city: "Lyon",
        coordinates: [45.7640, 4.8357],
      },
      arrival: {
        city: "Marseille",
        coordinates: [43.2965, 5.3698],
      },
      courier: {
        name: "Marie Martin",
        photoUrl: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      },
    },
    {
      id: 3,
      title: "Étape 3",
      description: "Livraison finale au client.",
      date: "2023-10-03",
      departure: {
        city: "Marseille",
        coordinates: [43.2965, 5.3698],
      },
      arrival: {
        city: "Nice",
        coordinates: [43.7102, 7.2620],
      },
      courier: {
        name: "Paul Leclerc",
        photoUrl: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
      },
    },
  ],
};

export default function DeliveryDetailsPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Livraisons", "Détails de la livraison"],
        links: ["/office/dashboard", "/office/deliveries"],
      })
    );
  }, [dispatch]);

  return (
    <div className="h-full">
      <h1 className="text-center text-2xl font-semibold mb-4">Nom de l'annonce</h1>
      <Tabs defaultValue="tab-1" className="w-full">
        <TabsList className="flex justify-center h-auto rounded-none border-border bg-transparent p-0">
          <TabsTrigger
            value="tab-1"
            className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <ListCollapse className="mb-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
            Détail
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <Package className="mb-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
            Colis
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
          >
            <Map className="mb-1.5 opacity-60" size={16} strokeWidth={2} aria-hidden="true" />
            Etapes
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">
          <p className="p-4 text-center text-xs text-muted-foreground">Content for Tab 1</p>
        </TabsContent>
        <TabsContent value="tab-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols- gap-4">
            {fakeDeliveries.package.map((item) => (
              <Card key={item.id} className="p-4">
                <PackageCarousel images={item.picture} />
                <CardContent className="text-center mt-4">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-sm">Prix estimé: {item.estimed_price} €</p>
                  <p className="text-sm">Poids: {item.weight} kg</p>
                  <p className="text-sm">Volume: {item.volume} m³</p>
                  <p className="text-sm">Fragile: {item.fragility ? "Oui" : "Non"}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="tab-3" className="w-full h-[calc(100vh-210px)]">
          <div className="flex h-full w-full border rounded-lg">
            <div className="w-2/3 h-full">
              <MapContainer center={[46.603354, 2.543416]} zoom={6} style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  className="rounded-lg"
                />
                {fakeDeliveries.steps.map((step) => (
                  <React.Fragment key={step.id}>
                    <Marker position={step.departure.coordinates as L.LatLngTuple} icon={markerIcon}>
                      <Popup>
                        Départ: {step.departure.city} <br /> Livreur: {step.courier.name}
                      </Popup>
                    </Marker>
                    <Marker position={step.arrival.coordinates as L.LatLngTuple} icon={markerIcon}>
                      <Popup>
                        Arrivée: {step.arrival.city}
                      </Popup>
                    </Marker>
                    <Polyline positions={[step.departure.coordinates as L.LatLngTuple, step.arrival.coordinates as L.LatLngTuple]} color="green" />
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
            <div className="w-1/3 h-full bg-background rounded-lg overflow-hidden">
              <h1 className="text-xl font-semibold mb-4 px-4 py-2">Détails des différentes étapes de livraison</h1>
              <ScrollArea className="h-full px-4 py-2">
                <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
                  {fakeDeliveries.steps.map((step) => (
                    <AccordionItem key={step.id} value={`item-${step.id}`}>
                      <AccordionTrigger>{step.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="flex items-center mb-2">
                          <img src={step.courier.photoUrl} alt={step.courier.name} className="w-10 h-10 rounded-full mr-2" />
                          <div>
                            <p className="font-semibold">{step.courier.name}</p>
                            <p className="text-xs text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                        <p className="text-sm">Date: {step.date}</p>
                        <p className="text-sm">De {step.departure.city} à {step.arrival.city}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
