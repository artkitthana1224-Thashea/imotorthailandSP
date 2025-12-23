
import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Calendar, FileText, FileSpreadsheet, FileArchive, CheckCircle2, ChevronRight, PieChart, Activity } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [selectedRange, setSelectedRange] = useState('เดือนนี้');
  const [selectedType, setSelectedType] = useState('รายงานรายได้');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">วิเคราะห์ <span className="text-purple-600">Analytics</span></h1>
          <p className="text-slate-500 font-medium">ภาพรวมผลงานและรายงานทางธุรกิจแบบเรียลไทม์</p>
        </div>
        <div className="flex bg-white/60 p-1.5 rounded-[24px] shadow-sm border border-white">
           <div className="flex items-center px-6 py-3 bg-white rounded-[18px] border border-slate-100 gap-3">
              <Calendar size={16} className="text-blue-500" />
              <select value={selectedRange} onChange={e => setSelectedRange(e.target.value)} className="bg-transparent border-none font-black text-[10px] uppercase tracking-widest outline-none">
                 <option>วันนี้</option>
                 <option>เดือนนี้</option>
                 <option>ปีนี้</option>
                 <option>กำหนดเอง</option>
              </select>
           </div>
        </div>
      </div>

      {/* Balanced Summary Grid: 2 Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'อัตราเข้าซ่อมสำเร็จ', val: '98.5%', icon: <CheckCircle2 size={24}/>, bg: 'bg-emerald-50/50', color: 'text-emerald-600' },
          { label: 'ยอดขายอะไหล่', val: '฿145,200', icon: <TrendingUp size={24}/>, bg: 'bg-blue-50/50', color: 'text-blue-600' },
          { label: 'พนักงานที่งานเยอะที่สุด', val: 'ช่างสมหมาย', icon: <Activity size={24}/>, bg: 'bg-orange-50/50', color: 'text-orange-600' },
          { label: 'จำนวนรถรอซ่อม', val: '12 คัน', icon: <PieChart size={24}/>, bg: 'bg-purple-50/50', color: 'text-purple-600' },
          { label: 'ใบเสนอราคาที่ออก', val: '42 ใบ', icon: <FileText size={24}/>, bg: 'bg-indigo-50/50', color: 'text-indigo-600' },
          { label: 'อะไหล่ยอดนิยม', val: 'ยาง 12 นิ้ว', icon: <BarChart3 size={24}/>, bg: 'bg-rose-50/50', color: 'text-rose-600' },
          { label: 'ลูกค้าองค์กร (Fleet)', val: '8 บริษัท', icon: <FileSpreadsheet size={24}/>, bg: 'bg-slate-50/50', color: 'text-slate-600' },
          { label: 'การประหยัดพลังงาน', val: '1.2 MWh', icon: <TrendingUp size={24}/>, bg: 'bg-emerald-100/30', color: 'text-emerald-700' },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} p-8 rounded-[40px] border border-white shadow-sm transition-all hover:scale-105 group`}>
             <div className="flex items-center justify-between mb-6">
                <div className={`${item.color} opacity-80`}>{item.icon}</div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-900 transition-all" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
             <p className="text-2xl font-black text-slate-900">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/60 p-10 rounded-[56px] border border-white shadow-xl flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
         <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)} className="bg-transparent border-none font-black text-xs uppercase tracking-widest outline-none px-4">
               <option>รายงานรายได้</option>
               <option>รายงานสต็อก</option>
               <option>รายงานผลงานช่าง</option>
               <option>รายงานเคลมประกัน</option>
            </select>
            <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3"><Download size={18}/> Export Report</button>
         </div>
         <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em]">ข้อมูลชุดล่าสุด อัปเดตเมื่อ: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};
