
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, FileSpreadsheet, Printer, Filter, ChevronRight, Activity, Download,
  TrendingUp, Wrench, Clock, CheckCircle2, Banknote
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

export const ReportsView: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'service' | 'inventory'>('daily');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [reportType]);

  const fetchData = async () => {
    setLoading(true);
    let table = reportType === 'inventory' ? 'parts' : 'work_orders';
    const { data: res } = await supabase.from(table).select('*').order('created_at', { ascending: false });
    if (res) setData(res);
    setLoading(false);
  };

  const dailySummary = useMemo(() => {
    if (reportType !== 'daily') return null;
    const today = new Date().toISOString().split('T')[0];
    const todayData = data.filter(d => d.created_at.startsWith(today));
    
    return {
      newOrders: todayData.length,
      inProgress: todayData.filter(d => d.status === 'IN_PROGRESS' || d.status === 'PENDING').length,
      completed: todayData.filter(d => d.status === 'COMPLETED').length,
      totalRevenue: todayData.reduce((sum, d) => sum + (Number(d.total_amount) || 0), 0),
      totalLabor: todayData.reduce((sum, d) => sum + (Number(d.labor_cost) || 0), 0)
    };
  }, [data, reportType]);

  const exportCSV = () => {
    if (data.length === 0) return;
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).map(v => `"${v}"`).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", `IMOTOR_REPORT_${reportType.toUpperCase()}.csv`);
    link.click();
  };

  return (
    <div className="space-y-8 animate-in pb-24 print:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">วิเคราะห์ <span className="text-purple-600">Analytics</span></h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Enterprise Performance Metrics</p>
        </div>
        <div className="flex gap-3">
           <button onClick={exportCSV} className="h-12 px-8 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg flex items-center gap-3 active:scale-95 transition-all">
              <Download size={16}/> Export Excel
           </button>
           <button onClick={() => window.print()} className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg flex items-center gap-3 active:scale-95 transition-all">
              <Printer size={16}/> Print Report
           </button>
        </div>
      </div>

      <div className="flex bg-slate-100 p-1.5 rounded-3xl border border-slate-200 print:hidden w-fit">
        {(['daily', 'service', 'inventory'] as const).map(type => (
          <button key={type} onClick={() => setReportType(type)} className={`px-10 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${reportType === type ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400'}`}>
            {type === 'daily' ? 'สรุปงานรายวัน' : type === 'service' ? 'ประวัติงานซ่อม' : 'คลังอะไหล่'}
          </button>
        ))}
      </div>

      {reportType === 'daily' && dailySummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 animate-in">
           <SummaryCard label="งานใหม่วันนี้" value={dailySummary.newOrders} icon={TrendingUp} color="text-blue-600" bg="bg-blue-50" />
           <SummaryCard label="กำลังดำเนินการ" value={dailySummary.inProgress} icon={Clock} color="text-indigo-600" bg="bg-indigo-50" />
           <SummaryCard label="ซ่อมเสร็จแล้ว" value={dailySummary.completed} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
           <SummaryCard label="รายได้วันนี้" value={`฿${dailySummary.totalRevenue.toLocaleString()}`} icon={Banknote} color="text-slate-900" bg="bg-slate-100" />
           <SummaryCard label="ค่าแรงรวม" value={`฿${dailySummary.totalLabor.toLocaleString()}`} icon={Wrench} color="text-orange-600" bg="bg-orange-50" />
        </div>
      )}

      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl overflow-hidden min-h-[400px]">
         {loading ? (
           <div className="flex items-center justify-center h-64 animate-pulse uppercase text-[10px] font-black tracking-widest text-slate-300">Loading Report Data...</div>
         ) : (
           <table className="w-full text-left">
              <thead>
                 <tr className="border-b border-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-widest">
                    <th className="px-6 py-5">ข้อมูล</th>
                    <th className="px-6 py-5">วันที่/เวลา</th>
                    <th className="px-6 py-5 text-right">มูลค่า/จำนวน</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {data.slice(0, 20).map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                       <td className="px-6 py-5 font-black text-xs uppercase">{item.order_number || item.sku || item.name}</td>
                       <td className="px-6 py-5 text-[10px] text-slate-400">{new Date(item.created_at).toLocaleString()}</td>
                       <td className="px-6 py-5 text-right font-black text-xs italic">
                         {item.total_amount ? `฿${item.total_amount.toLocaleString()}` : item.stock_level}
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
         )}
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, icon: Icon, color, bg }: any) => (
  <div className={`${bg} p-6 rounded-[32px] border border-white shadow-sm flex flex-col items-center text-center`}>
     <div className={`p-3 bg-white rounded-2xl ${color} shadow-sm mb-3`}><Icon size={18}/></div>
     <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
     <p className={`text-xl font-black ${color}`}>{value}</p>
  </div>
);
