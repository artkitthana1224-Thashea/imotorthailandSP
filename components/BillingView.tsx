
import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Plus, 
  ChevronRight, 
  Download, 
  Printer, 
  CheckCircle2, 
  Clock, 
  X,
  Building,
  ClipboardList,
  FileCheck,
  Receipt
} from 'lucide-react';
import { MOCK_COMPANIES, MOCK_VEHICLES } from '../constants';

type DocType = 'BILLING' | 'INVOICE' | 'WORK_ORDER' | 'RECEIPT' | 'COMPLETION';

interface BillingItem {
  id: string;
  docNumber: string;
  type: DocType;
  customer: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  date: string;
  vehicleId?: string;
}

const MOCK_BILLS: BillingItem[] = [
  { id: 'b1', docNumber: 'QT-24001', type: 'BILLING', customer: 'คุณสมพงษ์ ยอดประเสริฐ', amount: 85500, status: 'PENDING', date: '2024-03-20', vehicleId: 'v1' },
  { id: 'b2', docNumber: 'INV-24005', type: 'INVOICE', customer: 'บริษัท ขนส่งด่วน จำกัด', amount: 90500, status: 'PAID', date: '2024-03-21', vehicleId: 'v2' },
  { id: 'b3', docNumber: 'REC-24012', type: 'RECEIPT', customer: 'คุณสมพงษ์ ยอดประเสริฐ', amount: 85500, status: 'PAID', date: '2024-03-22', vehicleId: 'v1' },
  { id: 'b4', docNumber: 'WO-24088', type: 'WORK_ORDER', customer: 'คุณสมพงษ์ ยอดประเสริฐ', amount: 0, status: 'PENDING', date: '2024-03-23', vehicleId: 'v1' }
];

