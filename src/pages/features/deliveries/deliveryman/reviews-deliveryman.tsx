import { useEffect, useState } from "react";
import { PaginationControls } from "@/components/pagination-controle";
import { useDispatch } from "react-redux";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { DataTable } from "@/components/features/deliveries/deliverman/reviews-deliveryman";

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
  delivery_name: string;
  rate: number;
}

export default function ReviewDeliveryanPage() {
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
        // Simulate fetching data from an API
        const response = {
          data: [
            {
              id: "1",
              content: "Très bonne livraison, je recommande !",
              author: { id: "a1", name: "Jean Dupont", photo: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg" },
              reply: false,
              reply_content: null,
              date: "2023-10-01",
              delivery_name: "Livraison rapide",
              rate: 5,
            },
            {
              id: "2",
              content: "Livraison moyenne, pourrait être améliorée.",
              author: { id: "a2", name: "Marie Martin", photo: "https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg" },
              reply: true,
              reply_content: "Merci pour votre retour, nous allons nous améliorer.",
              date: "2023-10-02",
              delivery_name: "Livraison standard",
              rate: 3,
            },
            // Add more simulated data as needed
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
