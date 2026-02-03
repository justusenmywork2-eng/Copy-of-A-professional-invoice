
export const formatCurrency = (amount: number): string => {
  // Use English locale (en-US) to ensure numbers are in English digits
  return `৳ ${Math.round(amount).toLocaleString('en-US')}`;
};

export const calculateItemTotal = (item: { quantity: number; unitPrice: number; discount?: number }): number => {
  const sub = item.quantity * item.unitPrice;
  return Math.max(0, sub - (item.discount || 0));
};

export const calculateSubtotal = (items: { quantity: number; unitPrice: number; discount?: number }[]): number => {
  return items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
