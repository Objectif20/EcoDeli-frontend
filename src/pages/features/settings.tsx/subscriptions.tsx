"use client";

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import type { RootState } from "@/redux/store";
import type React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionDataTable } from "@/components/features/settings/subscriptions/data-tables";
import { useTranslation } from 'react-i18next';
import { SubscriptionDialogWrapper } from "@/components/features/settings/subscriptions/dialog";
import { Button } from "@/components/ui/button";
import { ProfileAPI, UserSubscriptionData } from "@/api/profile.api";
import { RegisterApi, Plan } from "@/api/register.api";

const SubscriptionSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);
  const [userSubscriptionData, setUserSubscriptionData] = useState<UserSubscriptionData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);

  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isMerchant = user?.profile.includes("MERCHANT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");

  const handlePlanChange = async (planId: number, paymentMethodId?: string) => {
    try {
      if (userSubscriptionData?.customer_stripe_id) {
        await ProfileAPI.updateMySubscription(planId);
      } else {
        await ProfileAPI.updateMySubscription(planId, paymentMethodId);
      }

      const updatedData = await ProfileAPI.getMySubscription();
      setUserSubscriptionData(updatedData);
    } catch (error) {
      console.error("Échec du changement de plan", error);
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await RegisterApi.getPlan();
      const mockPlans: Plan[] = await response;
      setPlans(mockPlans);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const updateToFreePlan = async () => {
    const freePlan = plans.find(plan => Number(plan.price) === 0);
    if (freePlan) {
      try {
        await ProfileAPI.updateMySubscription(freePlan.plan_id);
        const updatedData = await ProfileAPI.getMySubscription();
        setUserSubscriptionData(updatedData);
      } catch (error) {
        console.error("Failed to update to free plan", error);
      }
    }
  };

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t('client.pages.office.settings.subscriptions.breadcrumbHome'), t('client.pages.office.settings.subscriptions.breadcrumbSettings'), t('client.pages.office.settings.subscriptions.breadcrumbSubscriptions')],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await ProfileAPI.getMySubscription();
        setUserSubscriptionData(data);
      } catch (error) {
        console.error("Failed to fetch subscription data", error);
      }
    };

    fetchSubscription();
    fetchPlans();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t('client.pages.office.settings.subscriptions.title')}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">{t('client.pages.office.settings.subscriptions.generalSettings')}</Link>
          <Link to="/office/profile">{t('client.pages.office.settings.subscriptions.profile')}</Link>
          <Link to="/office/privacy">{t('client.pages.office.settings.subscriptions.privacy')}</Link>
          <Link to="/office/contact-details">{t('client.pages.office.settings.subscriptions.contactDetails')}</Link>
          {(isMerchant || isClient) && (
            <Link to="/office/subscriptions" className="font-semibold text-primary active-link">
              {t('client.pages.office.settings.subscriptions.subscriptions')}
            </Link>
          )}
          {(isProvider || isDeliveryman) && <Link to="/office/billing-settings">{t('client.pages.office.settings.subscriptions.billing')}</Link>}
          <Link to="/office/reports">{t('client.pages.office.settings.subscriptions.reports')}</Link>
        </nav>
        <div className="grid gap-6">
          <h1 className="text-2xl font-semibold">{t('client.pages.office.settings.subscriptions.yourSubscription')}</h1>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">
                  {t('client.pages.office.settings.subscriptions.currentSubscription')} <span className="text-primary">{userSubscriptionData?.plan?.name}</span>
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-primary">
                  {userSubscriptionData?.plan?.price} <span className="text-sm font-normal text-muted-foreground">/mois</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.discountOnShipping')}</span>
                    <span className="font-medium">{userSubscriptionData?.plan?.shipping_discount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.priorityShipping')}</span>
                    <span className="font-medium">{userSubscriptionData?.plan?.priority_shipping_percentage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.permanentDiscount')}</span>
                    <span className="font-medium">{userSubscriptionData?.plan?.permanent_discount_percentage}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{t('client.pages.office.settings.subscriptions.whatToDo')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <SubscriptionDialogWrapper onPlanChange={handlePlanChange} stripe_account={userSubscriptionData?.customer_stripe_id || false} actualPlan={userSubscriptionData?.plan?.plan_id}>
                      <Button variant="link" className="text-primary p-0 h-auto hover:underline">
                        {t("client.pages.office.settings.subscriptions.changePlan")}
                      </Button>
                    </SubscriptionDialogWrapper>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    {Number(userSubscriptionData?.plan?.price ?? 0) > 0 && (
                      <Button onClick={updateToFreePlan} variant={"link"} className="text-primary p-0 h-auto hover:underline">
                        {t('client.pages.office.settings.subscriptions.cancelSubscription')}
                      </Button>
                    )}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <SubscriptionDataTable subscriptions={userSubscriptionData?.history || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