export const BillingView: React.FC = () => {
  const [selectedBill, setSelectedBill] = useState<BillingItem | null>(null);
  const company = MOCK_COMPANIES[0];

  const getDocName = (type: DocType) => {
    switch (type) {
      case 'BILLING': return 'ใบวางบิล (Billing Statement)';
      case 'INVOICE': return 'ใบแจ้งหนี้ (Invoice)';
      case 'WORK_ORDER': return 'ใบเปิดงาน (Work Order)';
      case 'RECEIPT': return 'ใบเสร็จรับเงิน (Receipt)';
      case 'COMPLETION': return 'ใบปิดงาน (Job Completion)';
      default: return 'เอกสารทั่วไป';
    }
  };

  const getDocIcon = (type: DocType) => {
    switch (type) {
      case 'BILLING': return <ClipboardList size={18} />;
      case 'INVOICE': return <FileText size={18} />;
      case 'WORK_ORDER': return <Wrench size={18} />;
      case 'RECEIPT': return <Receipt size={18} />;
      case 'COMPLETION': return <FileCheck size={18} />;
    }
  };

  const Wrench = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            เอกสาร <span className="text-blue-600">ทางธุรกิจ</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            จัดการระบบบัญชีและเอกสารทางราชการ I-MOTOR Samut Prakan
          </p>
        </div>
        <button className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest text-xs">
          <Plus size={20} /> ออกเอกสารใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        <div className="xl:col-span-7 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                 <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="ค้นหาตามเลขที่บิล หรือชื่อลูกค้า..." className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl text-sm font-bold shadow-inner" />
                 </div>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] bg-slate-50/20">
                          <th className="px-10 py-6">เลขที่เอกสาร</th>
                          <th className="px-10 py-6">ประเภท</th>
                          <th className="px-10 py-6 text-right">ยอดเงิน</th>
                          <th className="px-10 py-6 text-right">แอคชั่น</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                       {MOCK_BILLS.map(bill => (
                          <tr key={bill.id} onClick={() => setSelectedBill(bill)} className={`hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-all ${selectedBill?.id === bill.id ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
                             <td className="px-10 py-8">
                                <p className="font-black text-slate-900 dark:text-white">{bill.docNumber}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bill.date}</p>
                             </td>
                             <td className="px-10 py-8">
                                <div className="flex items-center gap-3">
                                   <div className="text-blue-600">{getDocIcon(bill.type)}</div>
                                   <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{getDocName(bill.type).split(' (')[0]}</span>
                                </div>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <p className="text-base font-black text-slate-900 dark:text-white">฿{bill.amount.toLocaleString()}</p>
                             </td>
                             <td className="px-10 py-8 text-right">
                                <ChevronRight size={20} className="text-slate-300 inline" />
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        {/* Digital Document Preview - Corporate Style */}
        <div className="xl:col-span-5">
           {selectedBill ? (
              <div className="bg-white dark:bg-slate-900 rounded-[48px] border-4 border-blue-50 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-right-10 flex flex-col min-h-[700px]">
                 {/* Header Section */}
                 <div className="p-10 bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-start justify-between mb-8">
                       <img src={company.logo} className="h-16 object-contain" alt="I-Motor Logo" />
                       <div className="text-right">
                          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{getDocName(selectedBill.type).split(' (')[0]}</h2>
                          <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">ORIGINAL DOCUMENT</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Company / ผู้ออกเอกสาร</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">{company.name}</p>
                          <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">{company.address}</p>
                          <p className="text-[10px] font-bold text-slate-900 dark:text-white mt-1">Tax ID: {company.taxId}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer / ลูกค้า</p>
                          <p className="text-xs font-black text-slate-900 dark:text-white uppercase leading-tight">{selectedBill.customer}</p>
                          <p className="text-[10px] text-slate-500 mt-2">Document No: {selectedBill.docNumber}</p>
                          <p className="text-[10px] text-slate-500">Date: {selectedBill.date}</p>
                       </div>
                    </div>
                 </div>

                 {/* Table Content */}
                 <div className="flex-1 p-10">
                    <table className="w-full text-left text-xs">
                       <thead className="border-b-2 border-slate-900 dark:border-white">
                          <tr>
                             <th className="pb-4 font-black uppercase">Description / รายการ</th>
                             <th className="pb-4 font-black uppercase text-right">Amount / จำนวนเงิน</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          <tr className="group">
                             <td className="py-6">
                                <p className="font-black text-slate-900 dark:text-white">I-MOTOR VAPOR CBS (3000W)</p>
                                <p className="text-[10px] text-slate-500 mt-1">โมเดลมาตรฐาน พร้อมแบตเตอรี่ Lithium 72V</p>
                             </td>
                             <td className="py-6 text-right font-black text-slate-900 dark:text-white">฿{selectedBill.amount.toLocaleString()}</td>
                          </tr>
                       </tbody>
                    </table>
                 </div>

                 {/* Totals & Signature */}
                 <div className="p-10 bg-slate-900 dark:bg-slate-800 text-white space-y-8">
                    <div className="flex justify-between items-center">
                       <p className="text-xs font-bold uppercase tracking-widest opacity-60">Total Amount / ยอดรวมสุทธิ</p>
                       <p className="text-3xl font-black italic">฿{selectedBill.amount.toLocaleString()}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-10 pt-10 border-t border-white/10">
                       <div className="text-center space-y-4">
                          <div className="h-px bg-white/20 w-full mb-2"></div>
                          <p className="text-[9px] font-black uppercase tracking-widest">Authorized Signature</p>
                       </div>
                       <div className="text-center space-y-4">
                          <div className="h-px bg-white/20 w-full mb-2"></div>
                          <p className="text-[9px] font-black uppercase tracking-widest">Customer Signature</p>
                       </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                       <button className="flex-1 h-12 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                          <Printer size={16}/> Print
                       </button>
                       <button className="flex-1 h-12 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                          <Download size={16}/> Save PDF
                       </button>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="bg-slate-50/50 dark:bg-slate-900/40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[48px] h-[700px] flex flex-col items-center justify-center text-center p-12">
                 <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center text-slate-300 mb-6"><FileText size={40}/></div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">เลือกเอกสารเพื่อดูตัวอย่าง</h3>
                 <p className="text-sm text-slate-500 mt-2 max-w-xs leading-relaxed">คลิกที่รายการด้านซ้ายเพื่อแสดงตัวอย่างเอกสารดิจิทัลที่มีผลทางกฎหมาย</p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
