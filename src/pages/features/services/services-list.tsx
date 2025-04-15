import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function MyServicesList () {

    const navigate = useNavigate();

    const dispatch = useDispatch();

  
    useEffect(() => {
      dispatch(
        setBreadcrumb({
          segments: ["Accueil", "Mes prestations"],
          links: ["/office/dashboard"],
        })
      );
    }, [dispatch]);

    return (
        <>
        
            <Button onClick={() => navigate("/office/services/create")}>Ajouter une nouvelle prestation</Button>
        
        </>
    )



}