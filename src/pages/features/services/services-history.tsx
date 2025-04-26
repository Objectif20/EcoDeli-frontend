import { DataTable } from "@/components/features/services/services-history";
import { PaginationControls } from "@/components/pagination-controle";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function ServicesHistory() {
  const dispatch = useDispatch();

  const [services, setServices] = useState<
    {
      id: string;
      clientName: string;
      clientImage: string | null;
      date: string;
      time: string;
      serviceName: string;
      rating: number | null;
    }[]
  >([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Historique des prestations"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  const data = [
    {
      "id": "1",
      "clientName": "Jean Dupont",
      "clientImage": "https://via.placeholder.com/50",
      "date": "2023-10-01",
      "time": "10:00",
      "serviceName": "Nettoyage de printemps",
      "rating": 4
    },
    {
      "id": "2",
      "clientName": "Marie Martin",
      "clientImage": "https://via.placeholder.com/50",
      "date": "2023-10-02",
      "time": "14:30",
      "serviceName": "Réparation électrique",
      "rating": 5
    },
    {
      "id": "3",
      "clientName": "Paul Durand",
      "clientImage": null,
      "date": "2023-10-03",
      "time": "09:00",
      "serviceName": "Jardinage",
      "rating": null
    }
  ]

  useEffect(() => {
    const fetchServicesHistory = async () => {
      try {
        setServices(data);
        setTotalItems(5);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des services :", error);
      }
    };

    fetchServicesHistory();
  }, [pageIndex, pageSize]);

  return (
    <>
      <h1 className="text-2xl font-semibold mb-4">Historique des prestations sur EcoDeli</h1>

      <DataTable key={`${pageIndex}-${pageSize}`} data={services} />

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
    </>
  );
}
