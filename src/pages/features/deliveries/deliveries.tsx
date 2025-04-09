import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


export function DeliveriesPage() {



        const navigate = useNavigate();
        return (
                <>
                    <Button onClick={() => navigate("/office/deliveries/create")}>Créer une demande de livraison</Button>
         
                </>                  
        )
}