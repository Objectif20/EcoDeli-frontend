import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveries/vehicles/vehicles";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Vehicle {
  id: string;
  name: string;
  matricule: string;
  co2: number;
  allow: boolean;
  image: string;
  justification_file: string;
}

export default function VehicleListPage() {
  const dispatch = useDispatch();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Véhicules"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = {
          data: [
            {
              id: "1",
              name: "Voiture Électrique",
              matricule: "AB-123-CD",
              co2: 0,
              allow: true,
              image: "https://example.com/electric-car.jpg",
              justification_file: "https://example.com/justification.pdf",
            },
            {
              id: "2",
              name: "Camion Diesel",
              matricule: "EF-456-GH",
              co2: 150,
              allow: false,
              image: "https://example.com/diesel-truck.jpg",
              justification_file: "https://example.com/justification.pdf",
            },
          ],
          totalRows: 2,
        };

        setVehicles(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules", error);
      }
    };

    fetchVehicles();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Liste des Véhicules</h1>
      <Button onClick={() => navigate("/office/add-vehicle")}>Ajouter un nouveau véhicule</Button>
      <DataTable key={`${pageIndex}-${pageSize}`} data={vehicles} />
      <PaginationControls
        pageIndex={pageIndex}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageIndexChange={setPageIndex}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPageIndex(0);
        }}
      />
    </div>
  );
}
