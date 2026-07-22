import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerOverview from "./pages/customer/Overview";
import CustomerOrders from "./pages/customer/Orders";
import CustomerInvoices from "./pages/customer/Invoices";
import CustomerProjects from "./pages/customer/CustomerProjects";
import FreelancerLayout from "./pages/freelancer/FreelancerLayout";
import FreelancerOverview from "./pages/freelancer/Overview";
import FreelancerMembership from "./pages/freelancer/Membership";
import FreelancerBilling from "./pages/freelancer/Billing";
import FreelancerPayouts from "./pages/freelancer/Payouts";
import FreelancerProjects from "./pages/freelancer/FreelancerProjects";
import Subscribe from "./pages/Subscribe";
import Admin from "./pages/Admin";
import ServiceDetail from "./pages/ServiceDetail";
import CustomCursor from "./components/CustomCursor";
import CookieBanner from "./components/CookieBanner";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import PaypalReturn from "./pages/PaypalReturn";
import ErrorBoundary from "./components/ErrorBoundary";
import HashScroll from "./components/HashScroll";
import About from "./pages/About";
import HelpCenter from "./pages/HelpCenter";
import Careers from "./pages/Careers";
import Guide from "./pages/Guide";

function App() {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <CustomCursor />
          <BrowserRouter>
            <HashScroll />
            <CookieBanner />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerOverview />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="invoices" element={<CustomerInvoices />} />
                <Route path="projects" element={<CustomerProjects />} />
              </Route>
              <Route path="/freelancer" element={<FreelancerLayout />}>
                <Route index element={<FreelancerOverview />} />
                <Route path="membership" element={<FreelancerMembership />} />
                <Route path="billing" element={<FreelancerBilling />} />
                <Route path="payouts" element={<FreelancerPayouts />} />
                <Route path="projects" element={<FreelancerProjects />} />
              </Route>
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/about" element={<About />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/paypal/return" element={<PaypalReturn />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
