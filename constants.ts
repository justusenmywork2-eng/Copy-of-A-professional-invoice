
import { InvoiceData } from './types';

export const DEFAULT_SERVICES = [
  { label: 'ফটোকপি', price: 3 },
  { label: 'পাসপোর্ট সাইজ ছবি', price: 10 },
  { label: 'আরজিবি প্রিন্ট', price: 10 },
  { label: 'স্ক্যান কপি', price: 10 },
  { label: 'ডকুমেন্ট এডিট', price: 20 },
  { label: 'দলিল প্রিন্ট', price: 50 },
];

export const INITIAL_INVOICE_DATA: InvoiceData = {
  company: {
    name: 'আপনার কোম্পানির নাম',
    address: 'দোকান নং ১২, মেইন রোড, ঢাকা',
    phone: '০১৭০০-০০০০০০',
    email: 'info@business.com',
  },
  customer: {
    name: '',
    address: '',
    mobile: '',
  },
  invoiceNumber: 'INV-' + Math.floor(1000 + Math.random() * 9000),
  invoiceDate: new Date().toISOString().split('T')[0],
  items: [
    { id: '1', description: 'ফটোকপি', quantity: 1, unitPrice: 3 }
  ],
  discount: 0,
  terms: '১. পন্য বুঝে নেওয়ার পর কোনো অভিযোগ গ্রহণ করা হবে না।\n২. অগ্রিম টাকা ফেরতযোগ্য নয়।',
};
