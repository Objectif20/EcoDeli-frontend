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
  Map,
  Package,
  Euro,
  Weight,
  AlertCircle,
  Landmark,
  Calendar,
  BadgeCheck,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIconPng from "leaflet/dist/images/marker-icon.png";

const markerIcon = new L.Icon({
  iconUrl: markerIconPng,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const delivery = {
  departure: {
    city: "Paris",
    coordinates: [48.8566, 2.3522],
  },
  arrival: {
    city: "Nice",
    coordinates: [43.7102, 7.262],
  },
  departure_date: "2023-10-01",
  arrival_date: "2023-10-03",
  status: "En cours",
  packages: [
    {
      id: "1",
      name: "Package 1",
      fragility: true,
      estimated_price: 20,
      weight: 2,
      volume: 1,
      picture: [
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      ],
    },
    {
      id: "2",
      name: "Package 2",
      fragility: false,
      estimated_price: 15,
      weight: 1,
      volume: 0.5,
      picture: [
        "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      ],
    },
  ],
};

export default function DeliveryTransporterView() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Mes livraisons", "Vue transporteur"],
        links: ["/office/dashboard", "/office/deliveries"],
      })
    );
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" } as const;
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="h-full">
      <h1 className="text-center text-2xl font-semibold mb-4">
        Livraison - Vue Transporteur
      </h1>

      <Tabs defaultValue="map" className="w-full">
        <TabsList className="flex justify-center h-auto rounded-none border-border bg-transparent p-0">
          <TabsTrigger value="map" className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">
            <Map size={16}  className="mb-1.5 opacity-60"/>
            Trajet
          </TabsTrigger>
          <TabsTrigger value="packages" className="relative flex-col rounded-none px-4 py-2 text-xs after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary">
            <Package size={16} className="mb-1.5 opacity-60" />
            Colis
          </TabsTrigger>
        </TabsList>

        {/* Carte */}
        <TabsContent value="map" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-[500px]">
              <MapContainer
                center={[46.2, 4.5]}
                zoom={6}
                style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={delivery.departure.coordinates as L.LatLngTuple}
                  icon={markerIcon}
                >
                  <Popup>Départ : {delivery.departure.city}</Popup>
                </Marker>
                <Marker
                  position={delivery.arrival.coordinates as L.LatLngTuple}
                  icon={markerIcon}
                >
                  <Popup>Arrivée : {delivery.arrival.city}</Popup>
                </Marker>
                <Polyline
                  positions={[
                    delivery.departure.coordinates as L.LatLngTuple,
                    delivery.arrival.coordinates as L.LatLngTuple,
                  ]}
                  color="blue"
                />
              </MapContainer>
            </div>

            <div className="space-y-2 p-4 border rounded-xl shadow-sm bg-white">
              <h2 className="font-semibold text-lg">Infos Livraison</h2>
              <p className="text-sm flex items-center gap-2">
                <Landmark size={16} />
                Départ : <span className="font-medium">{delivery.departure.city}</span>
              </p>
              <p className="text-sm flex items-center gap-2">
                <Landmark size={16} />
                Arrivée : <span className="font-medium">{delivery.arrival.city}</span>
              </p>
              <p className="text-sm flex items-center gap-2">
                <Calendar size={16} />
                Date de départ : <span className="font-medium">{formatDate(delivery.departure_date)}</span>
              </p>
              <p className="text-sm flex items-center gap-2">
                <Calendar size={16} />
                Date d'arrivée : <span className="font-medium">{formatDate(delivery.arrival_date)}</span>
              </p>
              <p className="text-sm flex items-center gap-2">
                <BadgeCheck size={16} />
                Statut : <span className="font-medium">{delivery.status}</span>
              </p>
            </div>
          </div>
        </TabsContent>

        {/* Colis */}
        <TabsContent value="packages" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {delivery.packages.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <img
                  src={item.picture[0]}
                  alt={item.name}
                  className="w-full h-[180px] object-cover"
                />
                <CardContent className="p-4">
                  <h2 className="text-lg font-semibold text-center mb-3">
                    {item.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Euro size={16} />
                      <span>Prix</span>
                      <span className="ml-auto font-medium text-foreground">
                        {item.estimated_price} €
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Weight size={16} />
                      <span>Poids</span>
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
                        {item.fragility ? "Oui" : "Non"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
