
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Download, FileSpreadsheet, Printer, Filter, ChevronRight
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const ReportsView: React.FC = () => {
  const [reportType, setReportType] = useState<'service' | 'inventory' | 'billing'>('service');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [reportType]);

  const fetchData = async () => {
    setLoading(true);
    let table = reportType === 'service' ? 'work_orders' : reportType === 'inventory' ? 'parts' : 'work_orders';
    const { data: res } = await supabase.from(table).select('*').limit(50);
    if (res) setData(res);
    setLoading(false);
  };

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `IMOTOR_${reportType.toUpperCase()}_REPORT.csv`);
    link.click();
  };

  return (
    <div className="space-y-8 animate-in pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">รายงานและวิเคราะห์ <span className="text-purple-600">Reports</span></h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">การส่งออกข้อมูลและสรุปผลประกอบการ</p>
        </div>
        <div className="flex gap-3">
           <button onClick={exportCSV} className="h-12 px-8 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg flex items-center gap-3">
              <FileSpreadsheet size={16}/> Export Excel
           </button>
           <button onClick={() => window.print()} className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg flex items-center gap-3">
              <Printer size={16}/> Print PDF
           </button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
            <div className="flex bg-slate-100 p-1 rounded-2xl">
               {(['service', 'inventory', 'billing'] as const).map(type => (
                 <button key={type} onClick={() => setReportType(type)} className={`px-10 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${reportType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>
                    {type === 'service' ? 'งานซ่อม' : type === 'inventory' ? 'อะไหล่' : 'การเงิน'}
                 </button>
               ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <select className="pl-10 pr-6 py-3 bg-slate-50 border-none rounded-xl font-black text-[9px] uppercase tracking-widest outline-none">
                  <option>30 วันล่าสุด</option>
                  <option>เดือนที่แล้ว</option>
                  <option>ปีนี้ทั้งหมด</option>
                </select>
              </div>
            </div>
         </div>

         <div className="overflow-x-auto min-h-[300px]">
            <table className="w-full text-left">
               <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                     {data.length > 0 && Object.keys(data[0]).slice(0, 6).map(k => (
                       <th key={k} className="px-6 py-4">{k.replace('_', ' ')}</th>
                     ))}
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr><td colSpan={10} className="py-20 text-center font-black text-slate-300 uppercase italic">กำลังดึงข้อมูลรายงาน...</td></tr>
                  ) : (
                    data.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-all">
                        {Object.values(row).slice(0, 6).map((val: any, j) => (
                          <td key={j} className="px-6 py-4 text-[11px] font-bold text-slate-600">{String(val)}</td>
                        ))}
                      </tr>
                    ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
