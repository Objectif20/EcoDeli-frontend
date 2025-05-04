"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { IntroDisclosure } from "@/components/ui/intro-disclosure"
import { UserApi } from "@/api/user.api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const steps = [
  {
    title: "Devenir Partenaire Livreur",
    short_description: "Commencez votre parcours en tant que partenaire livreur avec nous.",
    full_description:
      "Rejoignez notre équipe de partenaires livreurs et profitez d'horaires flexibles et d'une rémunération compétitive. Inscrivez-vous dès aujourd'hui et commencez à livrer en toute simplicité.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Devenir partenaire livreur",
    },
  },
  {
    title: "Compléter Votre Profil",
    short_description: "Remplissez votre profil avec les détails nécessaires.",
    full_description:
      "Assurez-vous que votre profil est complet avec des informations précises. Cela inclut vos coordonnées, les informations sur votre véhicule et vos disponibilités.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Compléter votre profil",
    },
    action: {
      label: "Mettre à Jour le Profil",
      href: "/profil/mettre-a-jour",
    },
  },
  {
    title: "Accepter les Demandes de Livraison",
    short_description: "Commencez à accepter les demandes de livraison dans votre zone.",
    full_description:
      "Une fois votre profil complet, vous pouvez commencer à accepter les demandes de livraison. Utilisez notre application pour voir les livraisons disponibles et accepter celles qui correspondent à votre emploi du temps.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Accepter les demandes de livraison",
    },
  },
  {
    title: "Récupérer le Colis",
    short_description: "Récupérez le colis à l'emplacement désigné.",
    full_description:
      "Utilisez l'application pour vous rendre au lieu de récupération. Assurez-vous d'avoir le bon colis et scannez-le avec l'application avant de partir.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Récupérer le colis",
    },
  },
  {
    title: "Livrer le Colis",
    short_description: "Livrez le colis au destinataire.",
    full_description:
      "Suivez les indications de l'application pour vous rendre au lieu de livraison. Assurez-vous que le colis est livré en toute sécurité et obtenez une signature ou une confirmation photo si nécessaire.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Livrer le colis",
    },
  },
  {
    title: "Finaliser la Livraison",
    short_description: "Marquez la livraison comme terminée dans l'application.",
    full_description:
      "Une fois le colis livré, marquez la livraison comme terminée dans l'application. Vous pouvez également laisser un retour sur votre expérience.",
    media: {
      type: "image" as const,
      src: "https://www.bmjelec.com/wp-content/uploads/2019/08/livraison.jpg",
      alt: "Finaliser la livraison",
    },
    action: {
      label: "Voir l'Historique des Livraisons",
      href: "/livraisons/historique",
    },
  },
];

export function IntroDisclosureDemo() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);
  
    const checkFirstLogin = async () => {
      try {
        const isFirstLogin = await UserApi.isFirstLogin();
        if (!isFirstLogin && user?.profile.includes("CLIENT")) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      } catch (error) {
        console.error("Erreur lors du check first login", error);
      }
    };
  
    checkFirstLogin();
  
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div>
      {open && (
        <IntroDisclosure
        open={open}
        setOpen={setOpen}
        steps={steps}
        featureId={isMobile ? "intro-demo-mobile" : "intro-demo"}
        onSkip={() => toast.info("Tour skipped")}
        forceVariant={isMobile ? "mobile" : undefined}
      />
      )}
        
    </div>
  )
}
