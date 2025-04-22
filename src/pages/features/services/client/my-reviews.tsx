import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/services/client/my-reviews";

interface Review {
  id: string;
  content: string;
  provider: {
    id: string;
    name: string;
    photo: string;
  };
  date: string;
  service_name: string;
  rate: number;
}

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
        const response = {
          data: [
            {
              id: "1",
              content: "Excellent service, très professionnel !",
              provider: {
                id: "p1",
                name: "Alice Durand",
                photo: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
              },
              date: "2023-10-01",
              service_name: "Nettoyage",
              rate: 5,
            },
            {
              id: "2",
              content: "Service correct, mais pourrait être amélioré.",
              provider: {
                id: "p2",
                name: "Paul Dupuis",
                photo: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg",
              },
              date: "2023-10-02",
              service_name: "Réparation",
              rate: 3,
            },
          ],
          totalRows: 2,
        };

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
      <DataTable
        key={`${pageIndex}-${pageSize}`}
        data={reviews}
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
