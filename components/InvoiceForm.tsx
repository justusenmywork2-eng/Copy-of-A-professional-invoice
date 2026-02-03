
import React, { useState } from 'react';
import { Plus, Trash2, X, Zap, ChevronDown, ChevronUp, CheckCircle, Info, User, Eye, EyeOff } from 'lucide-react';
import { InvoiceData, LineItem } from '../types';
import { DEFAULT_SERVICES } from '../constants';
import { generateId } from '../utils';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

interface CollapsibleProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  isComplete: boolean;
}

const CollapsibleSection: React.FC<CollapsibleProps> = ({ title, icon, children, isOpen, onToggle, isComplete }) => (
  <div className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 bg-white">
    <button
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
        isOpen ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`${isOpen ? 'text-blue-600' : 'text-gray-400'}`}>
          {icon}
        </div>
        <span className={`font-semibold ${isOpen ? 'text-blue-800' : 'text-gray-700'}`}>
          {title}
        </span>
        {isComplete && !isOpen && (
          <CheckCircle size={16} className="text-green-500" />
        )}
      </div>
      {isOpen ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-gray-400" />}
    </button>
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 p-4 border-t' : 'max-h-0 opacity-0 overflow-hidden'}`}>
      {children}
    </div>
  </div>
);

export const InvoiceForm: React.FC<Props> = ({ data, onChange }) => {
  const [openSection, setOpenSection] = useState<'company' | 'customer' | 'items' | null>('company');

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

  const isCompanyComplete = Boolean(data.company.name && data.company.phone && data.company.address && data.company.owner);
  const isCustomerComplete = Boolean(data.customer.name && data.customer.mobile);

  return (
    <div className="space-y-4 overflow-y-auto h-full max-h-[calc(100vh-10rem)] pr-1">
      {/* Company Section Foldable */}
      <CollapsibleSection
        title="কোম্পানি তথ্য"
        icon={<Info size={20} />}
        isOpen={openSection === 'company'}
        onToggle={() => setOpenSection(openSection === 'company' ? null : 'company')}
        isComplete={isCompanyComplete}
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-500">লোগো সেটিংস</label>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => onChange({...data, showLogo: !data.showLogo})}
                  className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded transition-colors ${data.showLogo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                  title={data.showLogo ? "লোগো বন্ধ করুন" : "লোগো চালু করুন"}
                 >
                   {data.showLogo ? <Eye size={12} /> : <EyeOff size={12} />}
                   {data.showLogo ? "On" : "Off"}
                 </button>
                 {data.company.logo && (
                  <button onClick={() => updateCompany('logo', '')} className="text-red-500 text-[10px] hover:underline flex items-center gap-1">
                    <X size={12} /> মুছুন
                  </button>
                )}
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileUpload(e, 'logo')} 
              className="block w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <input
            type="text"
            placeholder="কোম্পানির নাম"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={data.company.name}
            onChange={(e) => updateCompany('name', e.target.value)}
          />
          <input
            type="text"
            placeholder="প্রোপাইটর / ওনার নাম"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={data.company.owner}
            onChange={(e) => updateCompany('owner', e.target.value)}
          />
          <textarea
            placeholder="ঠিকানা"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            rows={2}
            value={data.company.address}
            onChange={(e) => updateCompany('address', e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="ফোন (English digits)"
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
      </CollapsibleSection>

      {/* Customer Section Foldable */}
      <CollapsibleSection
        title="গ্রাহকের তথ্য"
        icon={<User size={20} />}
        isOpen={openSection === 'customer'}
        onToggle={() => setOpenSection(openSection === 'customer' ? null : 'customer')}
        isComplete={isCustomerComplete}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="গ্রাহকের নাম"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
            value={data.customer.name}
            onChange={(e) => updateCustomer('name', e.target.value)}
          />
          <input
            type="text"
            placeholder="মোবাইল নম্বর (English digits)"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
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
      </CollapsibleSection>

      {/* Quick Services Bar - Always visible */}
      <section className="bg-white p-4 border border-gray-200 rounded-lg space-y-3">
        <div className="flex items-center gap-2 text-blue-800 font-semibold border-b pb-2">
            <Zap size={18} fill="currentColor" />
            <h3 className="text-sm">সার্ভিস আইটেম (ক্লিক করুন)</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_SERVICES.map((s) => (
            <button
              key={s.label}
              onClick={() => {
                addItem(s.label, s.price);
                // Optionally collapse other sections to focus on items
                setOpenSection(null);
              }}
              className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-[11px] font-medium text-blue-700 hover:bg-blue-600 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              + {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Items Management - Always visible */}
      <section className="bg-white p-4 border border-gray-200 rounded-lg space-y-4">
        <div className="flex justify-between items-center border-b pb-2">
          <h3 className="text-sm font-semibold text-blue-800">আইটেম লিস্ট</h3>
          <button
            onClick={() => addItem()}
            className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
          {data.items.map((item, index) => (
            <div key={item.id} className="p-3 border rounded-lg bg-gray-50 space-y-3 relative group transition-all hover:border-blue-200">
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
              <div className="text-[10px] font-bold text-gray-400">আইটেম #{index + 1}</div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="পন্যের বিবরণ"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[9px] text-gray-500 block mb-0.5">পরিমাণ</label>
                    <input
                      type="number"
                      className="w-full p-1.5 border rounded text-xs bg-white"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-gray-500 block mb-0.5">দর (৳)</label>
                    <input
                      type="number"
                      className="w-full p-1.5 border rounded text-xs bg-white"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-red-500 block mb-0.5 font-bold">ছাড় (৳)</label>
                    <input
                      type="number"
                      className="w-full p-1.5 border border-red-100 rounded text-xs bg-red-50 focus:ring-red-200 outline-none"
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

      {/* Summary Section - Foldable if preferred, but usually keep visible */}
      <section className="bg-blue-900 p-4 rounded-lg text-white shadow-lg space-y-4">
        <div className="flex justify-between items-center border-b border-blue-800 pb-2">
          <h3 className="text-sm font-semibold">হিসাব ও ছাড়</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-blue-200 block mb-1">অতিরিক্ত ডিসকাউন্ট (৳)</label>
            <input
              type="number"
              className="w-full p-2 border border-blue-700 rounded bg-blue-950 text-white text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              value={data.discount}
              onChange={(e) => onChange({ ...data, discount: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-blue-200 block mb-1">শর্তাবলী</label>
            <textarea
              rows={2}
              className="w-full p-2 border border-blue-700 rounded bg-blue-950 text-white text-[10px] focus:ring-2 focus:ring-blue-400 outline-none"
              value={data.terms}
              onChange={(e) => onChange({ ...data, terms: e.target.value })}
            />
          </div>
          <div className="pt-2">
            <label className="text-xs font-medium text-blue-200 block mb-1">স্বাক্ষর</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileUpload(e, 'signature')} 
              className="block w-full text-[10px] text-blue-300 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-800 file:text-blue-100"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
