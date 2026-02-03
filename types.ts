
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number; // Added item-specific discount
}

export interface CompanyInfo {
  logo?: string;
  name: string;
  owner: string; // Added owner field
  address: string;
  phone: string;
  email: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  mobile: string;
}

export interface InvoiceData {
  company: CompanyInfo;
  customer: CustomerInfo;
  invoiceNumber: string;
  invoiceDate: string;
  items: LineItem[];
  discount: number;
  terms: string;
  signature?: string;
  showLogo: boolean; // Added toggle for logo visibility
}
