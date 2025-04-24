import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Clock, LocateIcon, Tag } from "lucide-react";

// Données intégrées directement dans le fichier
const deliveryData = {
  delivery: {
    id: "#A7EHDK7",
    from: "Paris",
    to: "Marseille",
    status: "En cours de livraison",
    pickupDate: "12 mars 2023",
    estimatedDeliveryDate: "14 mars 2023",
    coordinates: {
      latitude: 45.764043,
      longitude: 4.835659,
    },
  },
};

export default function LastDelivery() {
  const { delivery } = deliveryData;

  if (!delivery) {
    return (
      <Card className="rounded-xl shadow-lg border border-gray-200 bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-semibold text-gray-800">Aucune livraison en cours</CardTitle>
          <CardDescription className="text-gray-500">Vous n'avez pas de livraison en cours.</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button className="bg-primary text-white hover:bg-primary/80 rounded-xl shadow-md">Créer une demande de livraison</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-lg border border-gray-200 bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-semibold text-gray-800">Votre dernière demande</CardTitle>
        <CardDescription className="text-primary">{delivery.status}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 rounded-xl shadow-md overflow-hidden">
            <MapContainer
              center={[delivery.coordinates.latitude, delivery.coordinates.longitude]}
              zoom={6}
              style={{ height: "300px", borderRadius: "12px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[delivery.coordinates.latitude, delivery.coordinates.longitude]}>
                <Popup>Livraison en cours</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="w-full md:w-1/2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Tag className="text-primary" />
              <p><strong>ID :</strong> {delivery.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <LocateIcon className="text-primary" />
              <p><strong>De :</strong> {delivery.from}</p>
            </div>
            <div className="flex items-center gap-2">
              <LocateIcon className="text-primary" />
              <p><strong>À :</strong> {delivery.to}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-primary" />
              <p><strong>Date de collecte :</strong> {delivery.pickupDate}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-primary" />
              <p><strong>Date d'arrivée estimée :</strong> {delivery.estimatedDeliveryDate}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
