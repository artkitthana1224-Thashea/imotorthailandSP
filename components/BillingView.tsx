
import React, { useState } from 'react';
import { 
  FileText, Search, Download, Printer, Receipt, Wrench, Banknote, FileQuestion
} from 'lucide-react';
import { Company } from '../types';

type DocType = 'BILLING' | 'INVOICE' | 'WORK_ORDER' | 'RECEIPT';

interface BillingItem {
  id: string;
  docNumber: string;
  type: DocType;
  customer: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  date: string;
}

interface BillingViewProps {
  currentCompany: Company;
}

const MOCK_BILLS: BillingItem[] = [
  { id: 'b1', docNumber: 'QT-24001', type: 'BILLING', customer: 'คุณสมพงษ์ ยอดประเสริฐ', amount: 85500, status: 'PENDING', date: '2024-03-20' },
  { id: 'b2', docNumber: 'INV-24005', type: 'INVOICE', customer: 'บริษัท ขนส่งด่วน จำกัด', amount: 90500, status: 'PAID', date: '2024-03-21' },
  { id: 'b3', docNumber: 'REC-24012', type: 'RECEIPT', customer: 'คุณสมพงษ์ ยอดประเสริฐ', amount: 85500, status: 'PAID', date: '2024-03-22' },
  { id: 'b4', docNumber: 'WO-24088', type: 'WORK_ORDER', customer: 'คุณมานี รักดี', amount: 1500, status: 'PENDING', date: '2024-03-23' }
];

const SummaryCard = ({ label, count, icon: Icon, colorClass, bgClass }: any) => (
  <div className={`${bgClass} border border-white/60 p-6 rounded-[32px] shadow-sm flex flex-col items-center text-center transition-all hover:scale-105`}>
    <div className={`p-3 rounded-2xl bg-white/80 ${colorClass} mb-2 shadow-sm`}>
      <Icon size={20} />
    </div>
    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1 opacity-70">{label}</p>
    <p className={`text-xl font-black ${colorClass}`}>{count}</p>
  </div>
);

export const BillingView: React.FC<BillingViewProps> = ({ currentCompany }) => {
  const [selectedBill, setSelectedBill] = useState<BillingItem | null>(null);
  const getSummary = (type: DocType) => MOCK_BILLS.filter(b => b.type === type).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">การเงิน <span className="text-blue-600">Finance</span></h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Billing & Account Receivables</p>
         </div>
         <button className="h-12 px-10 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl">
            + ออกเอกสารใหม่
         </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
         <SummaryCard label="ใบเสนอราคา" count={getSummary('BILLING')} icon={FileQuestion} colorClass="text-blue-600" bgClass="bg-blue-50" />
         <SummaryCard label="ใบแจ้งหนี้" count={getSummary('INVOICE')} icon={FileText} colorClass="text-orange-600" bgClass="bg-orange-50" />
         <SummaryCard label="ใบเสร็จรับเงิน" count={getSummary('RECEIPT')} icon={Receipt} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
         <SummaryCard label="ใบงานซ่อม" count={getSummary('WORK_ORDER')} icon={Wrench} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         <div className="xl:col-span-7 space-y-6">
            <div className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
               <input type="text" placeholder="ค้นหาเลขที่เอกสาร หรือ ชื่อลูกค้า..." className="w-full pl-16 pr-8 py-5 bg-white/70 backdrop-blur-md rounded-[32px] border-none shadow-lg text-[11px] font-black uppercase outline-none shadow-slate-200/50" />
            </div>
            <div className="space-y-4">
               {MOCK_BILLS.map(bill => (
                  <div key={bill.id} onClick={() => setSelectedBill(bill)} className={`p-6 rounded-[32px] border transition-all cursor-pointer flex items-center justify-between ${selectedBill?.id === bill.id ? 'bg-slate-900 text-white border-slate-900 shadow-xl scale-[1.02]' : 'bg-white border-slate-100 hover:bg-slate-50 shadow-sm'}`}>
                     <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedBill?.id === bill.id ? 'bg-white/20' : 'bg-slate-50 text-blue-600'}`}><FileText size={24}/></div>
                        <div>
                           <p className="font-black uppercase tracking-tight text-sm">{bill.docNumber}</p>
                           <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedBill?.id === bill.id ? 'opacity-70' : 'text-slate-400'} mt-1`}>{bill.customer}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="text-lg font-black italic">฿{bill.amount.toLocaleString()}</p>
                        <span className={`text-[8px] font-black uppercase tracking-widest ${bill.status === 'PAID' ? 'text-emerald-500' : 'text-amber-500'} mt-1`}>{bill.status}</span>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="xl:col-span-5">
            {selectedBill ? (
               <div className="bg-white p-12 rounded-[56px] border border-white shadow-2xl space-y-10 animate-in zoom-in-95 sticky top-8">
                  <div className="flex justify-between items-start">
                     <div className="w-18 h-18 bg-slate-50 border border-slate-100 rounded-2xl p-3 shadow-inner">
                        <img src={currentCompany.logo} className="w-full h-full object-contain" />
                     </div>
                     <div className="text-right">
                        <h4 className="font-black text-2xl uppercase italic tracking-tighter leading-none">OFFICIAL</h4>
                        <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest mt-2">TAX INVOICE / RECEIPT</p>
                     </div>
                  </div>
                  <div className="space-y-6 pt-6 text-[11px]">
                     <div className="flex justify-between border-b border-slate-50 pb-4">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Document No.</span>
                        <span className="font-black text-slate-900">{selectedBill.docNumber}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-50 pb-4">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Bill To</span>
                        <span className="font-black text-slate-900">{selectedBill.customer}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-50 pb-4">
                        <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Date</span>
                        <span className="font-black text-slate-900">{selectedBill.date}</span>
                     </div>
                     <div className="flex justify-between pt-8">
                        <span className="font-black uppercase tracking-widest text-slate-900 text-[12px]">ยอดรวมสุทธิ</span>
                        <span className="text-4xl font-black text-blue-600 italic">฿{selectedBill.amount.toLocaleString()}</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <button className="h-16 bg-slate-100 rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-200 transition-all"><Printer size={20}/> Print</button>
                     <button className="h-16 bg-blue-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-100 transition-all hover:scale-[1.02]"><Download size={20}/> Save PDF</button>
                  </div>
               </div>
            ) : (
               <div className="h-[500px] border-2 border-dashed border-slate-100 rounded-[56px] flex flex-col items-center justify-center text-center p-16 text-slate-400 bg-white/40 opacity-60">
                  <Receipt size={64} className="mb-6 opacity-20"/>
                  <p className="font-black uppercase text-[12px] tracking-[0.4em] opacity-50 italic">Select a document to preview</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
