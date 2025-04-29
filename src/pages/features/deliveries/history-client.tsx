import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { PaginationControls } from "@/components/pagination-controle";
import { DataTable } from "@/components/features/deliveries/client/history";
import { useTranslation } from 'react-i18next';

interface Delivery {
  id: string;
  deliveryman: {
    id: string;
    name: string;
    photo: string;
  };
  departureDate: string;
  arrivalDate: string;
  departureCity: string;
  arrivalCity: string;
  announcementName: string;
  rate: number | null;
  comment: string | null;
}

export default function HistoryDeliveriesClientPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t('client.pages.office.delivery.deliveryHistory.breadcrumb.home'),
          t('client.pages.office.delivery.deliveryHistory.breadcrumb.deliveries'),
          t('client.pages.office.delivery.deliveryHistory.breadcrumb.deliveryHistory')
        ],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = {
          data: [
            {
              id: "1",
              deliveryman: {
                id: "dm1",
                name: "Jean Dupont",
                photo: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
              },
              departureDate: "2023-10-01",
              arrivalDate: "2023-10-02",
              departureCity: "Paris",
              arrivalCity: "Lyon",
              announcementName: "Livraison de meubles",
              rate: null,
              comment: null,
            },
            {
              id: "2",
              deliveryman: {
                id: "dm2",
                name: "Marie Martin",
                photo: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
              },
              departureDate: "2023-10-03",
              arrivalDate: "2023-10-04",
              departureCity: "Marseille",
              arrivalCity: "Nice",
              announcementName: "Livraison de colis",
              rate: null,
              comment: null,
            },
            // Add more simulated data as needed
          ],
          totalRows: 2,
        };

        setDeliveries(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des livraisons", error);
      }
    };

    fetchDeliveries();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">
        {t('client.pages.office.delivery.deliveryHistory.title')}
      </h1>
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
