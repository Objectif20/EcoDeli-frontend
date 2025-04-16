import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveries/deliverman/history-table";

interface HistoryDelivery {
  id: string;
  departure_city: string;
  arrival_city: string;
  price: number;
  client: {
    name: string;
    photo_url: string;
  };
  status: string;
}

export default function MyDeliveryHistoryPage() {
  const dispatch = useDispatch();
  const [deliveries, setDeliveries] = useState<HistoryDelivery[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Livraisons", "Historique des livraisons"],
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
              departure_city: "Paris",
              arrival_city: "Lyon",
              price: 150.0,
              client: {
                name: "Alice Dupont",
                photo_url: "https://example.com/alice.jpg",
              },
              status: "Livré",
            },
            {
              id: "2",
              departure_city: "Marseille",
              arrival_city: "Nice",
              price: 100.0,
              client: {
                name: "Bob Martin",
                photo_url: "https://example.com/bob.jpg",
              },
              status: "En cours",
            },
            // Add more simulated data as needed
          ],
          totalRows: 2,
        };

        setDeliveries(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique des livraisons", error);
      }
    };

    fetchDeliveries();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Historique des livraisons</h1>
      <DataTable
        key={`${pageIndex}-${pageSize}`}
        data={deliveries}
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
