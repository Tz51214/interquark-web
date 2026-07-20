import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import SiteFooter from "../components/layout/SiteFooter";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <span className="mb-3 font-mono text-sm text-signal">404</span>
        <h1 className="mb-4 font-display text-3xl font-bold text-ink">Page not found</h1>
        <p className="mb-8 max-w-md font-body text-sm text-slate-500">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <Link to="/">
          <Button>Back to homepage</Button>
        </Link>
      </div>
      <SiteFooter />
    </div>
  );
}
