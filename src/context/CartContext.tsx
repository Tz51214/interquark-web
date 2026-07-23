import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { trackAddToCart } from "../lib/analytics";

export interface CartItem {
  cartId: string;
  name: string;
  sku: string;
  tier: string;
  price: number;
  features?: string[];
}

interface CartContextValue {
  items: CartItem[];
  total: number;
  addItem: (item: Omit<CartItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "interquark_cart";

function loadCart(): CartItem[] {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as CartItem[]) : [];
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const persist = (next: CartItem[]) => {
    setItems(next);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addItem = useCallback((item: Omit<CartItem, "cartId">) => {
    setItems((prev) => {
      const next = [...prev, { ...item, cartId: `${Date.now()}-${Math.random()}` }];
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    trackAddToCart({ name: item.name, sku: item.sku, tier: item.tier, price: item.price });
  }, []);

  const removeItem = useCallback((cartId: string) => {
    setItems((prev) => {
      const next = prev.filter((c) => c.cartId !== cartId);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => persist([]), []);

  const total = items.reduce((sum, c) => sum + c.price, 0);

  return (
    <CartContext.Provider value={{ items, total, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
