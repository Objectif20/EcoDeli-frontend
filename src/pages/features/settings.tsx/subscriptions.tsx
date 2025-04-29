"use client";

import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice";
import type { RootState } from "@/redux/store";
import type React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SubscriptionDataTable } from "@/components/features/settings/subscriptions/data-tables";
import { useTranslation } from 'react-i18next';

const SubscriptionSettings: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isMerchant = user?.profile.includes("MERCHANT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t('client.pages.office.settings.subscriptions.breadcrumbHome'), t('client.pages.office.settings.subscriptions.breadcrumbSettings'), t('client.pages.office.settings.subscriptions.breadcrumbSubscriptions')],
        links: ["/office/dashboard"],
      })
    );
  }, [dispatch, t]);

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
                  {t('client.pages.office.settings.subscriptions.currentSubscription')} <span className="text-primary">Starter</span>
                </CardTitle>
                <CardDescription className="text-3xl font-bold text-primary">
                  9,99€ <span className="text-sm font-normal text-muted-foreground">/mois</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.discountOnShipping')}</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.priorityShipping')}</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('client.pages.office.settings.subscriptions.permanentDiscount')}</span>
                    <span className="font-medium">3%</span>
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
                    <Link to="/office/subscription-plans" className="text-primary hover:underline">
                      {t('client.pages.office.settings.subscriptions.discoverPlans')}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/office/change-subscription" className="text-primary hover:underline">
                      {t('client.pages.office.settings.subscriptions.changePlan')}
                    </Link>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-primary">•</span>
                    <Link to="/office/cancel-subscription" className="text-primary hover:underline">
                      {t('client.pages.office.settings.subscriptions.cancelSubscription')}
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <SubscriptionDataTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSettings;
