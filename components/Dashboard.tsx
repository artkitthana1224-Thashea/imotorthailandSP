
import React from 'react';
import { 
  TrendingUp, 
  Wrench, 
  AlertCircle, 
  Users, 
  Banknote, 
  BatteryCharging,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Globe,
  Settings2,
  Bike,
  ShieldCheck,
  Package,
  CalendarCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

const data = [
  { name: 'จ.', income: 4500, repairs: 12 },
  { name: 'อ.', income: 5200, repairs: 15 },
  { name: 'พ.', income: 3800, repairs: 8 },
  { name: 'พฤ.', income: 6500, repairs: 22 },
  { name: 'ศ.', income: 4800, repairs: 14 },
  { name: 'ส.', income: 7200, repairs: 25 },
  { name: 'อา.', income: 2500, repairs: 5 },
];

const StatCard = ({ title, value, icon: Icon, trend, color, bgClass }: any) => (
  <div className={`${bgClass} p-8 rounded-[40px] border border-white/50 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden`}>
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className={`p-4 rounded-2xl bg-white/80 ${color} shadow-sm transition-transform group-hover:scale-110 duration-500`}>
        <Icon size={24} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full bg-white/60 ${trend > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend > 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">{title}</h3>
      <p className="text-3xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      {/* Row 1: Welcome & Main Stats */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[48px] text-white flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-600 text-[10px] font-black uppercase px-3 py-1 rounded-full">สาขาสมุทรปราการ</span>
              <ShieldCheck size={18} className="text-blue-400" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter mb-4">I-MOTOR <span className="text-blue-400">CENTRAL</span></h1>
            <p className="text-slate-300 font-medium leading-relaxed max-w-sm">บริหารจัดการข้อมูลงานซ่อม คลังอะไหล่ และลูกค้าได้อย่างเรียลไทม์</p>
          </div>
          <div className="mt-8 flex gap-4">
             <button onClick={() => setActiveTab('service')} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">เปิดใบงานใหม่</button>
             <button onClick={() => setActiveTab('settings')} className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-all"><Settings2 size={20}/></button>
          </div>
        </div>
        <StatCard title="รายได้วันนี้" value="฿24,500" icon={Banknote} trend={14.8} color="text-blue-600" bgClass="bg-blue-50/50" />
        <StatCard title="ลูกค้าใหม่เดือนนี้" value="124" icon={Users} trend={28.5} color="text-indigo-600" bgClass="bg-indigo-50/50" />
      </div>

      {/* Row 2: Operation Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="งานซ่อมที่กำลังทำ" value="18" icon={Wrench} color="text-orange-600" bgClass="bg-orange-50/50" />
        <StatCard title="อะไหล่ที่ต้องเติม" value="5" icon={Package} color="text-rose-600" bgClass="bg-rose-50/50" />
        <StatCard title="รถทั้งหมดในระบบ" value="542" icon={Bike} color="text-emerald-600" bgClass="bg-emerald-50/50" />
        <StatCard title="เฉลี่ยงานซ่อม/วัน" value="12" icon={CalendarCheck} color="text-purple-600" bgClass="bg-purple-50/50" />
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] border border-white shadow-xl">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div> แนวโน้มรายได้สัปดาห์นี้
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[48px] border border-white shadow-xl">
          <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-1.5 h-6 bg-emerald-600 rounded-full"></div> จำนวนงานซ่อมรายวัน
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="repairs" fill="#10b981" radius={[10, 10, 10, 10]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
