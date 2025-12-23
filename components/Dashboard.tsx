
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
  ChevronRight
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

const data = [
  { name: 'จ.', income: 4500, repairs: 12 },
  { name: 'อ.', income: 5200, repairs: 15 },
  { name: 'พ.', income: 3800, repairs: 8 },
  { name: 'พฤ.', income: 6500, repairs: 22 },
  { name: 'ศ.', income: 4800, repairs: 14 },
  { name: 'ส.', income: 7200, repairs: 25 },
  { name: 'อา.', income: 2500, repairs: 5 },
];

const StatCard = ({ title, value, icon: Icon, trend, color, bgGradient }: any) => (
  <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-700 group relative overflow-hidden">
    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-[0.03] ${color} group-hover:scale-150 transition-transform duration-1000`}></div>
    <div className="flex items-center justify-between mb-8 relative z-10">
      <div className={`p-4.5 rounded-[22px] ${bgGradient} text-white shadow-xl transition-transform group-hover:scale-110 group-hover:rotate-3 duration-500`}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1.5 text-[11px] font-black px-4 py-2 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} shadow-sm border border-white/50`}>
          {trend > 0 ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-slate-400 text-[10px] lg:text-[11px] font-black uppercase tracking-[0.25em] mb-2">{title}</h3>
      <div className="flex items-baseline gap-1.5">
        <p className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        <span className="text-[11px] font-bold text-slate-300 tracking-widest">THB</span>
      </div>
    </div>
  </div>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-12 lg:space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.25em] shadow-lg">ระบบจัดการสาขาอย่างเป็นทางการ</span>
            <div className="h-1 w-12 bg-blue-500/30 rounded-full"></div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none">
            I-MOTOR <span className="text-blue-600">CENTRAL</span>
          </h1>
          <p className="text-slate-500 font-semibold text-base lg:text-lg max-w-xl leading-relaxed">
            ยินดีต้อนรับกลับมา, <span className="text-slate-900 font-black">คุณณัฐวุฒิ</span> <br className="hidden md:block"/>
            บริหารจัดการงานศูนย์บริการ I-Motor สาขาสมุทรปราการ ได้อย่างเต็มประสิทธิภาพ
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button className="h-16 px-8 bg-white/70 backdrop-blur-md border border-white border-b-blue-100 text-slate-800 rounded-3xl text-sm font-black hover:bg-white hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3 shadow-sm uppercase tracking-wider">
            <Settings2 size={18} />
            จัดการสาขา
          </button>
          <button className="h-16 px-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl text-sm font-black shadow-[0_20px_40px_rgba(37,99,235,0.25)] hover:shadow-[0_25px_50px_rgba(37,99,235,0.35)] transition-all active:scale-95 flex items-center gap-4 uppercase tracking-widest group">
            <Zap size={20} className="group-hover:animate-pulse" />
            เปิดใบงานใหม่
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        <StatCard title="รายได้งานบริการวันนี้" value="24,500" icon={Banknote} trend={14.8} color="bg-blue-600" bgGradient="bg-gradient-to-br from-blue-500 to-blue-700" />
        <StatCard title="กำลังดำเนินการซ่อม" value="18" icon={Wrench} trend={-3.2} color="bg-slate-900" bgGradient="bg-gradient-to-br from-slate-800 to-slate-950" />
        <StatCard title="จำนวนลูกค้าใหม่" value="124" icon={Users} trend={28.5} color="bg-indigo-600" bgGradient="bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <StatCard title="ระยะเวลาเฉลี่ย/งาน" value="45m" icon={Zap} color="bg-emerald-600" bgGradient="bg-gradient-to-br from-emerald-500 to-emerald-700" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 lg:gap-14">
        <div className="bg-white/80 backdrop-blur-2xl p-8 lg:p-12 rounded-[56px] border border-white shadow-2xl shadow-blue-100/20 group">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-5">
              <div className="w-2.5 h-12 bg-blue-600 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]"></div>
              แนวโน้มรายได้
            </h3>
            <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/50">
              <button className="px-6 py-2.5 bg-white rounded-xl text-[11px] font-black shadow-sm text-blue-600 uppercase">สัปดาห์</button>
              <button className="px-6 py-2.5 text-[11px] font-bold text-slate-400 uppercase">เดือน</button>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dy={20} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dx={-20} />
                <Tooltip 
                  cursor={{stroke: '#2563eb', strokeWidth: 2}}
                  contentStyle={{borderRadius: '32px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '24px'}}
                />
                <Area type="monotone" dataKey="income" stroke="#2563eb" strokeWidth={6} fillOpacity={1} fill="url(#colorIncome)" animationDuration={3000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl p-8 lg:p-12 rounded-[56px] border border-white shadow-2xl shadow-blue-100/20 group">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-5">
              <div className="w-2.5 h-12 bg-emerald-600 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
              จำนวนรถเข้าซ่อม
            </h3>
             <button className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 transition-all hover:rotate-90">
               <Settings2 size={22} />
             </button>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dy={20} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 13, fontWeight: 700}} dx={-20} />
                <Tooltip 
                  cursor={{fill: '#F8FAFF', radius: 24}}
                  contentStyle={{borderRadius: '32px', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', padding: '24px'}}
                />
                <Bar dataKey="repairs" fill="#10b981" radius={[16, 16, 16, 16]} barSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[64px] border border-white shadow-[0_20px_80px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="p-10 lg:p-14 border-b border-blue-50/50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-white to-blue-50/30">
          <div>
            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tighter">กิจกรรมงานบริการล่าสุด</h3>
            <p className="text-slate-400 text-sm lg:text-base font-medium mt-1">อัปเดตสถานะการซ่อมบำรุงแบบเรียลไทม์ภายในศูนย์</p>
          </div>
          <button className="px-10 py-5 bg-slate-900 text-white font-black text-[11px] rounded-[24px] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest active:scale-95">ดูประวัติทั้งหมด</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-blue-50/20 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">
                <th className="px-12 py-8">บัตรงาน (Job Card)</th>
                <th className="px-12 py-8">รุ่นรถ / หมายเลข VIN</th>
                <th className="px-12 py-8">ลูกค้าผู้จดทะเบียน</th>
                <th className="px-12 py-8">สถานะล่าสุด</th>
                <th className="px-12 py-8 text-right">แอคชั่น</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50/50">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-all duration-500 group cursor-pointer">
                  <td className="px-12 py-10">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-lg tracking-tight">IM-WO-24-{100 + i}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">สร้างเมื่อ 2 ชม. ที่แล้ว</span>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-[24px] bg-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                        <Bike size={24} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-base font-black text-slate-900">Vapor {i % 2 === 0 ? 'S' : 'Series'}</p>
                        <p className="text-xs text-slate-400 font-bold tracking-tight">VIN: IM-THA-SP-00{i}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <p className="text-base font-black text-slate-700">คุณอรรถพล มั่นคง</p>
                    <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest mt-1">สมาชิกยืนยันแล้ว</p>
                  </td>
                  <td className="px-12 py-10">
                    <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border ${i % 2 === 0 ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      <span className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                      {i % 2 === 0 ? 'กำลังตรวจเช็ค' : 'เสร็จสมบูรณ์'}
                    </div>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <button className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-2xl transition-all duration-500">
                      <ChevronRight size={24} strokeWidth={3} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
