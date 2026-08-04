import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollToTop from "../ui/ScrollToTop";
import PageTitle from "../ui/PageTitle";
import FloatingDots from "../ui/FloatingDots";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-paper relative">
      <FloatingDots />
      <ScrollToTop />
      <PageTitle />
      <Navbar />
      <main id="main-content" className="flex-1 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
