"use client"

import { Button } from "@/components/ui/button"
import { setBreadcrumb } from "@/redux/slices/breadcrumbSlice"
import type { RootState } from "@/redux/store"
import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const PrivacySettings: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState & { user: { user: any } }) => state.user.user);

  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isMerchant = user?.profile.includes("MERCHANT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");

  useEffect(() => {
    dispatch(
      setBreadcrumb({
        segments: [t("client.pages.office.settings.confidentiality.home"), t("client.pages.office.settings.confidentiality.settings"), t("client.pages.office.settings.confidentiality.privacy")],
        links: ["/office/dashboard"],
      }),
    );
  }, [dispatch, t]);

  return (
    <div className="flex flex-col gap-8">
      <div className="mx-auto grid w-full max-w-6xl gap-2">
        <h1 className="text-3xl font-semibold">{t("client.pages.office.settings.confidentiality.privacy")}</h1>
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className="grid gap-4 text-sm text-muted-foreground">
          <Link to="/office/general-settings">{t("client.pages.office.settings.confidentiality.generalSettings")}</Link>
          <Link to="/office/profile">{t("client.pages.office.settings.confidentiality.profile")}</Link>
          <Link to="/office/privacy" className="font-semibold text-primary active-link">
            {t("client.pages.office.settings.confidentiality.privacy")}
          </Link>
          <Link to="/office/contact-details">{t("client.pages.office.settings.confidentiality.contactDetails")}</Link>
          {(isMerchant || isClient) && <Link to="/office/subscriptions">{t("client.pages.office.settings.confidentiality.subscriptions")}</Link>}
          {(isProvider || isDeliveryman) && <Link to="/office/billing-settings">{t("client.pages.office.settings.confidentiality.billing")}</Link>}
          <Link to="/office/reports">{t("client.pages.office.settings.confidentiality.reports")}</Link>
        </nav>
        <div className="grid gap-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-1">{t("client.pages.office.settings.confidentiality.privacy")}</h2>
              <p className="text-sm text-muted-foreground">{t("client.pages.office.settings.confidentiality.modifyPrivacy")}</p>
              <div className="h-px bg-border my-6"></div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium">{t("client.pages.office.settings.confidentiality.updatePassword")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("client.pages.office.settings.confidentiality.updatePasswordDescription")}
                </p>
              </div>
              <Button className="px-4 py-2 rounded-md text-sm transition-colors">
                {t("client.pages.office.settings.confidentiality.changePassword")}
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <h3 className="text-base font-medium">{t("client.pages.office.settings.confidentiality.downloadData")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("client.pages.office.settings.confidentiality.downloadDataDescription")}
                </p>
              </div>
              <Button className="px-4 py-2 rounded-md text-sm transition-colors">
                {t("client.pages.office.settings.confidentiality.downloadDocument")}
              </Button>
            </div>

            <div className="space-y-4 pt-4">
              <div>
                <h3 className="text-base font-medium">{t("client.pages.office.settings.confidentiality.enable2FA")}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("client.pages.office.settings.confidentiality.enable2FADescription")}
                </p>
              </div>
              <Button className="px-4 py-2 rounded-md text-sm transition-colors">
                {t("client.pages.office.settings.confidentiality.activate2FA")}
              </Button>
            </div>

            <div className="pt-2">
              <p className="text-sm">
                {t("client.pages.office.settings.confidentiality.whatIs2FA")}
                <a href="#" className="text-primary hover:underline">
                  {t("client.pages.office.settings.confidentiality.here")}
                </a>
              </p>
            </div>

            <div className="pt-6">
              <p className="text-sm">
                {t("client.pages.office.settings.confidentiality.accessPrivacyPolicy")}
                <a href="#" className="text-primary hover:underline">
                  {t("client.pages.office.settings.confidentiality.privacyPolicy")}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
