
import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Calendar, FileText, FileSpreadsheet, FileArchive, CheckCircle2 } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = (format: string) => {
    setExporting(format);
    setTimeout(() => {
      setExporting(null);
      alert(`ดาวน์โหลดไฟล์รายงานรูปแบบ ${format.toUpperCase()} สำเร็จแล้ว!`);
    }, 2000);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">รายงานวิเคราะห์ (Reports)</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">สรุปผลการดำเนินงานและวิเคราะห์แนวโน้มธุรกิจ</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button 
            disabled={!!exporting}
            onClick={() => handleExport('excel')} 
            className="h-14 px-6 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all flex items-center gap-2 uppercase tracking-widest text-[10px] disabled:opacity-50"
          >
            {exporting === 'excel' ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> : <FileSpreadsheet size={16} />}
            EXCEL
          </button>
          <button 
            disabled={!!exporting}
            onClick={() => handleExport('pdf')} 
            className="h-14 px-6 bg-rose-600 text-white rounded-2xl font-black shadow-xl shadow-rose-100 dark:shadow-none hover:bg-rose-700 transition-all flex items-center gap-2 uppercase tracking-widest text-[10px] disabled:opacity-50"
          >
            {exporting === 'pdf' ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> : <FileArchive size={16} />}
            PDF
          </button>
          <button 
            disabled={!!exporting}
            onClick={() => handleExport('csv')} 
            className="h-14 px-6 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all flex items-center gap-2 uppercase tracking-widest text-[10px] disabled:opacity-50"
          >
            {exporting === 'csv' ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div> : <Download size={16} />}
            CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: 'ใบงานเดือนนี้', val: '245', icon: <FileText className="text-blue-600" /> },
          { label: 'รายได้เฉลี่ย/วัน', val: '฿18,400', icon: <TrendingUp className="text-indigo-600" /> },
          { label: 'อัตราความสำเร็จ', val: '98.2%', icon: <CheckCircle2 className="text-emerald-600" /> },
          { label: 'วันเปิดให้บริการ', val: '312', icon: <Calendar className="text-amber-600" /> }
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
             <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6">{item.icon}</div>
             <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{item.label}</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{item.val}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-12 rounded-[56px] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
         <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center animate-pulse shadow-2xl shadow-blue-100 dark:shadow-none"><BarChart3 size={48} /></div>
         <h3 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard รายงานขั้นสูง</h3>
         <p className="text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed">
           รายงานเชิงลึกสำหรับ I-Motor Thailand | Samut Prakan <br/>
           กำลังอัปเดตข้อมูลแบบเรียลไทม์จากศูนย์บริการทุกจุด
         </p>
         <button className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-[10px] border-b-2 border-blue-600 dark:border-blue-400 pb-1">อัปเดตข้อมูลวินาทีต่อวินาที</button>
      </div>
    </div>
  );
};
