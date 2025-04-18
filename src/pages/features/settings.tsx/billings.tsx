import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Elements,
  useStripe,
  useElements,
  IbanElement,
} from "@stripe/react-stripe-js";

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import { RootState } from "@/redux/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionDataTable } from "@/components/features/settings/subscriptions/data-tables";
import stripePromise from "@/config/stripeConfig";
import { Button } from "@/components/ui/button";

const BankForm = ({ hasBankDetails }: { hasBankDetails: boolean }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const ibanElement = elements.getElement(IbanElement);
    if (!ibanElement) return;

    const holderName = (document.querySelector('input[name="accountHolderName"]') as HTMLInputElement)?.value;

    let clientSecret = null;

    if (hasBankDetails) {
      console.log("🧠 Backend : utilisateur a déjà un compte → on génère un SetupIntent pour mise à jour");
      clientSecret = "seti_XXXXXXX_update";
    } else {
      console.log("🆕 Backend : création d’un compte Stripe + SetupIntent pour nouvel utilisateur");
      console.log("📥 Titulaire du compte :", holderName);
      clientSecret = "seti_YYYYYYY_create";
    }

    const { setupIntent, error } = await stripe.confirmSepaDebitSetup(clientSecret, {
      payment_method: {
        sepa_debit: ibanElement,
        billing_details: {
          name: holderName,
          email: "utilisateur@example.com",
        },
      },
    });

    if (error) {
      console.error("❌ Erreur Stripe :", error);
    } else {
      console.log("✅ Stripe : SetupIntent confirmé !");
      console.log("📩 ID du moyen de paiement à envoyer au backend :", setupIntent.payment_method);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium">IBAN</label>
        <div className="mt-1 border rounded-md px-3 py-2">
          <IbanElement
            options={{ supportedCountries: ["SEPA"] }}
            className="w-full"
          />
        </div>
      </div>
      <Button type="submit">
        {hasBankDetails ? "Mettre à jour l'IBAN" : "Enregistrer mon IBAN"}
      </Button>
    </form>
  );
};

const BillingSettings: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isMerchant = user?.profile.includes("MERCHANT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");

  const hasBankDetails = user?.bankDetails !== null;
  const balance = user?.balance || 0;

  useEffect(() => {
    dispatch(setBreadcrumb({
      segments: ["Accueil", "Paramètres", "Facturations"],
      links: ["/office/dashboard"],
    }));
  }, [dispatch]);

  return (
    <Elements stripe={stripePromise}>
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
                    Solde actuel : <span>{balance}€</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {balance > 0 && hasBankDetails && (
                    <Button>
                      Demander un virement immédiat
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Mettre à jour vos coordonnées bancaires</CardTitle>
                </CardHeader>
                <CardContent>
                  <BankForm hasBankDetails={hasBankDetails} />
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <SubscriptionDataTable />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
};

export default BillingSettings;
