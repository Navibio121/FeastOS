import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  tableId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setTableId: (id: string | null) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      tableId: null,
      addItem: (newItem) => {
        const existingItem = get().items.find((item) => item.id === newItem.id);
        if (existingItem) {
          set({
            items: get().items.map((item) =>
              item.id === newItem.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...get().items, { ...newItem, quantity: 1 }] });
        }
      },
      removeItem: (id) =>
        set({ items: get().items.filter((item) => item.id !== id) }),
      updateQuantity: (id, quantity) =>
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }),
      setTableId: (id) => set({ tableId: id }),
      clearCart: () => set({ items: [], tableId: null }),
      getTotal: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    {
      name: 'feast-os-cart',
    }
  )
);
