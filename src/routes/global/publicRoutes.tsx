import {PublicLayout, PublicNavbar} from "@/components/public/public-layout";
import NotFoundPage from "@/pages/error/404";
import AccessibilityPage from "@/pages/public/accessibility";
import ContactPage from "@/pages/public/contact";
import DeliveriesPage from "@/pages/public/deliveries";
import FAQPage from "@/pages/public/faq";
import LandingPage from "@/pages/public/landing";
import LegalesNotices from "@/pages/public/legales-notices";
import TeamPage from "@/pages/public/our-teams";
import ServicesPage from "@/pages/public/services";
import { Route, Routes } from "react-router-dom";

export default function PublicRoutes() {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/about" element={<h1>About</h1>} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/legal-notice" element={<LegalesNotices />} />
                <Route path="/privacy-policy" element={<h1>Privacy Policy</h1>} />
                <Route path="/accessibility" element={<AccessibilityPage />} />
                <Route path="/our-teams" element={<TeamPage />} />
                <Route path="/ecology" element={<h1>Ecology</h1>} />
                <Route path="/become-delivery-partner" element={<h1>Become Delivery Partner</h1>} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/become-provider" element={<h1>Become Provider</h1>} />
            </Route>
            <Route element={<PublicNavbar />}>
                <Route path="/deliveries" element={<DeliveriesPage />} />
                <Route path="/services" element={<ServicesPage />} />
            </Route>
            <Route path="/*" element={<NotFoundPage />} />
        </Routes>
    );
}
