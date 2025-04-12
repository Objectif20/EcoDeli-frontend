import * as React from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ListCollapse,
  Map,
  Package,
  Euro,
  Weight,
  AlertCircle,
  FileText,
  MapPin,
  Info,
  BadgeCheck,
  Landmark,
  Calendar,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InfoItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function InfoItem({ label, value, icon }: InfoItemProps) {
  return (
    <div className="flex items-start gap-3 text-xs">
      <div className="text-primary">{icon}</div>
      <div>
        <div className="font-medium">{label}</div>
        <div className="text-muted-foreground">{value}</div>
      </div>
    </div>
  )
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <h3 className="text-sm font-semibold flex items-center gap-2 text-primary mb-2">
      {icon}
      {title}
    </h3>
  )
}


const markerIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

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
      }
    ]
  },
  package: [
    {
      id: "1",
      picture: [
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      ],
      name: "Package 1",
      fragility: true,
      estimated_price: 20,
      weight: 2,
      volume: 1,
    },
    {
      id: "2",
      picture: [
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      ],
      name: "Package 2",
      fragility: false,
      estimated_price: 15,
      weight: 1,
      volume: 0.5,
    },
    {
      id: "3",
      picture: [
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      ],
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
        photoUrl:
          "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
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
        photoUrl:
          "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
      },
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
        photoUrl:
          "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000",
      },
    },
  ],
};

