
import React from 'react';
import { Plus, Trash2, X, Zap } from 'lucide-react';
import { InvoiceData, LineItem } from '../types';
import { DEFAULT_SERVICES } from '../constants';
import { generateId } from '../utils';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

export const InvoiceForm: React.FC<Props> = ({ data, onChange }) => {
  const updateCompany = (field: string, value: string) => {
    onChange({ ...data, company: { ...data.company, [field]: value } });
  };

  const updateCustomer = (field: string, value: string) => {
    onChange({ ...data, customer: { ...data.customer, [field]: value } });
  };

  const addItem = (description = '', price = 0) => {
    const newItem: LineItem = { 
      id: generateId(), 
      description: description, 
      quantity: 1, 
      unitPrice: price,
      discount: 0 
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    if (data.items.length > 1) {
      onChange({ ...data, items: data.items.filter(item => item.id !== id) });
    }
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    const newItems = data.items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onChange({ ...data, items: newItems });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'signature') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'logo') {
          onChange({ ...data, company: { ...data.company, logo: reader.result as string } });
        } else {
          onChange({ ...data, signature: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white p-6 shadow-sm rounded-lg space-y-8 overflow-y-auto h-full max-h-[calc(100vh-4rem)]">
      {/* Company Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-800 border-b pb-2 flex items-center justify-between">
          <span>কোম্পানি তথ্য</span>
          {data.company.logo && (
             <button onClick={() => updateCompany('logo', '')} className="text-red-500 text-sm hover:underline flex items-center gap-1">
                <X size={14} /> লোগো মুছুন
             </button>
          )}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">লোগো আপলোড</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileUpload(e, 'logo')} 
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <input
            type="text"
            placeholder="কোম্পানির নাম"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={data.company.name}
            onChange={(e) => updateCompany('name', e.target.value)}
          />
          <textarea
            placeholder="ঠিকানা"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            rows={2}
            value={data.company.address}
            onChange={(e) => updateCompany('address', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="ফোন"
              className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.company.phone}
              onChange={(e) => updateCompany('phone', e.target.value)}
            />
            <input
              type="email"
              placeholder="ইমেইল"
              className="w-full p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.company.email}
              onChange={(e) => updateCompany('email', e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Customer Section */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-blue-800 border-b pb-2">গ্রাহকের তথ্য</h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="গ্রাহকের নাম"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={data.customer.name}
            onChange={(e) => updateCustomer('name', e.target.value)}
          />
          <input
            type="text"
            placeholder="মোবাইল নম্বর"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
            value={data.customer.mobile}
            onChange={(e) => updateCustomer('mobile', e.target.value)}
          />
          <textarea
            placeholder="ঠিকানা"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            rows={2}
            value={data.customer.address}
            onChange={(e) => updateCustomer('address', e.target.value)}
          />
        </div>
      </section>

      {/* Quick Services Bar */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-blue-800 font-semibold border-b pb-2">
            <Zap size={18} fill="currentColor" />
            <h3>দ্রুত সার্ভিস যোগ করুন</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SERVICES.map((s) => (
            <button
              key={s.label}
              onClick={() => addItem(s.label, s.price)}
              className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full text-xs font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              + {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Items Management */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-lg font-semibold text-blue-800">আইটেম লিস্ট</h3>
          <button
            onClick={() => addItem()}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {data.items.map((item, index) => (
            <div key={item.id} className="p-3 border rounded-lg bg-gray-50 space-y-3 relative group">
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <div className="text-xs font-bold text-gray-400">আইটেম #{index + 1}</div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="পন্যের বিবরণ"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">পরিমাণ</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded text-sm bg-white"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500 block mb-0.5">দর (৳)</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded text-sm bg-white"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-red-500 block mb-0.5 font-bold">আইটেম ছাড় (৳)</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-red-200 rounded text-sm bg-red-50 focus:ring-red-300 outline-none"
                      value={item.discount || 0}
                      onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Summary Section */}
      <section className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-800 border-b border-blue-100 pb-2">চূড়ান্ত হিসাব</h3>
        <div>
          <label className="text-sm font-bold text-blue-900 block mb-1">টোটাল ডিসকাউন্ট (৳)</label>
          <input
            type="number"
            className="w-full p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={data.discount}
            onChange={(e) => onChange({ ...data, discount: parseFloat(e.target.value) || 0 })}
          />
          <p className="text-[10px] text-gray-500 mt-1">* এটি সাব-টোটাল থেকে বিয়োগ করা হবে</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">শর্তাবলী</label>
          <textarea
            rows={3}
            className="w-full p-2 border rounded text-xs bg-white"
            value={data.terms}
            onChange={(e) => onChange({ ...data, terms: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <label className="text-sm font-medium text-gray-700">স্বাক্ষর আপলোড</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => handleFileUpload(e, 'signature')} 
            className="block w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </section>
    </div>
  );
};
