
export const formatCurrency = (amount: number): string => {
  return `৳ ${Math.round(amount).toLocaleString('bn-BD')}`;
};

export const calculateItemTotal = (item: { quantity: number; unitPrice: number; discount?: number }): number => {
  const sub = item.quantity * item.unitPrice;
  return Math.max(0, sub - (item.discount || 0));
};

export const calculateSubtotal = (items: { quantity: number; unitPrice: number; discount?: number }[]): number => {
  return items.reduce((acc, item) => acc + calculateItemTotal(item), 0);
};

export const generateId = () => Math.random().toString(36).substr(2, 9);
