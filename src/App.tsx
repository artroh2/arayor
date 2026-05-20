import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { CookieConsent } from "@/components/layout";
import Index from "./pages/Index";
import VehicleList from "./pages/VehicleList";
import VehicleDetail from "./pages/VehicleDetail";
import EditorialReviews from "./pages/EditorialReviews";
import EditorialDetail from "./pages/EditorialDetail";
import Compare from "./pages/Compare";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import CommunityPage from "./pages/Community";
import CommunityChat from "./pages/CommunityChat";
import MostPopular from "./pages/MostPopular";
import NewModels from "./pages/NewModels";
import NotFound from "./pages/NotFound";
import Pricing from "./pages/Pricing";
import Finance from "./pages/Finance";
import AdminImageApproval from "./pages/AdminImageApproval";
import AIValuation from "./pages/AIValuation";
import AIVehicleDossier from "./pages/AIVehicleDossier";
import CommandCenter from "./pages/CommandCenter";
import DealershipDashboard from "./pages/DealershipDashboard";
import Kurumsal from "./pages/Kurumsal";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
      <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <CompareProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/araclar" element={<VehicleList />} />
              <Route path="/arac/:id" element={<VehicleDetail />} />
              <Route path="/incelemeler" element={<EditorialReviews />} />
              <Route path="/inceleme/:slug" element={<EditorialDetail />} />
              <Route path="/karsilastir" element={<Compare />} />
              <Route path="/komunite" element={<CommunityPage />} />
              <Route path="/komunite/:id" element={<CommunityChat />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/premium" element={<Pricing />} />
              <Route path="/finans" element={<Finance />} />
              <Route path="/en-populer" element={<MostPopular />} />
              <Route path="/yeni-modeller" element={<NewModels />} />
              <Route path="/admin/fotograf-onay" element={<AdminImageApproval />} />
              <Route path="/degerleme" element={<AIValuation />} />
              <Route path="/dosya/:id" element={<AIVehicleDossier />} />
              <Route path="/komut-merkezi" element={<CommandCenter />} />
              <Route path="/bayi" element={<DealershipDashboard />} />
              <Route path="/kurumsal" element={<Kurumsal />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsent />
          </BrowserRouter>
        </TooltipProvider>
      </CompareProvider>
    </LanguageProvider>
  </QueryClientProvider>
      </AuthProvider>
);

export default App;
