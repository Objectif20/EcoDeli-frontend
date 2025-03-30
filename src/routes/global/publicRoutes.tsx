import { Route, Routes } from "react-router-dom";

export default function PublicRoutes() {

    return (
        <Routes>
            <Route path='/' element={<h1>Home</h1>} />
            <Route path='/about' element={<h1>About</h1>} />
            <Route path='/contact' element={<h1>Contact</h1>} />
            <Route path='/legal-notice' element={<h1>Legal Notice</h1>} />
            <Route path='/privacy-policy' element={<h1>Privacy Policy</h1>} />
            <Route path="/accessibility" element={<h1>Accessibility</h1>} />
            <Route path="/our-teams" element={<h1>Our Teams</h1>} />
            <Route path="/ecology" element={<h1>Ecology</h1>} />
            <Route path="/become-delivery-partner" element={<h1>Become Delivery Partner</h1>} />
            <Route path="/deliveries" element={<h1>Deliveries</h1>} />
            <Route path="/faq" element={<h1>FAQ</h1>} />
            <Route path="/become-provider" element={<h1>Become Provider</h1>} />
            <Route path="/services" element={<h1>Services</h1>} />
        </Routes>
    )
}