import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Showcase from "./pages/Showcase";
import Checkout from "./pages/Checkout";
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerOverview from "./pages/customer/Overview";
import CustomerOrders from "./pages/customer/Orders";
import CustomerInvoices from "./pages/customer/Invoices";
import CustomerProjects from "./pages/customer/CustomerProjects";
import CustomerNotifications from "./pages/customer/Notifications";
import CustomerReferrals from "./pages/customer/Referrals";
import FreelancerLayout from "./pages/freelancer/FreelancerLayout";
import FreelancerOverview from "./pages/freelancer/Overview";
import FreelancerMembership from "./pages/freelancer/Membership";
import FreelancerBilling from "./pages/freelancer/Billing";
import FreelancerPayouts from "./pages/freelancer/Payouts";
import FreelancerProjects from "./pages/freelancer/FreelancerProjects";
import FreelancerNotifications from "./pages/freelancer/Notifications";
import FreelancerTasks from "./pages/freelancer/Tasks";
import FreelancerReferrals from "./pages/freelancer/Referrals";
import Subscribe from "./pages/Subscribe";
import Admin from "./pages/Admin";
import ServiceDetail from "./pages/ServiceDetail";
import CustomCursor from "./components/CustomCursor";
import CookieBanner from "./components/CookieBanner";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import PaypalReturn from "./pages/PaypalReturn";
import SaasDevelopment from "./pages/pillars/SaasDevelopment";
import CustomSoftwareDevelopment from "./pages/pillars/CustomSoftwareDevelopment";
import AiDevelopment from "./pages/pillars/AiDevelopment";
import WebApplicationDevelopment from "./pages/pillars/WebApplicationDevelopment";
import MvpDevelopment from "./pages/pillars/MvpDevelopment";
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
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/customer" element={<CustomerLayout />}>
                <Route index element={<CustomerOverview />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="invoices" element={<CustomerInvoices />} />
                <Route path="projects" element={<CustomerProjects />} />
                <Route path="notifications" element={<CustomerNotifications />} />
                <Route path="referrals" element={<CustomerReferrals />} />
              </Route>
              <Route path="/freelancer" element={<FreelancerLayout />}>
                <Route index element={<FreelancerOverview />} />
                <Route path="membership" element={<FreelancerMembership />} />
                <Route path="billing" element={<FreelancerBilling />} />
                <Route path="payouts" element={<FreelancerPayouts />} />
                <Route path="projects" element={<FreelancerProjects />} />
                <Route path="notifications" element={<FreelancerNotifications />} />
                <Route path="tasks" element={<FreelancerTasks />} />
                <Route path="referrals" element={<FreelancerReferrals />} />
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
              <Route path="/saas-development" element={<SaasDevelopment />} />
              <Route path="/custom-software-development" element={<CustomSoftwareDevelopment />} />
              <Route path="/ai-development" element={<AiDevelopment />} />
              <Route path="/web-application-development" element={<WebApplicationDevelopment />} />
              <Route path="/mvp-development" element={<MvpDevelopment />} />
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
