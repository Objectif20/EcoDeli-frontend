import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateProfileRoutes from "@/components/private-profileRoutes";
import { CreateDeliveryPage } from "@/pages/features/deliveries/create/create";
import { DeliveriesPage } from "@/pages/features/deliveries/deliveries";
import DeliveriesLocationPage from "@/pages/features/deliveries/locations";
import MyReviewsDeliveryPage from "@/pages/features/deliveries/reviews";
import ReviewDeliveryanPage from "@/pages/features/deliveries/deliveryman/reviews-deliveryman";
import AddVehicle from "@/pages/features/deliveries/vehicles/add-vehicle";
import VehicleListPage from "@/pages/features/deliveries/vehicles/my-vehicles";
import DocumentsPage from "@/pages/features/documents/documents";
import ChatPage from "@/pages/features/messaging/chat";
import PlanningPage from "@/pages/features/planning/planning";
import CreateService from "@/pages/features/services/create-services";
import ReviewServicesPage from "@/pages/features/services/services-reviews";
import MyServicesList from "@/pages/features/services/services-list";
import BillingSettings from "@/pages/features/settings.tsx/billings";
import PrivacySettings from "@/pages/features/settings.tsx/confidentiality";
import ContactDetailsSettings from "@/pages/features/settings.tsx/contact-details";
import GeneralSettings from "@/pages/features/settings.tsx/general";
import ProfileSettings from "@/pages/features/settings.tsx/profile";
import ReportSettings from "@/pages/features/settings.tsx/reports";
import SubscriptionSettings from "@/pages/features/settings.tsx/subscriptions";
import { IntroDisclosureDemo } from "@/components/test";
import ProofsPage from "@/pages/features/documents/proofs";
import DeliveryDetailsPage from "@/pages/features/deliveries/delivery-details";
import RegisterDeliveryman from "@/pages/auth/register/deliveryman/register";
import MyDeliveryHistoryPage from "@/pages/features/deliveries/deliveryman/history";
import DeliveryTransporterView from "@/pages/features/deliveries/deliveryman/delivery-details";
import ServiceDetailsPage from "@/pages/features/services/service-details";
import HistoryServices from "@/pages/features/services/client/history-services";
import MyServiceReviews from "@/pages/features/services/client/my-reviews";
import ServiceDetailsPageClient from "@/pages/features/services/client/service-details";

const OfficeRoute: React.FC = () => {
  return (
    <>
      <IntroDisclosureDemo />
      <Routes>
        <Route element={<PrivateProfileRoutes requiredProfile="MERCHANT" requireAuth={false} />}>
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="deliveries/:id" element={<DeliveryDetailsPage />} />
          <Route path='deliveries/create' element={<CreateDeliveryPage />} />
          <Route path="ads-history" element={<h1>Ads History</h1>} />
          <Route path="reviews" element={<MyReviewsDeliveryPage />} />
          <Route path="location" element={<DeliveriesLocationPage />} />
          <Route path="billing" element={<h1>Billing</h1>} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="subscriptions" element={<SubscriptionSettings />} />
        </Route>

        <Route element={<PrivateProfileRoutes requiredProfile="CLIENT" requireAuth={false} />}>
          <Route path="deliveries" element={<DeliveriesPage />} />
          <Route path="deliveries/:id" element={<DeliveryDetailsPage />} />
          <Route path='deliveries/create' element={<CreateDeliveryPage />} />
          <Route path="ads-history" element={<h1>Ads History</h1>} />
          <Route path="insurance" element={<h1>Insurance</h1>} />
          <Route path="reviews" element={<MyReviewsDeliveryPage />} />
          <Route path="location" element={<DeliveriesLocationPage />} />
          <Route path="billing" element={<h1>Billing</h1>} />
          <Route path="planning" element={<PlanningPage />} />
          <Route path="subscriptions" element={<SubscriptionSettings />} />
          <Route path="register-deliveryman" element={<RegisterDeliveryman />} />
          <Route path="services-history" element={<HistoryServices />} />
          <Route path="my-service-reviews" element={<MyServiceReviews />} />
          <Route path="/service/:id" element={<ServiceDetailsPageClient />} />
        </Route>

        <Route element={<PrivateProfileRoutes requiredProfile="PROVIDER" requireAuth={false} />}>
          <Route path="my-services" element={<MyServicesList />} />
          <Route path="ads-history-provider" element={<h1>Ads History Provider</h1>} />
          <Route path="reviews-provider" element={<ReviewServicesPage />} />
          <Route path="billing-provider" element={<h1>Billing Provider</h1>} />
          <Route path="planning-provider" element={<PlanningPage />} />
          <Route path="billing-settings" element={<BillingSettings />} />
          <Route path="/services/create" element={<CreateService />} />
          <Route path="/services/success" element={<h1>Service Created Successfully</h1>} />œ
          <Route path="/proofs" element={<ProofsPage />} />
          <Route path="/services/:id" element={<ServiceDetailsPage />} />
        </Route>

        <Route element={<PrivateProfileRoutes requiredProfile="DELIVERYMAN" requireAuth={false} />}>
          <Route path="planning-and-route" element={<PlanningPage />} />
          <Route path="upcoming-deliveries" element={<h1>Upcoming Deliveries</h1>} />
          <Route path="delivery-history" element={<MyDeliveryHistoryPage />} />
          <Route path="reviews-deliveryman" element={<ReviewDeliveryanPage />} />
          <Route path="deliveries/public/:id" element={<DeliveryTransporterView />} />
          <Route path="proofs" element={<ProofsPage />} />
          <Route path="my-vehicles" element={<VehicleListPage />} />
          <Route path="add-vehicle" element={<AddVehicle />} />
          <Route path="my-invoices" element={<h1>My Invoices</h1>} />
          <Route path="billing-settings" element={<BillingSettings />} />
        </Route>

        <Route path="general-settings" element={<GeneralSettings />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="privacy" element={<PrivacySettings />} />
        <Route path="contact-details" element={<ContactDetailsSettings />} />
        <Route path="reports" element={<ReportSettings />} />
        <Route path="messaging" element={<ChatPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
    </>
  );
};

export default OfficeRoute;
