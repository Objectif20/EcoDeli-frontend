import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/services/client/my-reviews";
import { Review, ServiceApi } from "@/api/service.api";

export default function MyServiceReviews() {
  const dispatch = useDispatch();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10); 
  const [totalItems, setTotalItems] = useState(0); 

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Prestations", "Mes avis"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await ServiceApi.getMyServiceReviewsAsClient(pageIndex + 1, pageSize);
        
        setReviews(response.data);
        setTotalItems(response.totalRows);
      } catch (error) {
        console.error("Erreur lors de la récupération des avis", error);
      }
    };

    fetchReviews();
  }, [pageIndex, pageSize]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Mes avis</h1>
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
