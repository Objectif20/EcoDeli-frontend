import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./footer";


export default function PublicLayout() {
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