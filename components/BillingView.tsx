
import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  ChevronRight, 
  Download, 
  Printer, 
  X,
  ClipboardList,
  FileCheck,
  Receipt,
  Wrench,
  Banknote
} from 'lucide-react';
import { Company } from '../types';

type DocType = 'BILLING' | 'INVOICE' | 'WORK_ORDER' | 'RECEIPT' | 'COMPLETION';

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

export const BillingView: React.FC<BillingViewProps> = ({ currentCompany }) => {
  const [selectedBill, setSelectedBill] = useState<BillingItem | null>(null);

  const getSummary = (type: DocType) => MOCK_BILLS.filter(b => b.type === type).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">การเงิน <span className="text-blue-600">Finance</span></h1>
            <p className="text-slate-500 font-medium">จัดการใบวางบิล ใบแจ้งหนี้ และใบเสร็จรับเงิน I-MOTOR</p>
         </div>
         <button className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl">
            <Plus size={18} className="inline mr-2" /> ออกเอกสารใหม่
         </button>
      </div>

      {/* Document Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
         {[
           { label: 'ใบเสนอราคา', count: getSummary('BILLING'), color: 'text-blue-600', bg: 'bg-blue-50/50' },
           { label: 'ใบแจ้งหนี้', count: getSummary('INVOICE'), color: 'text-orange-600', bg: 'bg-orange-50/50' },
           { label: 'ใบเสร็จรับเงิน', count: getSummary('RECEIPT'), color: 'text-emerald-600', bg: 'bg-emerald-50/50' },
           { label: 'ใบสั่งงานซ่อม', count: getSummary('WORK_ORDER'), color: 'text-indigo-600', bg: 'bg-indigo-50/50' }
         ].map(item => (
            <div key={item.label} className={`${item.bg} p-6 rounded-[32px] border border-white text-center`}>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{item.label}</p>
               <p className={`text-3xl font-black ${item.color}`}>{item.count}</p>
            </div>
         ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         <div className="xl:col-span-7 bg-white/60 p-8 rounded-[48px] border border-white shadow-xl h-fit">
            <div className="relative mb-8">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input type="text" placeholder="ค้นหาเลขที่เอกสาร..." className="w-full pl-14 pr-6 py-4 bg-white rounded-2xl border-none shadow-sm font-bold" />
            </div>
            <div className="space-y-4">
               {MOCK_BILLS.map(bill => (
                  <div key={bill.id} onClick={() => setSelectedBill(bill)} className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${selectedBill?.id === bill.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                     <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedBill?.id === bill.id ? 'bg-white/20' : 'bg-slate-50 text-blue-600'}`}><FileText size={20}/></div>
                        <div>
                           <p className="font-black uppercase tracking-tight">{bill.docNumber}</p>
                           <p className={`text-[9px] font-bold uppercase tracking-widest ${selectedBill?.id === bill.id ? 'opacity-70' : 'text-slate-400'}`}>{bill.customer}</p>
                        </div>
                     </div>
                     <p className="text-base font-black italic">฿{bill.amount.toLocaleString()}</p>
                  </div>
               ))}
            </div>
         </div>

         <div className="xl:col-span-5 h-fit">
            {selectedBill ? (
               <div className="bg-white p-10 rounded-[48px] border-4 border-blue-50 shadow-2xl flex flex-col space-y-8 animate-in zoom-in-95">
                  <div className="flex justify-between items-start">
                     <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl p-2"><img src={currentCompany.logo} className="w-full h-full object-contain" /></div>
                     <div className="text-right">
                        <h4 className="font-black text-xl uppercase italic">PREVIEW</h4>
                        <p className="text-[10px] font-black uppercase text-blue-600 tracking-widest">Document Overview</p>
                     </div>
                  </div>
                  <div className="space-y-4 pt-4">
                     <div className="flex justify-between border-b border-slate-50 pb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">เลขที่เอกสาร</span>
                        <span className="text-sm font-black text-slate-900">{selectedBill.docNumber}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-50 pb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">ชื่อลูกค้า</span>
                        <span className="text-sm font-black text-slate-900">{selectedBill.customer}</span>
                     </div>
                     <div className="flex justify-between border-b border-slate-50 pb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">วันที่ออก</span>
                        <span className="text-sm font-black text-slate-900">{selectedBill.date}</span>
                     </div>
                     <div className="flex justify-between pt-4">
                        <span className="text-sm font-black uppercase tracking-widest text-slate-900">ยอดเงินสุทธิ</span>
                        <span className="text-2xl font-black text-blue-600 italic">฿{selectedBill.amount.toLocaleString()}</span>
                     </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <button className="h-14 bg-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"><Printer size={16}/> Print</button>
                     <button className="h-14 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-blue-100"><Download size={16}/> Download PDF</button>
                  </div>
               </div>
            ) : (
               <div className="h-[400px] border-2 border-dashed border-slate-200 rounded-[48px] flex flex-col items-center justify-center text-center p-12 text-slate-400">
                  <Receipt size={48} className="mb-4 opacity-30"/>
                  <p className="font-black uppercase text-[10px] tracking-widest">เลือกเอกสารเพื่อดูตัวอย่าง</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
