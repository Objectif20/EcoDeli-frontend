import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { PaginationControls } from "@/components/pagination-controle";
import { useTranslation } from 'react-i18next';
import { DataTable } from "@/components/features/deliveries/client/shipments";

interface ShipmentRequest {
  id: string;
  name: string;
  departureCity: string;
  arrivalCity: string;
  urgent: boolean;
  nbColis: number;
  nbLivraisons: number;
}

export default function HistoryShipmentRequestsClientPage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [shipmentRequests, setShipmentRequests] = useState<ShipmentRequest[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [
          t('client.pages.office.shipment.shipmentHistory.breadcrumb.home'),
          t('client.pages.office.shipment.shipmentHistory.breadcrumb.shipments'),
          t('client.pages.office.shipment.shipmentHistory.breadcrumb.shipmentHistory')
        ],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchShipmentRequests = async () => {
      try {
        const response = {
          data: [
            {
              id: "1",
              name: "Livraison de meubles",
              departureCity: "Paris",
              arrivalCity: "Lyon",
              urgent: false,
              nbColis: 5,
              nbLivraisons: 1,
            },
            {
              id: "2",
              name: "Livraison de colis",
              departureCity: "Marseille",
              arrivalCity: "Nice",
              urgent: true,
              nbColis: 3,
              nbLivraisons: 2,
            },
          ],
          totalRows: 2,
        };

        setShipmentRequests(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des demandes de livraison", error);
      }
    };

    fetchShipmentRequests();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">
        {t('client.pages.office.shipment.shipmentHistory.title')}
      </h1>
      <DataTable
        key={`${pageIndex}-${pageSize}`}
        data={shipmentRequests}
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