import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Delivery {
  id: string;
  arrival_city: string;
  departure_city: string;
  date_departure: string;
  date_arrival: string;
  photo: string;
  deliveryman: {
    name: string;
    photo: string;
  };
}

export function DeliveriesPage() {
  const dispatch = useDispatch();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Livraisons"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = {
          data: [
            {
              id: "1",
              arrival_city: "Paris",
              departure_city: "Lyon",
              date_departure: "2023-10-01",
              date_arrival: "2023-10-05",
              photo: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
              deliveryman: {
                name: "Jean Dupont",
                photo: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
              },
            },
            {
              id: "2",
              arrival_city: "Marseille",
              departure_city: "Nice",
              date_departure: "2023-09-25",
              date_arrival: "2023-09-30",
              photo: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
              deliveryman: {
                name: "Marie Martin",
                photo: "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D",
              },
            },
          ],
        };

        setDeliveries(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des livraisons", error);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Livraisons en cours</h1>
      <div className="flex justify-end mb-4">
        <Button onClick={() => navigate("/office/deliveries/create")}>
          Créer une demande de livraison
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            className="bg-background rounded-lg shadow-lg p-6 flex flex-col items-center text-center border hover:shadow-xl transition"
          >
            <img
              src={delivery.photo}
              alt={`Livraison ${delivery.id}`}
              className="w-full h-40 object-cover rounded-md mb-4"
            />
            <h2 className="text-lg font-semibold">
              {delivery.departure_city} → {delivery.arrival_city}
            </h2>
            <p className="text-foreground text-sm mt-1">
              Départ: {new Date(delivery.date_departure).toLocaleDateString()}
            </p>
            <p className="text-foreground text-sm mt-1">
              Arrivée: {new Date(delivery.date_arrival).toLocaleDateString()}
            </p>
            <div className="flex items-center mt-4 space-x-2">
              <img
                src={delivery.deliveryman.photo}
                alt={delivery.deliveryman.name}
                className="w-8 h-8 rounded-full"
              />
              <p className="text-sm">{delivery.deliveryman.name}</p>
            </div>
            <Button
              className="mt-4"
              onClick={() => navigate(`/office/deliveries/${delivery.id}`)}
            >
              Voir les détails
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
