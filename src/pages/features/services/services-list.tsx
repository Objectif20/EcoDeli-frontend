import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function MyServicesList () {

    const navigate = useNavigate();

    return (
        <>
        
            <Button onClick={() => navigate("/office/services/create")}>Ajouter une nouvelle prestation</Button>
        
        </>
    )



}