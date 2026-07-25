// Thin wrapper around gtag — safe to call even if analytics hasn't
// loaded yet (e.g. ad blockers, slow connections) since it checks
// for window.gtag first rather than assuming it exists.
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function trackAddToCart(item: {
  name: string;
  sku: string;
  tier: string;
  price: number;
}) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "add_to_cart", {
    currency: "GBP",
    value: item.price,
    items: [
      {
        item_id: item.sku,
        item_name: item.name,
        item_variant: item.tier,
        price: item.price,
        quantity: 1,
      },
    ],
  });
}

export function trackPurchase(params: {
  transactionId: string;
  value: number;
  items: { name: string; sku: string; tier: string; price: number }[];
}) {
  if (typeof window === "undefined" || !window.gtag) return;

  // GA4 purchase event — powers Analytics ecommerce reports.
  window.gtag("event", "purchase", {
    transaction_id: params.transactionId,
    currency: "GBP",
    value: params.value,
    items: params.items.map((item) => ({
      item_id: item.sku,
      item_name: item.name,
      item_variant: item.tier,
      price: item.price,
      quantity: 1,
    })),
  });

  // Google Ads conversion event — separate from the GA4 purchase event
  // above, this is what actually tells Google Ads a conversion
  // happened, so Performance Max can optimize spend toward it.
  window.gtag("event", "conversion_event_purchase", {
    value: params.value,
    currency: "GBP",
    transaction_id: params.transactionId,
  });
}
