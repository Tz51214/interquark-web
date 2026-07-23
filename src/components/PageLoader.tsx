import { useState, useEffect } from "react";
import logo from "../assets/interquark-wordmark-navy.png";

const SESSION_KEY = "interquark_intro_shown";

// A brief branded intro shown once per browser session (not on every
// page navigation) — logo scales/fades in, holds briefly, then fades
// out to reveal the actual site underneath.
export default function PageLoader() {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    setVisible(true);
    sessionStorage.setItem(SESSION_KEY, "true");

    const fadeTimer = setTimeout(() => setFadingOut(true), 700);
    const hideTimer = setTimeout(() => setVisible(false), 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-paper transition-opacity duration-300"
      style={{ opacity: fadingOut ? 0 : 1 }}
    >
      <img
        src={logo}
        alt="Interquark"
        className="h-8 w-auto animate-[fadeInScale_0.6s_ease-out]"
      />
    </div>
  );
}
