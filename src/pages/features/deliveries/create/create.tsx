import { DeliveriesStepper } from "@/components/features/deliveries/deliveries-stepper";
import { useEffect, useState } from "react";

export function CreateDeliveryPage() {
  const [isCleanupDone, setIsCleanupDone] = useState(false);

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith("package-image-"));
    keys.forEach((key) => localStorage.removeItem(key));
    setIsCleanupDone(true);
  }, []);

  if (!isCleanupDone) {
    return <div></div>; 
  }

  return (
    <div>
      <DeliveriesStepper />
    </div>
  );
}
