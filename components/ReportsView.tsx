
import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileSpreadsheet, Printer, Filter, ChevronRight, Activity, Download,
  TrendingUp, Wrench, Clock, CheckCircle2, Banknote, Calendar, 
  ArrowUpRight, ArrowDownRight, Package, Users, ShieldCheck, FileText
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { WorkOrderStatus } from '../types';

export const ReportsView: React.FC = () => {
  const [reportType, setReportType] = useState<'service' | 'inventory' | 'revenue'>('service');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [reportType, startDate, endDate]);

  const fetchReportData = async () => {
    setLoading(true);
    let table = reportType === 'inventory' ? 'parts' : 'work_orders';
    let query = supabase.from(table).select('*').order('created_at', { ascending: false });
    
    if (reportType !== 'inventory') {
      query = query.gte('created_at', `${startDate}T00:00:00Z`).lte('created_at', `${endDate}T23:59:59Z`);
    }

    const { data: res, error } = await query;
    if (!error && res) setData(res);
    setLoading(false);
  };

  const summary = useMemo(() => {
    if (reportType === 'inventory') {
      return {
        totalSKUs: data.length,
        totalStock: data.reduce((sum, d) => sum + (d.stock_level || 0), 0),
        lowStockItems: data.filter(d => d.stock_level <= (d.min_stock || 0)).length,
        inventoryValue: data.reduce((sum, d) => sum + ((d.cost_price || 0) * (d.stock_level || 0)), 0)
      };
    }
    
    return {
      totalOrders: data.length,
      completed: data.filter(d => d.status === WorkOrderStatus.COMPLETED).length,
      revenue: data.reduce((sum, d) => sum + (Number(d.total_amount) || 0), 0),
      labor: data.reduce((sum, d) => sum + (Number(d.labor_cost) || 0), 0),
      efficiency: data.length > 0 ? Math.round((data.filter(d => d.status === WorkOrderStatus.COMPLETED).length / data.length) * 100) : 0
    };
  }, [data, reportType]);

  const exportExcel = () => {
    if (data.length === 0) return;
    
    // Add BOM for UTF-8 compatibility with Excel
    const BOM = "\uFEFF";
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => Object.values(item).map(v => {
      // Escape commas and double quotes
      let val = v === null ? '' : String(v);
      if (val.includes(',') || val.includes('"')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',')).join('\n');
    
    const csvContent = BOM + headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `IMOTOR_REPORT_${reportType.toUpperCase()}_${startDate}_to_${endDate}.csv`);
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in pb-24">
      {/* Header & Main Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">ระบบรายงาน <span className="text-purple-600">Enterprise Reports</span></h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">ข้อมูลสถิติและการดำเนินงานฉบับสมบูรณ์</p>
        </div>
        <div className="flex gap-3">
           <button onClick={exportExcel} className="h-12 px-8 bg-white border-2 border-slate-100 hover:border-emerald-500 hover:text-emerald-600 text-slate-600 rounded-2xl font-black uppercase text-[10px] shadow-sm flex items-center gap-3 active:scale-95 transition-all">
              <FileSpreadsheet size={16}/> Export Excel
           </button>
           <button onClick={handlePrint} className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg flex items-center gap-3 active:scale-95 transition-all">
              <Printer size={16}/> Export PDF / Print
           </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col xl:flex-row gap-6 items-center print:hidden">
        <div className="flex bg-slate-100 p-1 rounded-2xl shrink-0">
          {(['service', 'inventory', 'revenue'] as const).map(type => (
            <button key={type} onClick={() => setReportType(type)} className={`px-8 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${reportType === type ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {type === 'service' ? 'รายงานซ่อม' : type === 'inventory' ? 'รายงานสต็อก' : 'รายงานการเงิน'}
            </button>
          ))}
        </div>
        
        <div className="flex-1 flex flex-wrap items-center gap-4 justify-center xl:justify-end w-full">
           <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
              <Calendar size={14} className="text-slate-400" />
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none" />
              <span className="text-slate-300 mx-1">—</span>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none" />
           </div>
           <button onClick={fetchReportData} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-100">
              <Filter size={18} />
           </button>
        </div>
      </div>

      {/* Print-Only Header */}
      <div className="hidden print:block mb-10 border-b-4 border-slate-900 pb-8">
        <div className="flex justify-between items-end">
           <div>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">I-MOTOR SERVICE REPORT</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Official Operational & Financial Audit Document</p>
           </div>
           <div className="text-right">
              <p className="text-xs font-black uppercase">วันที่พิมพ์: {new Date().toLocaleString('th-TH')}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase">ช่วงข้อมูล: {startDate} ถึง {endDate}</p>
           </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {reportType !== 'inventory' ? (
           <>
             <SummaryCard label="จำนวนใบงานทั้งหมด" value={summary.totalOrders} subValue={`เสร็จสิ้น ${summary.completed}`} icon={TrendingUp} color="text-blue-600" bg="bg-blue-50" />
             <SummaryCard label="รายได้รวม (Revenue)" value={`฿${summary.revenue.toLocaleString()}`} subValue="ก่อนหักค่าใช้จ่าย" icon={Banknote} color="text-emerald-600" bg="bg-emerald-50" />
             <SummaryCard label="ค่าแรงช่างรวม" value={`฿${summary.labor.toLocaleString()}`} subValue="Gross Labor Profit" icon={Wrench} color="text-orange-600" bg="bg-orange-50" />
             <SummaryCard label="Service Efficiency" value={`${summary.efficiency}%`} subValue="Completion Rate" icon={Activity} color="text-purple-600" bg="bg-purple-50" />
           </>
         ) : (
           <>
             <SummaryCard label="รายการอะไหล่ (SKUs)" value={summary.totalSKUs} subValue="Active Catalog" icon={Package} color="text-blue-600" bg="bg-blue-50" />
             <SummaryCard label="จำนวนรวมในคลัง" value={summary.totalStock} subValue="Total Units" icon={Activity} color="text-indigo-600" bg="bg-indigo-50" />
             <SummaryCard label="สต็อกต่ำ (Critical)" value={summary.lowStockItems} subValue="SKUs needing reorder" icon={ShieldCheck} color="text-rose-600" bg="bg-rose-50" />
             <SummaryCard label="มูลค่าคลังรวม (Cost)" value={`฿${summary.inventoryValue.toLocaleString()}`} subValue="Asset Valuation" icon={Banknote} color="text-slate-900" bg="bg-slate-100" />
           </>
         )}
      </div>

      {/* Main Report Table */}
      <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl overflow-hidden print:shadow-none print:border-slate-200">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between print:hidden">
            <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400">Detailed Transaction Log</h4>
            <span className="text-[10px] font-bold text-blue-500 uppercase bg-blue-50 px-3 py-1 rounded-full">{data.length} รายการ</span>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50/50 print:bg-slate-100 text-slate-400 print:text-slate-900 text-[9px] font-black uppercase tracking-widest">
                     <th className="px-10 py-5 border-b border-slate-100">เอกสาร / รายการ</th>
                     <th className="px-10 py-5 border-b border-slate-100">วันที่สร้าง</th>
                     <th className="px-10 py-5 border-b border-slate-100 text-center">สถานะ / ประเภท</th>
                     <th className="px-10 py-5 border-b border-slate-100 text-right">ยอดรวม / คงเหลือ</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50 print:divide-slate-200">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center uppercase text-[10px] font-black tracking-widest text-slate-300 animate-pulse">Fetching Real-time Report Data...</td>
                    </tr>
                  ) : data.length > 0 ? data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-10 py-6">
                          <p className="font-black text-xs uppercase text-slate-900">{item.order_number || item.sku}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase">{item.name || item.issue_description?.substring(0, 30) + '...'}</p>
                       </td>
                       <td className="px-10 py-6">
                          <p className="text-[10px] font-black text-slate-600">{new Date(item.created_at).toLocaleDateString('th-TH')}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase">{new Date(item.created_at).toLocaleTimeString('th-TH')}</p>
                       </td>
                       <td className="px-10 py-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${
                             item.status === WorkOrderStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' :
                             item.status === WorkOrderStatus.CANCELLED ? 'bg-rose-50 text-rose-600' :
                             item.category ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                             {item.status || item.category || 'N/A'}
                          </span>
                       </td>
                       <td className="px-10 py-6 text-right">
                          <p className="text-sm font-black italic text-slate-900">
                             {item.total_amount ? `฿${item.total_amount.toLocaleString()}` : item.stock_level}
                          </p>
                          {item.labor_cost && <p className="text-[9px] text-slate-400 font-bold">Labor: ฿{item.labor_cost.toLocaleString()}</p>}
                       </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center text-slate-300 font-bold italic text-sm">ไม่พบข้อมูลรายงานในช่วงเวลาที่กำหนด</td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
         {/* Footer Summaries for Print */}
         <div className="hidden print:block p-10 bg-slate-50 border-t-2 border-slate-200">
            <div className="grid grid-cols-2 gap-10">
               <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">หมายเหตุประกอบรายงาน</p>
                  <p className="text-[10px] text-slate-600 mt-2 leading-relaxed italic">
                     รายงานฉบับนี้ถูกสร้างขึ้นโดยระบบอัตโนมัติ I-MOTOR CENTRAL ERP ข้อมูลทั้งหมดได้รับการยืนยันความถูกต้องจากฐานข้อมูลกลาง ณ วันที่และเวลาที่ปรากฏด้านบน
                  </p>
               </div>
               <div className="text-right space-y-2">
                  <div className="flex justify-between items-center text-slate-400 font-bold text-[10px] uppercase">
                     <span>จำนวนรายการทั้งหมด</span>
                     <span className="text-slate-900">{data.length} รายการ</span>
                  </div>
                  <div className="flex justify-between items-center text-blue-600 font-black text-xl italic pt-4 border-t border-slate-200">
                     <span className="uppercase text-[12px] tracking-widest">ยอดสุทธิรวม</span>
                     <span>฿{summary.revenue?.toLocaleString() || summary.inventoryValue?.toLocaleString()}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ label, value, subValue, icon: Icon, color, bg }: any) => (
  <div className={`${bg} p-6 rounded-[32px] border border-white shadow-sm flex items-center gap-6 transition-all hover:scale-[1.02] print:bg-white print:border-slate-200`}>
     <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center ${color} shadow-sm print:border print:border-slate-100`}>
        <Icon size={24}/>
     </div>
     <div className="flex-1">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p className={`text-2xl font-black ${color} tracking-tight italic`}>{value}</p>
        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{subValue}</p>
     </div>
  </div>
);
