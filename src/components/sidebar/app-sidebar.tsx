import React from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  Settings,
  GalleryVerticalEnd,
  ShoppingCart,
  HelpCircle,
  Calendar,
  MessageSquare,
  ExternalLink,
  FileText,
  Truck,
  Car,
  Receipt,
  Package,
  FileArchive,
} from "lucide-react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardTitle,
  InfoCardDescription,
  InfoCardFooter,
  InfoCardDismiss,
  InfoCardAction,
} from "@/components/ui/info-card";
import { useSelector } from "react-redux";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import { TeamSwitcher } from "@/components/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { RootState } from "@/redux/store";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const userData = {
    name: `${user?.first_name} ${user?.last_name}`,
    email: user?.email || "",
    avatar: user?.photo || `${user?.first_name?.charAt(0) || ""}${user?.last_name?.charAt(0) || ""}`,
  };

  const {
    open,
  } = useSidebar()

  const isMerchant = user?.profile.includes("MERCHANT");
  const isProvider = user?.profile.includes("PROVIDER");
  const isClient = user?.profile.includes("CLIENT");
  const isDeliveryman = user?.profile.includes("DELIVERYMAN");

  const data = {
    user: userData,
    teams: [
      {
        name: "EcoDeli",
        logo: GalleryVerticalEnd,
        plan: user?.planName || "",
      },
    ],
    navMain: [
      ...(isMerchant ? [
        {
          title: t("client.components.sidebar.merchantSpace"),
          url: "#",
          icon: ShoppingCart,
          items: [
            {
              title: t("client.components.sidebar.myAds"),
              url: "#",
              icon: ShoppingCart,
              items: [
                { title: t("client.components.sidebar.activeAds"), url: "/office/deliveries" },
                { title: t("client.components.sidebar.history"), url: "/office/ads-history" },
                { title: t("client.components.sidebar.reviews"), url: "/office/reviews" },
                { title: t("client.components.sidebar.location"), url: "/office/location" },
              ],
            },
            {
              title: t("client.components.sidebar.billing"),
              url: "/office/billing",
              icon: Receipt,
            },
            {
              title: t("client.components.sidebar.planning"),
              url: "/office/planning",
              icon: Calendar,
            },
          ],
        }
      ] : []),
      ...(isClient ? [
        {
          title: t("client.components.sidebar.individualSpace"),
          url: "#",
          icon: Users,
          items: [
            {
              title: t("client.components.sidebar.myAds"),
              url: "#",
              icon: ShoppingCart,
              items: [
                { title: t("client.components.sidebar.activeAds"), url: "/office/deliveries"},
                { title: t("client.components.sidebar.history"), url: "/office/ads-history" },
                { title: t("client.components.sidebar.reviews"), url: "/office/reviews" },
                { title: t("client.components.sidebar.location"), url: "/office/location" },
              ],
            },
            {
              title: t("client.components.sidebar.billing"),
              url: "/office/billing",
              icon: Receipt,
            },
            {
              title: t("client.components.sidebar.planning"),
              url: "/office/planning",
              icon: Calendar,
            },
          ],
        }
      ] : []),
      ...(isProvider ? [
        {
          title: t("client.components.sidebar.serviceSpace"),
          url: "#",
          icon: HelpCircle,
          items: [
            {
              title: t("client.components.sidebar.myAds"),
              url: "#",
              icon: ShoppingCart,
              items: [
                { title: t("client.components.sidebar.activeAds"), url: "/office/my-services" },
                { title: t("client.components.sidebar.history"), url: "/office/ads-history-provider" },
                { title: t("client.components.sidebar.reviews"), url: "/office/reviews-provider" },
              ],
            },
            {
              title: t("client.components.sidebar.billing"),
              url: "/office/billing-provider",
              icon: Receipt,
            },
            {
              title: t("client.components.sidebar.planning"),
              url: "/office/planning-provider",
              icon: Calendar,
            },
            {
              title: t("client.components.sidebar.proofs"),
              url: "/office/proofs",
              icon: FileText,
            },
          ],
        }
      ] : []),
      ...(isDeliveryman ? [
        {
          title: t("client.components.sidebar.deliverySpace"),
          url: "#",
          icon: Truck,
          items: [
            {
              title: t("client.components.sidebar.planningAndRoute"),
              url: "/office/planning-and-route",
              icon: Calendar,
            },
            {
              title: t("client.components.sidebar.deliveries"),
              url: "#",
              icon: Package,
              items: [
                { title: t("client.components.sidebar.upcomingDeliveries"), url: "/office/upcoming-deliveries" },
                { title: t("client.components.sidebar.deliveryHistory"), url: "/office/delivery-history" },
                { title: t("client.components.sidebar.deliveryReviews"), url: "/office/reviews-deliveryman" },
              ],
            },
            {
              title: t("client.components.sidebar.proofs"),
              url: "/office/proofs",
              icon: FileText,
            },
            {
              title: t("client.components.sidebar.myVehicles"),
              url: "/office/my-vehicles",
              icon: Car,
            },
            {
              title: t("client.components.sidebar.myInvoices"),
              url: "/office/my-invoices",
              icon: Receipt,
            },
          ],
        }
      ] : []),
      {
        title: t("client.components.sidebar.general"),
        url: "#",
        icon: Settings,
        items: [
          {
            title: t("client.components.sidebar.settings"),
            url: "#",
            icon: Settings,
            items: [
              { title: t("client.components.sidebar.general"), url: "/office/general-settings" },
              { title: t("client.components.sidebar.profile"), url: "/office/profile" },
              { title: t("client.components.sidebar.privacy"), url: "/office/privacy" },
              { title: t("client.components.sidebar.contactDetails"), url: "/office/contact-details" },
              ...((isMerchant || isClient) ? [{ title: t("client.components.sidebar.subscriptions"), url: "/office/subscriptions" }] : []),
              ...(isProvider ? [{ title: t("client.components.sidebar.billingSettings"), url: "/office/billing-settings" }] : []),
              { title: t("client.components.sidebar.reports"), url: "/office/reports" },
            ],
          },
          {
            title: t("client.components.sidebar.messaging"),
            url: "/office/messaging",
            icon: MessageSquare,
          },
          {
            title: t("client.components.sidebar.documentPage"),
            url: "/office/documents",
            icon: FileArchive,
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      
      <ScrollArea className="h-full">
        <SidebarContent>
          {
            isClient && !isDeliveryman && (
              <div className="mx-4">
                <Button className="w-full" onClick={() => navigate("/office/register-deliveryman")}>
                  {t("client.components.sidebar.becomeDeliveryman")}
                </Button>
              </div>
            )
          }
          {data.navMain.map((nav, index) => (
            <NavMain key={index} items={nav.items} title={nav.title} />
          ))}
        </SidebarContent>
      </ScrollArea>
          {isClient && !isDeliveryman && open && (
              <InfoCard className="mx-4 hidden lg:block">
              <InfoCardContent>
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-[14px] h-[14px]  rounded-full animate-ping" />
                  <div className="absolute -top-4 -right-4 w-[14px] h-[14px]  rounded-full" />
                  <InfoCardTitle>{t("client.components.sidebar.becomeDeliveryman")}</InfoCardTitle>
                  <InfoCardDescription>
                    {t("client.components.sidebar.becomeDeliverymanDescription")}
                  </InfoCardDescription>
                  <InfoCardFooter>
                    <InfoCardDismiss>{t("client.components.sidebar.close")}</InfoCardDismiss>
                    <InfoCardAction>
                      <Link
                        to="#"
                        className="flex flex-row items-center gap-1 underline"
                      >
                        {t("client.components.sidebar.learnMore")} <ExternalLink size={12} />
                      </Link>
                    </InfoCardAction>
                  </InfoCardFooter>
                </div>
              </InfoCardContent>
            </InfoCard>
      ) }
      <SidebarFooter>

        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
