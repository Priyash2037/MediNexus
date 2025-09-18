import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { LanguageProvider } from "./contexts/LanguageContext";
import TelemedicineLanding from "./pages/TelemedicineLanding";
import HowItWorksPage from "./pages/HowItWorksPage";
import BenefitsPage from "./pages/BenefitsPage";
import ContactPage from "./pages/ContactPage";
import PatientLogin from "./pages/PatientLogin";
import DoctorLogin from "./pages/DoctorLogin";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import VideoCall from "./pages/VideoCall";
import ChatBot from "./pages/ChatBot";
import NotFound from "./pages/NotFound";
import "./styles/responsive.css";

const queryClient = new QueryClient();

const App = () => (
  <LanguageProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <Layout>
                <TelemedicineLanding />
              </Layout>
            } />
            <Route path="/how-it-works" element={
              <Layout>
                <HowItWorksPage />
              </Layout>
            } />
            <Route path="/benefits" element={
              <Layout>
                <BenefitsPage />
              </Layout>
            } />
            <Route path="/contact" element={
              <Layout>
                <ContactPage />
              </Layout>
            } />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
          <Route path="/about" element={
            <Layout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-4">About Us</h1>
                  <p className="text-xl text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </Layout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
