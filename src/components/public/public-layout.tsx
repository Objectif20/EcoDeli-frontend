import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";


export function PublicLayout() {
    return (
        <div className="flex flex-col">
            <div className="flex-grow">
                <Navbar />
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export function PublicNavbar() {
    return (
        <div className="flex flex-col">
            <div className="flex-grow">
                <Navbar />
                <Outlet />
            </div>
        </div>
    )
}