export default function DeliveryDetailsPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Home", "Deliveries", "Delivery Details"],
        links: ["/office/dashboard", "/office/deliveries"],
      })
    );
  }, [dispatch]);

  const formatDate = (dateString :string) => {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="h-full">
      <h1 className="text-center text-2xl font-semibold mb-4">
        Détails de la livraison
      </h1>
      <Tabs defaultValue="tab-1" className="w-full">
        <TabsList className="flex justify-center h-auto rounded-none border-border bg-transparent p-0">
          <TabsTrigger value="tab-1" className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">
            <ListCollapse className="mb-1.5 opacity-60" size={16} />
            Details
          </TabsTrigger>
          <TabsTrigger value="tab-2" className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">
            <Package className="mb-1.5 opacity-60" size={16} />
            Colis
          </TabsTrigger>
          <TabsTrigger value="tab-3" className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">
            <Map className="mb-1.5 opacity-60" size={16} />
            Etapes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tab-1">
  <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2">
    <section className="rounded-xl border p-4 shadow-sm space-y-2">
      <SectionTitle icon={<Package />} title="Informations générales" />
      <InfoItem label="Nom" value={fakeDeliveries.details.name} icon={<Package className="w-4 h-4" />} />
      <InfoItem label="Description" value={fakeDeliveries.details.description} icon={<Info className="w-4 h-4" />} />
      <InfoItem label="Infos complémentaires" value={fakeDeliveries.details.complementary_info} icon={<Info className="w-4 h-4" />} />
      <InfoItem label="Statut" value={fakeDeliveries.details.status} icon={<BadgeCheck className="w-4 h-4" />} />
    </section>

    <section className="rounded-xl border p-4 shadow-sm space-y-2">
      <SectionTitle icon={<MapPin />} title="Trajet & Dates" />
      <InfoItem label="Départ" value={fakeDeliveries.details.departure.city} icon={<Landmark className="w-4 h-4" />} />
      <InfoItem label="Arrivée" value={fakeDeliveries.details.arrival.city} icon={<Landmark className="w-4 h-4" />} />
      <InfoItem label="Date de départ" value={formatDate(fakeDeliveries.details.departure_date)} icon={<Calendar className="w-4 h-4" />} />
      <InfoItem label="Date d'arrivée" value={formatDate(fakeDeliveries.details.arrival_date)} icon={<Calendar className="w-4 h-4" />} />
    </section>

    <section className="md:col-span-2 rounded-xl border p-4 shadow-sm space-y-4">
      <SectionTitle icon={<Euro />} title="Tarification & Factures" />

      <div className="grid md:grid-cols-2 gap-2">
        <InfoItem label="Prix initial" value={`${fakeDeliveries.details.initial_price} €`} icon={<Euro className="w-4 h-4" />} />
        <div>
          <div className="font-medium text-sm flex items-center gap-2 mb-1">
            <Euro className="w-4 h-4 text-primary" />
            Prix avec étapes
          </div>
          <ul className="list-disc list-inside text-xs space-y-1">
            {fakeDeliveries.details.price_with_step.map((step, index) => (
              <li key={index}>
                {step.step}: {step.price} €
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <div className="font-medium text-sm flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-primary" />
          Factures
        </div>
        <ul className="list-disc list-inside text-xs space-y-1">
          {fakeDeliveries.details.invoice.map((inv, index) => (
            <li key={index}>
              <a
                href={inv.url_invoice}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {inv.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  </div>
</TabsContent>

        <TabsContent value="tab-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fakeDeliveries.package.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img
                  src={item.picture[0]}
                  alt={item.name}
                  className="w-full h-[180px] object-cover rounded-t-md"
                />
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold text-center mb-3">
                    {item.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Euro size={16} />
                      <span>Estimated Price</span>
                      <span className="ml-auto font-medium text-foreground">
                        {item.estimated_price} €
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Weight size={16} />
                      <span>Weight</span>
                      <span className="ml-auto font-medium text-foreground">
                        {item.weight} kg
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Volume</span>
                      <span className="ml-auto font-medium text-foreground">
                        {item.volume} m³
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>Fragile</span>
                      <span
                        className={`ml-auto font-medium ${
                          item.fragility ? "text-red-500" : "text-green-600"
                        }`}
                      >
                        {item.fragility ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tab-3" className="w-full h-[calc(100vh-210px)]">
          <div className="flex h-full w-full border rounded-lg">
            <div className="w-2/3 h-full">
              <MapContainer
                center={[46.603354, 2.543416]}
                zoom={6}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "0.5rem",
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {fakeDeliveries.steps.map((step) => (
                  <React.Fragment key={step.id}>
                    <Marker
                      position={
                        step.departure.coordinates as L.LatLngTuple
                      }
                      icon={markerIcon}
                    >
                      <Popup>
                        Departure: {step.departure.city} <br /> Courier:{" "}
                        {step.courier.name}
                      </Popup>
                    </Marker>
                    <Marker
                      position={step.arrival.coordinates as L.LatLngTuple}
                      icon={markerIcon}
                    >
                      <Popup>Arrival: {step.arrival.city}</Popup>
                    </Marker>
                    <Polyline
                      positions={[
                        step.departure.coordinates as L.LatLngTuple,
                        step.arrival.coordinates as L.LatLngTuple,
                      ]}
                      color="green"
                    />
                  </React.Fragment>
                ))}
              </MapContainer>
            </div>
            <div className="w-1/3 h-full bg-background rounded-lg overflow-hidden">
              <h1 className="text-xl font-semibold mb-4 px-4 py-2">
                Delivery Steps Details
              </h1>
              <ScrollArea className="h-full px-4 py-2">
                <Accordion
                  type="single"
                  collapsible
                  defaultValue="item-1"
                  className="w-full"
                >
                  {fakeDeliveries.steps.map((step) => (
                    <AccordionItem
                      key={step.id}
                      value={`item-${step.id}`}
                      className="border-b"
                    >
                      <AccordionTrigger className="text-left">
                        {step.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col md:flex-row items-center mb-2">
                          <img
                            src={step.courier.photoUrl}
                            alt={step.courier.name}
                            className="w-10 h-10 rounded-full mr-2 mb-2 md:mb-0"
                          />
                          <div>
                            <p className="font-semibold">{step.courier.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {step.description}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm">Date: {formatDate(step.date)}</p>
                        <p className="text-sm">
                          From {step.departure.city} to {step.arrival.city}
                        </p>
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
