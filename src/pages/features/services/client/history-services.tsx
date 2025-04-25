"use client";

import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/services/client/history";

interface ServiceHistory {
  id: string;
  price: number;
  provider: {
    id: string;
    name: string;
    photo: string;
  };
  date: string;
  service_name: string;
  rate: number | null;
  review:string | null;
}

export default function HistoryServices() {
  const dispatch = useDispatch();
  const [services, setServices] = useState<ServiceHistory[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Prestations", "Historique"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = {
          data: [
            {
              id: "1",
              price: 75,
              provider: {
                id: "p1",
                name: "Alice Durand",
                photo: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
              },
              date: "2023-10-01",
              service_name: "Nettoyage",
              rate: 5,
              review: "Excellent service !",
            },
            {
              id: "2",
              price: 120,
              provider: {
                id: "p2",
                name: "Paul Dupuis",
                photo: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
              },
              date: "2023-10-02",
              service_name: "Réparation",
              rate: 3,
              review : null,
            },
          ],
          totalRows: 2,
        };

        setServices(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique", error);
      }
    };

    fetchServices();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Historique des services</h1>
      <DataTable
        key={`${pageIndex}-${pageSize}`}
        data={services}
      />
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
