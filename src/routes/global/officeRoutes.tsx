import PrivateProfileRoutes from "@/components/private-profileRoutes";
import { CreateDeliveryPage } from "@/pages/features/deliveries/create/create";
import { DeliveriesPage } from "@/pages/features/deliveries/deliveries";
import ChatPage from "@/pages/features/messaging/chat";
import PlanningPage from "@/pages/features/planning/planning";
import BillingSettings from "@/pages/features/settings.tsx/billings";
import PrivacySettings from "@/pages/features/settings.tsx/confidentiality";
import ContactDetailsSettings from "@/pages/features/settings.tsx/contact-details";
import GeneralSettings from "@/pages/features/settings.tsx/general";
import ProfileSettings from "@/pages/features/settings.tsx/profile";
import ReportSettings from "@/pages/features/settings.tsx/reports";
import SubscriptionSettings from "@/pages/features/settings.tsx/subscriptions";
import React from "react";
import { Routes, Route } from "react-router-dom";

const OfficeRoute: React.FC = () => {
  return (
    <Routes>
      <Route element={<PrivateProfileRoutes requiredProfile="MERCHANT" />}>
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path='deliveries/create' element={<CreateDeliveryPage />} />
        <Route path="ads-history" element={<h1>Ads History</h1>} />
        <Route path="insurance" element={<h1>Insurance</h1>} />
        <Route path="reviews" element={<h1>Reviews</h1>} />
        <Route path="location" element={<h1>Location</h1>} />
        <Route path="billing" element={<h1>Billing</h1>} />
        <Route path="planning" element={<PlanningPage />} />
        <Route path="subscriptions" element={<SubscriptionSettings />} />
      </Route>

      <Route element={<PrivateProfileRoutes requiredProfile="CLIENT" />}>
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path='deliveries/create' element={<CreateDeliveryPage />} />
        <Route path="ads-history" element={<h1>Ads History</h1>} />
        <Route path="insurance" element={<h1>Insurance</h1>} />
        <Route path="reviews" element={<h1>Reviews</h1>} />
        <Route path="location" element={<h1>Location</h1>} />
        <Route path="billing" element={<h1>Billing</h1>} />
        <Route path="planning" element={<PlanningPage />} />
        <Route path="subscriptions" element={<SubscriptionSettings />} />
      </Route>

      <Route element={<PrivateProfileRoutes requiredProfile="PROVIDER" />}>
        <Route path="active-ads-provider" element={<h1>Active Ads Provider</h1>} />
        <Route path="ads-history-provider" element={<h1>Ads History Provider</h1>} />
        <Route path="reviews-provider" element={<h1>Reviews Provider</h1>} />
        <Route path="billing-provider" element={<h1>Billing Provider</h1>} />
        <Route path="planning-provider" element={<h1>Planning Provider</h1>} />
        <Route path="billing-settings" element={<BillingSettings />} />
      </Route>

      <Route element={<PrivateProfileRoutes requiredProfile="DELIVERYMAN" />}>
        <Route path="planning-and-route" element={<h1>Planning and Route</h1>} />
        <Route path="upcoming-deliveries" element={<h1>Upcoming Deliveries</h1>} />
        <Route path="delivery-history" element={<h1>Delivery History</h1>} />
        <Route path="proofs" element={<h1>Proofs</h1>} />
        <Route path="my-vehicles" element={<h1>My Vehicles</h1>} />
        <Route path="my-invoices" element={<h1>My Invoices</h1>} />
        <Route path="billing-settings" element={<BillingSettings />} />
      </Route>

      <Route path="general-settings" element={<GeneralSettings />} />
      <Route path="profile" element={<ProfileSettings />} />
      <Route path="privacy" element={<PrivacySettings />} />
      <Route path="contact-details" element={<ContactDetailsSettings />} />
      <Route path="reports" element={<ReportSettings />} />
      <Route path="messaging" element={<ChatPage />} />

      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
    </Routes>
  );
};

export default OfficeRoute;
