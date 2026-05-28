import { createContext, useContext, useState, useCallback } from 'react';
import { BULK_THRESHOLD, getAutoBindingTotal } from './pricing';

const CartContext = createContext(null);

function recompute(item) {
  const base = item.bulkUnitPrice && item.quantity > BULK_THRESHOLD
    ? item.bulkUnitPrice
    : item.baseUnitPrice;
  const unit = typeof item.paperPriceOverride === 'number' ? item.paperPriceOverride : base;
  const bindingTotal = item.includeBinding ? getAutoBindingTotal(item.quantity) : 0;
  return { ...item, unitPrice: unit, bindingTotal, subtotal: unit * item.quantity + bindingTotal };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [note, setNote] = useState('');

  const addItem = useCallback((newItem) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === newItem.id);
      if (existing) {
        const updated = { ...existing, quantity: existing.quantity + newItem.quantity };
        return prev.map(i => i.id === newItem.id ? recompute(updated) : i);
      }
      return [...prev, recompute(newItem)];
    });
  }, []);

  const addQuickItem = useCallback((id, name, price) => {
    setItems(prev => {
      const key = `quick-${id}`;
      const existing = prev.find(i => i.id === key);
      if (existing) {
        const updated = { ...existing, quantity: existing.quantity + 1 };
        return prev.map(i => i.id === key ? recompute(updated) : i);
      }
      const item = {
        id: key, name, quantity: 1,
        baseUnitPrice: price, bulkUnitPrice: null,
        paperPriceOverride: null, includeBinding: false,
        unitPrice: price, bindingTotal: 0, subtotal: price,
      };
      return [...prev, item];
    });
  }, []);

  const changeQty = useCallback((id, action) => {
    setItems(prev => {
      if (action === 'remove') return prev.filter(i => i.id !== id);
      const delta = action === 'increase' ? 1 : -1;
      return prev
        .map(i => i.id === id ? recompute({ ...i, quantity: i.quantity + delta }) : i)
        .filter(i => i.quantity > 0);
    });
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.subtotal, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  const buildWhatsAppMsg = useCallback(() => {
    const lines = items.map(i =>
      `- ${i.name} x${i.quantity}: S/ ${i.subtotal.toFixed(2)}`
    );
    if (note.trim()) lines.push(`\nNota: ${note.trim()}`);
    lines.push(`\nTOTAL: S/ ${total.toFixed(2)}`);
    return encodeURIComponent(`Hola Grafiplot, aquí mi pedido:\n\n${lines.join('\n')}`);
  }, [items, note, total]);

  return (
    <CartContext.Provider value={{ items, note, setNote, addItem, addQuickItem, changeQty, clearCart, total, count, buildWhatsAppMsg }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
