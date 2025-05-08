import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { BillingsData, ProfileAPI } from "@/api/profile.api";
import { BillingsDataTable } from "@/components/features/settings/billings/data-tables";

const BillingSettings: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isMerchant = user?.profile.includes("MERCHANT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");

  const hasBankDetails = true;
  const balance = user?.balance || 2;

  const [stripeAccountValidity, setStripeAccountValidity] = useState({
    valid: false,
    enabled: false,
    needs_id_card: false,
    url_complete: "",
  });

  const [billingsData, setBillingsData] = useState<BillingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: ["Accueil", "Paramètres", "Facturations"],
      links: ["/office/dashboard"],
    }));

    const fetchData = async () => {
      try {
        const billings = await ProfileAPI.getMyBillings();
        setBillingsData(billings);
      } catch (err) {
        console.error("Erreur lors du chargement des facturations :", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchStripeAccountValidity = async () => {
      const response = await ProfileAPI.getStripeAccountValidity();
      if (response.valid && response.enabled && !response.needs_id_card) {
        setStripeAccountValidity({
          valid: true,
          enabled: true,
          needs_id_card: false,
          url_complete: "",
        });
      } else if (response.valid && !response.enabled) {
        setStripeAccountValidity({
          valid: true,
          enabled: false,
          needs_id_card: false,
          url_complete: response.url_complete || "",
        });
      }
    };

    fetchData();
    fetchStripeAccountValidity();
  }, [dispatch]);

  const handleConfigureAccount = async () => {
    const { accountLinkUrl } = await ProfileAPI.createStripeAccount();
    if (accountLinkUrl) {
      window.location.href = accountLinkUrl;
    }
  };

  const handleUpdateAccount = async () => {
    const { accountLinkUrl } = await ProfileAPI.updateStripeAccount();
    if (accountLinkUrl) {
      window.location.href = accountLinkUrl;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">Facturations</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">Paramètres généraux</Link>
          <Link to="/office/profile">Profil</Link>
          <Link to="/office/privacy">Confidentialité</Link>
          <Link to="/office/contact-details">Coordonnées</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions">Abonnements</Link>
          )}
          {(isProvider || isDeliveryman) && (
            <Link to="/office/billing-settings" className="font-semibold text-primary active-link">Facturations</Link>
          )}
          <Link to="/office/reports">Signalements</Link>
        </nav>
        <div className="grid gap-6">
          <h1 className="text-2xl font-semibold">Votre solde</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  Solde actuel : <span>{billingsData?.amount ?? balance}€</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(billingsData?.amount ?? balance) > 0 && hasBankDetails && (
                  <Button>
                    Demander un virement immédiat
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {stripeAccountValidity.valid && stripeAccountValidity.enabled
                    ? "Votre compte Stripe est valide"
                    : "Mettre à jour vos coordonnées bancaires"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stripeAccountValidity.valid && stripeAccountValidity.enabled ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        Mettre à jour mon compte pour virement
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Redirection vers Stripe</DialogTitle>
                        <DialogDescription>
                          Vous allez être redirigé vers la plateforme Stripe pour mettre à jour votre compte.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => console.log("No clicked")}>Non</Button>
                        <Button onClick={handleUpdateAccount}>Oui</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        Configurer mon compte Stripe
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Redirection vers Stripe</DialogTitle>
                        <DialogDescription>
                          Vous allez être redirigé vers la plateforme Stripe pour créer votre compte.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => console.log("No clicked")}>Non</Button>
                        <Button onClick={handleConfigureAccount}>Oui</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            {!loading && billingsData ? (
              <BillingsDataTable billings={billingsData.billings} />
            ) : (
              <p>Chargement des facturations...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingSettings;
