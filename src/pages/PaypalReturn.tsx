import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAuthedFetch } from "../lib/useAuthedFetch";
import { useToast } from "../context/ToastContext";
import { trackPurchase } from "../lib/analytics";

// PayPal redirects here after the user approves (or cancels) payment
// on PayPal's site — for both freelancer subscriptions and customer
// orders. We don't know which flow this is until we try capturing it
// against each endpoint in turn, since PayPal's redirect doesn't tell
// us which one it was.
export default function PaypalReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { ready, token } = useAuth();
  const authedFetch = useAuthedFetch();
  const { showToast } = useToast();
  const [status, setStatus] = useState<"processing" | "error">("processing");

  useEffect(() => {
    if (!ready) return;

    const orderId = searchParams.get("token"); // PayPal names this "token" in its redirect
    const cancelled = searchParams.get("cancelled");

    if (cancelled === "1") {
      showToast("Payment was cancelled.", "error");
      navigate("/subscribe");
      return;
    }

    if (!orderId || !token) {
      setStatus("error");
      return;
    }

    (async () => {
      // Try the subscription capture first — if it 400s (wrong flow),
      // fall back to the customer order capture.
      const subRes = await authedFetch<{ message?: string }>(
        "/payments/paypal/capture-order",
        { method: "POST", body: JSON.stringify({ orderId }) },
      );

      if (subRes.ok) {
        showToast("Subscription activated!", "success");
        navigate("/freelancer/membership");
        return;
      }

      const orderRes = await authedFetch<{
        message?: string;
        orderId?: number;
        totalAmount?: number;
        items?: { name: string; sku: string; tier: string; price: number }[];
      }>("/payments/paypal/order/capture", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      });

      if (orderRes.ok) {
        if (orderRes.data.orderId && orderRes.data.items) {
          trackPurchase({
            transactionId: String(orderRes.data.orderId),
            value: orderRes.data.totalAmount || 0,
            items: orderRes.data.items,
          });
        }
        showToast("Payment successful!", "success");
        navigate("/customer/orders");
        return;
      }

      setStatus("error");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      {status === "processing" ? (
        <>
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-signal" />
          <p className="text-sm text-slate-500">Confirming your payment...</p>
        </>
      ) : (
        <>
          <span className="text-2xl">⚠️</span>
          <h1 className="text-lg font-bold">Something went wrong</h1>
          <p className="text-sm text-slate-500">
            We couldn't confirm your payment. If you were charged, please contact us.
          </p>
        </>
      )}
    </div>
  );
}
