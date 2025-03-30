import { Route, Routes } from "react-router-dom";
import AuthRoutes from "./global/authRoutes";
import NotFoundPage from "@/pages/error/404";
import PublicRoutes from "./global/publicRoutes";


export default function GlobalRoutes() {

    return (
        <Routes>
            <Route path="auth/*" element={<AuthRoutes />} />



            { /*Public routes toujours en dernier */}
            <Route path="/*" element={<PublicRoutes />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}