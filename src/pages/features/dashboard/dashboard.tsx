import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import ClientDashboard from "./client";
import DeliveryManDashboard from "./deliveryman";

export default function Dashboard() {
    const user = useSelector((state: RootState) => state.user.user);

    const isMerchant = user?.profile.includes("MERCHANT");
    const isProvider = user?.profile.includes("PROVIDER");
    const isClient = user?.profile.includes("CLIENT");
    const isDeliveryman = user?.profile.includes("DELIVERYMAN");

    const isClientOnly = isClient && !isMerchant && !isProvider;
    const isClientAndDeliveryman = isClientOnly && isDeliveryman;

      const { t } = useTranslation();
      const dispatch = useDispatch();
    
    
      useEffect(() => {
        dispatch(
          setBreadcrumb({
            segments: [t("client.pages.office.myDocuments.home"), "Dashboard"],
            links: ["/office/dashboard"],
          })
        );
      }, [dispatch, t]);

    return (
        <div>
            {isClientAndDeliveryman && (
                <div className="flex justify-center">
                    <Tabs defaultValue="expediteur" className="w-full">
                        <div className="flex justify-center mb-2">
                            <TabsList className="w-fit space-x-2">
                                <TabsTrigger value="expediteur">Expéditeur</TabsTrigger>
                                <TabsTrigger value="transporteur">Transporteur</TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent value="expediteur">
                            <ClientDashboard />
                        </TabsContent>
                        <TabsContent value="transporteur">
                            <DeliveryManDashboard />
                        </TabsContent>
                    </Tabs>
                </div>
            )}

            {!isClientAndDeliveryman && (
                <div className="text-center mt-6">
                    {isMerchant && <p>Bienvenue sur le dashboard du Marchand.</p>}
                    {isProvider && <p>Bienvenue sur le dashboard du Prestataire.</p>}
                    {isClient && !isDeliveryman && <p>Bienvenue sur le dashboard du Client.</p>}
                    {isDeliveryman && !isClientOnly && (
                        <p>Le rôle Transporteur est uniquement accessible si vous êtes uniquement Client.</p>
                    )}
                </div>
            )}
        </div>
    );
}
