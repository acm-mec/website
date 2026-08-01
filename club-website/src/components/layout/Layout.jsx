import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";
import PageTitle from "../ui/PageTitle";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper">
      <ScrollToTop />
      <PageTitle />
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
