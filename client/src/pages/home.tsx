import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import MenuExplorer from "@/components/menu-explorer";
import TruckLocator from "@/components/truck-locator";
import LoyaltyProgram from "@/components/loyalty-program";
import MembershipPlans from "@/components/membership-plans";
import Testimonials from "@/components/testimonials";
import CSRSection from "@/components/csr-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <MenuExplorer />
      <TruckLocator />
      <LoyaltyProgram />
      <MembershipPlans />
      <Testimonials />
      <CSRSection />
      <Footer />
    </div>
  );
}
