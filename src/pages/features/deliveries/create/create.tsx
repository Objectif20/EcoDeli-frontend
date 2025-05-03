import { DeliveriesStepper } from "@/components/features/deliveries/deliveries-stepper";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export function CreateDeliveryPage() {
  const [isCleanupDone, setIsCleanupDone] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("package-image-"));
    keys.forEach((key) => localStorage.removeItem(key));
    setIsCleanupDone(true);
  }, []);

  if (!isCleanupDone) {
    return <div></div>; 
  }


    useEffect(() => {
      dispatch(
        setBreadcrumb({
          segments: ["Accueil", "Livraisons", "Créer une demande de livraison"],
          links: ["/office/dashboard", "/office/deliveries"],
        })
      );
    }, [dispatch]);

  return (
    <div>
      <DeliveriesStepper />
    </div>
  );
}


