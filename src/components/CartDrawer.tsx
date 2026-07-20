import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t } = useTranslation();
  const { items, total, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-display text-base font-semibold">{t("cart.cart")}</h2>
          <button onClick={onClose} className="text-xl text-slate-400 hover:text-slate-700">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-slate-400">
              {t("checkout.emptyCart")}
              <br />
              Pick a service to get a running estimate.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.cartId} className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <b className="block text-sm">{item.name}</b>
                    <span className="text-xs text-slate-400">
                      {item.sku} — {item.tier}
                    </span>
                    {item.features && item.features.length > 0 && (
                      <ul className="mt-1.5 flex flex-col gap-0.5">
                        {item.features.map((f) => (
                          <li key={f} className="flex items-start gap-1 text-[11px] text-slate-400">
                            <span className="text-mint">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="mt-1.5 block text-xs font-medium text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="whitespace-nowrap font-mono text-sm font-bold text-signal">
                    £{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 px-5 py-4">
          <div className="mb-4 flex items-center justify-between text-base font-bold">
            <span>{t("checkout.total")}</span>
            <span className="font-mono text-signal">£{total.toLocaleString()}</span>
          </div>
          <button
            onClick={() => {
              if (items.length === 0) return;
              onClose();
              navigate("/checkout");
            }}
            disabled={items.length === 0}
            className="w-full rounded-lg bg-signal py-3 text-sm font-semibold text-white hover:bg-signal-dark disabled:opacity-50"
          >
            Go to checkout
          </button>
        </div>
      </div>
    </>
  );
}
