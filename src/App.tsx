import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/admin/Login";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import NavbarAdmin from "./pages/admin/NavbarAdmin";
import HeroAdmin from "./pages/admin/HeroAdmin";
import AboutAdmin from "./pages/admin/AboutAdmin";
import ServicesAdmin from "./pages/admin/ServicesAdmin";
import HowItWorksAdmin from "./pages/admin/HowItWorksAdmin";
import PricingAdmin from "./pages/admin/PricingAdmin";
import TestimonialsAdmin from "./pages/admin/TestimonialsAdmin";
import FAQAdmin from "./pages/admin/FAQAdmin";
import CTAAdmin from "./pages/admin/CTAAdmin";
import FooterAdmin from "./pages/admin/FooterAdmin";
import WhatsAppAdmin from "./pages/admin/WhatsAppAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="navbar" element={<NavbarAdmin />} />
            <Route path="hero" element={<HeroAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="how-it-works" element={<HowItWorksAdmin />} />
            <Route path="pricing" element={<PricingAdmin />} />
            <Route path="testimonials" element={<TestimonialsAdmin />} />
            <Route path="faq" element={<FAQAdmin />} />
            <Route path="cta" element={<CTAAdmin />} />
            <Route path="footer" element={<FooterAdmin />} />
            <Route path="whatsapp" element={<WhatsAppAdmin />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
