
import React, { useState, useRef } from 'react';
import { FileDown, Printer, Layout, Settings } from 'lucide-react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { InvoiceData } from './types';
import { INITIAL_INVOICE_DATA } from './constants';

const App: React.FC = () => {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(INITIAL_INVOICE_DATA);
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsPDF = () => {
    // Standard browsers handle "Save as PDF" through the print dialog
    window.print();
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar Controls */}
      <aside className="w-full md:w-[380px] lg:w-[420px] bg-white border-r border-gray-200 flex flex-col no-print shadow-xl z-20">
        <header className="p-4 bg-blue-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Layout size={24} className="text-blue-400" />
            <h1 className="text-xl font-bold tracking-tight">SmartPrint</h1>
          </div>
          <div className="flex gap-2">
             <button title="Settings" className="p-1 hover:bg-blue-800 rounded transition-colors text-blue-300">
               <Settings size={20} />
             </button>
          </div>
        </header>

        <div className="flex-grow p-4 overflow-hidden">
          <InvoiceForm 
            data={invoiceData} 
            onChange={setInvoiceData} 
          />
        </div>

        <footer className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-3 shadow-inner">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md"
          >
            <Printer size={20} />
            <span>প্রিন্ট</span>
          </button>
          <button
            onClick={handleSaveAsPDF}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-md"
          >
            <FileDown size={20} />
            <span>পিডিএফ</span>
          </button>
        </footer>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-grow bg-gray-200 overflow-y-auto print:p-0 flex justify-center items-start">
        <InvoicePreview 
          data={invoiceData} 
          previewRef={previewRef} 
        />
      </main>

      {/* Print-only Wrapper (Hidden normally, shown during print) */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            background: white !important;
          }
          .a4-page {
             margin: 0 !important;
             box-shadow: none !important;
             width: 100% !important;
             height: 100% !important;
             padding: 15mm !important;
             border: none !important;
          }
          aside, header, footer, .no-print {
            display: none !important;
          }
          main {
            overflow: visible !important;
            display: block !important;
            background: white !important;
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
