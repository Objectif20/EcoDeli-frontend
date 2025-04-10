import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L, { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useDispatch } from 'react-redux';
import { setBreadcrumb } from '@/redux/slices/breadcrumbSlice';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Deliveries {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  deliveryman?: {
    id: string;
    name: string;
    photo: string;
    email: string;
  };
  potential_address?: string;
}

const DeliveriesLocationPage = () => {
  const [, setSelectedDelivery] = useState<Deliveries | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

    useEffect(() => {
      dispatch(setBreadcrumb({
        segments: ["Accueil", "Livraisons", "Localisation"],
        links: ['/office/dashboard'],
      }));
    }, [dispatch]);

  const deliveries: Deliveries[] = [
    {
      id: '1',
      coordinates: { lat: 48.8566, lng: 2.3522 },
      potential_address: '123 Rue de Paris',
      deliveryman: { id: 'dm1', name: 'Jean Dupont', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s', email: 'jean.dupont@example.com' }
    },
    {
      id: '2',
      coordinates: { lat: 43.6108, lng: 3.8767 },
      potential_address: '456 Rue de Montpellier',
      deliveryman: { id: 'dm2', name: 'Marie Martin', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s', email: 'marie.martin@example.com' }
    },
    {
      id: '3',
      coordinates: { lat: 45.7640, lng: 4.8357 },
      potential_address: '789 Rue de Lyon',
      deliveryman: { id: 'dm3', name: 'Pierre Leclerc', photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Hb5xzFZJCTW4cMqmPwsgfw-gILUV7QevvQ&s', email: 'pierre.leclerc@example.com' }
    },
    {
      id: '4',
      coordinates: { lat: 47.2184, lng: -1.5536 },
      potential_address: '101 Rue de Nantes',
      deliveryman: { id: 'dm4', name: 'Sophie Moreau', photo: 'path/to/photo.jpg', email: 'sophie.moreau@example.com' }
    },
  ];

  const handleMarkerClick = (delivery: Deliveries) => {
    setSelectedDelivery(delivery);
  };

  const franceBounds: LatLngBoundsExpression = [
    [41.36, -5.14],
    [51.09, 9.56],
  ];

  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (

    <div className="w-full h-full z-0">
      <MapContainer bounds={franceBounds} className="w-full h-full z-0" attributionControl={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {deliveries.map((delivery) => (
          <Marker
            key={delivery.id}
            position={[delivery.coordinates.lat, delivery.coordinates.lng]}
            icon={defaultIcon}
            eventHandlers={{
              click: () => handleMarkerClick(delivery),
            }}
          >
            <Popup>
                <strong className="block mb-2">{delivery.potential_address}</strong>
                {delivery.deliveryman && (
                  <div className="flex items-center">
                      <Avatar className='mr-2 mb-8'>
                        <AvatarImage src={delivery.deliveryman.photo} alt={delivery.deliveryman.name} />
                        <AvatarFallback>{delivery.deliveryman.name}</AvatarFallback>
                      </Avatar>
                    <div>
                      <strong>Livreur:</strong> {delivery.deliveryman.name}
                      <br />
                      <strong>Email:</strong> {delivery.deliveryman.email}
                      <Button variant="link" onClick={() => navigate(`/office/deliveries/${delivery.id}`)}>Accéder aux détails</Button>

                    </div>
                  </div>
                )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>

  );
};

export default DeliveriesLocationPage;
