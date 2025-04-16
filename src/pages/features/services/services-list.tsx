import { ServiceApi } from "@/api/service.api";
import { DataTable } from "@/components/features/services/my-services";
import { PaginationControls } from "@/components/pagination-controle";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MyServicesList() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [services, setServices] = useState([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Mes prestations"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ServiceApi.getMyServices(pageSize, pageIndex + 1);
        setServices(response.data.data || []);
        setTotalItems(response.data?.total || 0);
      } catch (error) {
        console.error("Erreur lors de la récupération des services :", error);
      }
    };

    fetchServices();
  }, [pageIndex, pageSize]);

  return (
    <>
      <Button
        onClick={() => navigate("/office/services/create")}
        className="w-fit"
      >
        Ajouter une nouvelle prestation
      </Button>
  
      <h1 className="text-2xl font-semibold mb-4">Mes services sur EcoDeli</h1>
  
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
