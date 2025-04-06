import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfileSettings: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes('PROVIDER');
  const isClient = user?.profile.includes('CLIENT');
  const isMerchant = user?.profile.includes('MERCHANT');
  const isDeliveryman = user?.profile.includes('DELIVERYMAN');

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: ["Accueil", "Paramètres", "Profil"],
      links: ['/office/dashboard'],
    }));
  }, [dispatch]);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Profil</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">Paramètres généraux</Link>
          <Link to="/office/profile" className="font-semibold text-primary active-link">Profil</Link>
          <Link to="/office/privacy">Confidentialité</Link>
          <Link to="/office/contact-details">Coordonnées</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions">Abonnements</Link>
          )}
          {(isProvider || isDeliveryman) && (
            <Link to="/office/billing-settings">Facturations</Link>
          )}
          <Link to="/office/reports">Signalements</Link>
        </nav>
        <div className="grid gap-6">
          <h1>Contenu du profil</h1>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
