import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/services/services-reviews";
import { ServiceApi } from "@/api/service.api";


interface Review {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    photo: string;
  };
  reply: boolean;
  reply_content: string | null;
  date: string;
  services_name: string;
  rate: number;
}

export default function ReviewServicesPage() {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Avis"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await ServiceApi.getProviderReviews(pageSize, pageIndex + 1); 
        setReviews(data.data);
        setTotalItems(data.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis", error);
      }
    };

    fetchReviews();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Les avis sur EcoDeli</h1>
      <DataTable key={`${pageIndex}-${pageSize}`} data={reviews} />
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
