import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import AvailabilitySettings from "@/components/features/settings/availibity-settings";

const ContactDetailsSettings: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile?.includes("PROVIDER");
  const isClient = user?.profile?.includes("CLIENT");
  const isMerchant = user?.profile?.includes("MERCHANT");
  const isDeliveryman = user?.profile?.includes("DELIVERYMAN");

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: ["Accueil", "Paramètres", "Coordonnées"],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Coordonnées</h1>
      </div>

      {/* Layout */}
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        {/* Sidebar */}
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">Paramètres généraux</Link>
          <Link to="/office/profile">Profil</Link>
          <Link to="/office/privacy">Confidentialité</Link>
          <Link
            to="/office/contact-details"
            className="font-semibold text-primary active-link"
          >
            Coordonnées
          </Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions">Abonnements</Link>
          )}
          {(isProvider || isDeliveryman) && (
            <Link to="/office/billing-settings">Facturations</Link>
          )}
          <Link to="/office/reports">Signalements</Link>
        </nav>

        {/* Main Content */}
        <div className="grid gap-6">
          <div className="space-y-1">
            <h2 className="text-xl font-medium">Informations de contact</h2>
            <p className="text-sm text-muted-foreground">
              Gérez vos coordonnées et disponibilités.
            </p>
          </div>

          {/* Section Planning : seulement pour les providers */}
          {isProvider && <AvailabilitySettings />}
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsSettings;
