import { useEffect } from "react";

// Silently captures a ?ref=CODE URL param into localStorage the first
// time someone visits with one, so it survives navigation and is
// still available whenever they eventually sign up.
export default function ReferralCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("interquark_referral", ref.toUpperCase().trim());
    }
  }, []);

  return null;
}
