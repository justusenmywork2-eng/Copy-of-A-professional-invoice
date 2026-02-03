
import React from 'react';
import { InvoiceData } from '../types';
import { formatCurrency, calculateSubtotal, calculateItemTotal } from '../utils';

interface Props {
  data: InvoiceData;
  previewRef: React.RefObject<HTMLDivElement>;
}

export const InvoicePreview: React.FC<Props> = ({ data, previewRef }) => {
  const subtotal = calculateSubtotal(data.items);
  const grandTotal = Math.max(0, subtotal - data.discount);

  return (
    <div className="w-full flex justify-center py-8 bg-gray-200 min-h-screen overflow-x-auto no-print">
      <div 
        ref={previewRef}
        className="a4-page relative overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-10 border-b-2 border-gray-100 pb-8">
          <div className="flex items-center gap-4">
            {data.showLogo && (
              data.company.logo ? (
                <img src={data.company.logo} alt="Logo" className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                  {data.company.name.charAt(0)}
                </div>
              )
            )}
            <div>
              <h1 className="text-2xl font-bold text-blue-800 uppercase tracking-wide">{data.company.name}</h1>
              <p className="text-[12px] font-semibold text-gray-700 italic">প্রোপাইটর: {data.company.owner}</p>
              <p className="text-[11px] text-gray-600 max-w-xs whitespace-pre-line leading-tight mt-1">{data.company.address}</p>
              <p className="text-[11px] text-gray-600 mt-1 font-medium">ফোন: {data.company.phone}</p>
              <p className="text-[11px] text-gray-600">ইমেইল: {data.company.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-extrabold text-gray-200 uppercase mb-4 tracking-tighter">ইনভয়েস</h2>
            <div className="text-xs space-y-1">
              <p><span className="font-semibold text-gray-700">নং:</span> {data.invoiceNumber}</p>
              <p><span className="font-semibold text-gray-700">তারিখ:</span> {data.invoiceDate}</p>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <p className="text-[10px] font-bold text-blue-700 uppercase mb-2 border-b border-blue-100 pb-1">বিল টু</p>
            <h3 className="text-lg font-bold text-gray-800 leading-none mb-1">{data.customer.name || 'গ্রাহকের নাম'}</h3>
            <p className="text-[12px] text-gray-600 whitespace-pre-line leading-tight">{data.customer.address || 'গ্রাহকের ঠিকানা'}</p>
            <p className="text-[12px] text-gray-600 mt-1 font-medium">মোবাইল: {data.customer.mobile || '01700-000000'}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="flex-grow">
          <table className="w-full mb-8 border-collapse">
            <thead>
              <tr className="bg-blue-800 text-white text-[12px] uppercase">
                <th className="py-2.5 px-3 text-left font-medium w-10 rounded-tl-md">নং</th>
                <th className="py-2.5 px-3 text-left font-medium">বিবরণ</th>
                <th className="py-2.5 px-3 text-center font-medium w-16">পরিমাণ</th>
                <th className="py-2.5 px-3 text-right font-medium w-24">দর (৳)</th>
                <th className="py-2.5 px-3 text-right font-medium w-24">ছাড় (৳)</th>
                <th className="py-2.5 px-3 text-right font-medium w-28 rounded-tr-md">মোট (৳)</th>
              </tr>
            </thead>
            <tbody className="text-[13px] border-b">
              {data.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="py-2.5 px-3 border-l border-r text-gray-500 text-center">{index + 1}</td>
                  <td className="py-2.5 px-3 border-r text-gray-800 font-medium">{item.description}</td>
                  <td className="py-2.5 px-3 border-r text-center text-gray-600">{item.quantity}</td>
                  <td className="py-2.5 px-3 border-r text-right text-gray-600">{item.unitPrice.toLocaleString('en-US')}</td>
                  <td className="py-2.5 px-3 border-r text-right text-red-500 font-medium">
                    {item.discount ? item.discount.toLocaleString('en-US') : '-'}
                  </td>
                  <td className="py-2.5 px-3 border-r text-right font-bold text-gray-800">
                    {calculateItemTotal(item).toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
              {/* Padding rows to fill space */}
              {Array.from({ length: Math.max(0, 10 - data.items.length) }).map((_, i) => (
                 <tr key={`empty-${i}`} className="h-8 border-b border-gray-100">
                    <td className="border-l border-r"></td>
                    <td className="border-r"></td>
                    <td className="border-r"></td>
                    <td className="border-r"></td>
                    <td className="border-r"></td>
                    <td className="border-r"></td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="flex justify-between items-start pt-6 border-t-2 border-gray-100">
          <div className="w-1/2 pr-10">
            <h4 className="text-[10px] font-bold text-gray-700 uppercase mb-2 border-b border-gray-200 inline-block">শর্তাবলী:</h4>
            <p className="text-[11px] text-gray-500 whitespace-pre-line leading-relaxed italic">{data.terms}</p>
          </div>
          <div className="w-[40%] space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">সাব-টোটাল:</span>
              <span className="font-semibold text-gray-800">{formatCurrency(subtotal)}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>অতিরিক্ত ছাড়:</span>
                <span>- {formatCurrency(data.discount)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 px-4 bg-blue-800 text-white rounded-lg shadow-inner">
              <span className="font-bold uppercase tracking-tight">সর্বমোট পরিশোধযোগ্য:</span>
              <span className="text-xl font-black">{formatCurrency(grandTotal)}</span>
            </div>
            <div className="text-[10px] text-right text-gray-400 font-medium pr-2">
               * সমস্ত মূল্য টাকায় (৳) হিসাব করা হয়েছে
            </div>
          </div>
        </div>

        {/* Footer / Signature */}
        <div className="mt-20 flex justify-between items-end pb-4">
          <div className="text-center">
             <div className="h-10 flex items-end justify-center mb-1">
                {/* Space for potential rubber stamp */}
             </div>
             <div className="w-40 border-t border-gray-300 pt-1 text-[11px] text-gray-400 font-semibold uppercase">গ্রাহকের স্বাক্ষর</div>
          </div>
          <div className="text-center">
            <div className="h-12 mb-1 flex items-center justify-center overflow-hidden">
               {data.signature && <img src={data.signature} alt="Signature" className="max-h-12 opacity-90" />}
            </div>
            <div className="w-48 border-t-2 border-blue-800 pt-1 text-[12px] text-blue-900 font-black uppercase tracking-wider">কর্তৃপক্ষের স্বাক্ষর</div>
          </div>
        </div>

        {/* Watermark/Footer text */}
        <div className="absolute bottom-6 left-0 right-0 text-center opacity-30 pointer-events-none">
           <p className="text-[9px] text-gray-400 tracking-widest">স্মার্টপ্রিন্ট ইনভয়েস জেনারেটর দ্বারা প্রস্তুতকৃত</p>
        </div>
      </div>
    </div>
  );
};
