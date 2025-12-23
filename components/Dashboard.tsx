
import React, { useState, useEffect } from 'react';
import { 
  Wrench, Users, Banknote, Package, ShieldCheck, Zap, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { supabase } from '../services/supabaseClient';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const [stats, setStats] = useState({
    todayIncome: 0,
    totalBills: 0,
    newCustomers: 0,
    inProgress: 0,
    lowStock: 0,
    completed: 0,
    totalParts: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const { data: woData } = await supabase.from('work_orders').select('total_amount, status, created_at');
      const { data: custData } = await supabase.from('customers').select('id');
      const { data: partsData } = await supabase.from('parts').select('id, stock_level, min_stock');

      const today = new Date().toISOString().split('T')[0];
      
      const income = woData?.filter(w => w.created_at.startsWith(today)).reduce((sum, w) => sum + Number(w.total_amount), 0) || 0;
      const inProgressCount = woData?.filter(w => w.status !== 'COMPLETED' && w.status !== 'CANCELLED').length || 0;
      const completedCount = woData?.filter(w => w.status === 'COMPLETED').length || 0;
      const lowStockCount = partsData?.filter(p => p.stock_level <= p.min_stock).length || 0;

      setStats({
        todayIncome: income,
        totalBills: woData?.length || 0,
        newCustomers: custData?.length || 0,
        inProgress: inProgressCount,
        lowStock: lowStockCount,
        completed: completedCount,
        totalParts: partsData?.length || 0
      });
    } catch (err) {
      console.error("Dashboard stat fetch error:", err);
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }: any) => (
    <div className={`${bgClass} border border-white/60 p-5 rounded-[32px] shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group`}>
      <div className={`p-3 rounded-2xl bg-white/80 ${colorClass} mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
        <Icon size={20} />
      </div>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-80">{title}</h3>
      <p className="text-xl font-black text-slate-900 tracking-tight">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <div className="xl:col-span-8 bg-gradient-to-br from-indigo-900 via-slate-900 to-blue-900 p-10 rounded-[48px] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-600/80 backdrop-blur-md text-[9px] font-black uppercase px-3 py-1 rounded-full border border-blue-400/20 tracking-widest">Enterprise Edition</span>
              <ShieldCheck size={16} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-2 leading-none uppercase italic">I-MOTOR <span className="text-blue-400">CENTRAL ERP</span></h1>
            <p className="text-slate-400 font-bold text-[11px] uppercase tracking-wider max-w-md leading-relaxed">ระบบบริหารจัดการศูนย์บริการอัจฉริยะ สำหรับรถมอเตอร์ไซค์ไฟฟ้า</p>
          </div>
          <div className="mt-10 flex gap-4 relative z-10">
             <button onClick={() => setActiveTab('service')} className="px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-blue-900/30">เปิดใบงานซ่อม</button>
             <button onClick={() => setActiveTab('inventory')} className="px-10 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all backdrop-blur-sm border border-white/10">คลังอะไหล่</button>
          </div>
        </div>
        
        <div className="xl:col-span-4 grid grid-cols-2 gap-4">
          <StatCard title="รายได้วันนี้" value={`฿${stats.todayIncome.toLocaleString()}`} icon={Banknote} colorClass="text-blue-600" bgClass="bg-blue-50" />
          <StatCard title="บิลทั้งหมด" value={`${stats.totalBills} ใบ`} icon={Zap} colorClass="text-amber-600" bgClass="bg-amber-50" />
          <StatCard title="ลูกค้าทั้งหมด" value={`${stats.newCustomers} คน`} icon={Users} colorClass="text-emerald-600" bgClass="bg-emerald-50" />
          <StatCard title="กำลังซ่อม" value={`${stats.inProgress} งาน`} icon={Clock} colorClass="text-indigo-600" bgClass="bg-indigo-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-rose-50 p-6 rounded-[32px] border border-white flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-rose-500 shadow-sm"><AlertCircle size={28}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">สต็อกต่ำ</p>
            <p className="text-2xl font-black text-slate-900">{stats.lowStock} SKU</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-[32px] border border-white flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm"><CheckCircle2 size={28}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ซ่อมเสร็จแล้ว</p>
            <p className="text-2xl font-black text-slate-900">{stats.completed} คัน</p>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-[32px] border border-white flex items-center gap-6 shadow-sm">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-500 shadow-sm"><Package size={28}/></div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">อะไหล่ทั้งหมด</p>
            <p className="text-2xl font-black text-slate-900">{stats.totalParts} SKU</p>
          </div>
        </div>
      </div>
    </div>
  );
};
