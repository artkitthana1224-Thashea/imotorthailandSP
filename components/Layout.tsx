
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Bike, 
  Package, 
  Wrench, 
  FileText, 
  BarChart3, 
  Bell, 
  Settings, 
  Menu, 
  X,
  Search,
  MapPin,
  Sun,
  Moon,
  Wallet
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isCollapsed?: boolean;
  colorClass?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick, isCollapsed, colorClass }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full p-4 my-1.5 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl shadow-blue-200/50 dark:shadow-blue-900/20 ring-1 ring-blue-100/50 dark:ring-blue-900/30' 
        : 'text-slate-500 hover:bg-white/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    <span className={`flex-shrink-0 transition-all duration-300 ${active ? 'scale-110 ' + colorClass : 'group-hover:scale-110 ' + colorClass}`}>
      {icon}
    </span>
    {!isCollapsed && <span className="ml-4 font-bold text-sm lg:text-base whitespace-nowrap tracking-tight">{label}</span>}
    {active && !isCollapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  currentCompany: any;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  notifications: any[];
  setNotifications: (n: any[]) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  currentUser, 
  currentCompany, 
  isDarkMode, 
  toggleDarkMode,
  notifications,
  setNotifications
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: <LayoutDashboard size={22} />, colorClass: 'text-blue-500' },
    { id: 'service', label: 'งานซ่อม', icon: <Wrench size={22} />, colorClass: 'text-indigo-500' },
    { id: 'inventory', label: 'คลังอะไหล่', icon: <Package size={22} />, colorClass: 'text-orange-500' },
    { id: 'customers', label: 'ฐานลูกค้า', icon: <Users size={22} />, colorClass: 'text-emerald-500' },
    { id: 'vehicles', label: 'ข้อมูลรถ', icon: <Bike size={22} />, colorClass: 'text-rose-500' },
    { id: 'billing', label: 'การเงิน', icon: <Wallet size={22} />, colorClass: 'text-sky-500' },
    { id: 'reports', label: 'รายงาน', icon: <BarChart3 size={22} />, colorClass: 'text-purple-500' },
    { id: 'settings', label: 'ตั้งค่า', icon: <Settings size={22} />, colorClass: 'text-slate-500' },
  ];

  // LOGO Fix: Use a more reliable visual represention or clear source
  // The original URL might have hotlinking protection. We'll use a stylized container.
  const LOGO_URL = "https://i-motor-thailand.com/wp-content/uploads/2022/03/logo-i-motor.png";

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#f0f9ff] via-[#ffffff] to-[#f0fdf4] dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0B1120] transition-colors duration-700">
      <aside 
        className={`hidden md:flex flex-col bg-white/40 dark:bg-slate-900/60 backdrop-blur-3xl border-r border-white/50 dark:border-slate-800/50 transition-all duration-700 ${
          isSidebarOpen ? 'w-80' : 'w-24'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-44 px-8">
          <div className="w-20 h-20 rounded-full bg-black shadow-2xl flex items-center justify-center border-4 border-white shadow-blue-100 overflow-hidden relative">
             {/* If logo fails, show a stylized 'i' as fallback */}
             <img 
               src={LOGO_URL} 
               alt="I-Motor" 
               className="w-full h-auto p-3 brightness-0 invert scale-125"
               onError={(e) => {
                 (e.target as HTMLImageElement).style.display = 'none';
                 const parent = (e.target as HTMLImageElement).parentElement;
                 if (parent) {
                   const span = document.createElement('span');
                   span.innerText = 'i';
                   span.className = 'text-white text-5xl font-black italic select-none';
                   parent.appendChild(span);
                 }
               }}
             />
          </div>
          {isSidebarOpen && (
            <div className="mt-4 text-center">
               <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">I-MOTOR</h1>
               <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-widest bg-white/80 dark:bg-slate-800/80 px-4 py-1.5 rounded-full mt-1.5 shadow-sm">SMART ERP</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-5 py-6 overflow-y-auto scrollbar-hide space-y-1.5">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              isCollapsed={!isSidebarOpen}
              colorClass={item.colorClass}
            />
          ))}
        </nav>

        <div className="p-8 space-y-4">
          <button onClick={toggleDarkMode} className="flex items-center justify-center w-full h-12 bg-white/60 dark:bg-slate-800/30 rounded-2xl border border-white/80 dark:border-slate-700/40 text-blue-500 dark:text-amber-400 transition-all shadow-sm">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <header className="h-24 bg-white/40 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white/50 dark:border-slate-800/50 px-6 md:px-12 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-6">
             <div className="md:hidden w-12 h-12 rounded-2xl bg-black flex items-center justify-center p-2 shadow-xl border-2 border-white">
                <img 
                  src={LOGO_URL} 
                  className="w-full brightness-0 invert" 
                  alt="I-Motor"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const span = document.createElement('span');
                      span.innerText = 'i';
                      span.className = 'text-white text-2xl font-black italic';
                      parent.appendChild(span);
                    }
                  }}
                />
             </div>
             <div className="relative hidden sm:block w-72 lg:w-[480px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="ค้นหาข้อมูลในระบบ..." className="w-full pl-14 pr-6 py-4 bg-white/80 dark:bg-slate-800/60 border border-white/50 dark:border-slate-700/80 rounded-[22px] text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none shadow-sm" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-4 bg-white/80 dark:bg-slate-800/50 rounded-2xl border border-white/50 relative transition-all shadow-sm">
              <Bell size={22} className="text-slate-500" />
              {notifications.length > 0 && <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>}
            </button>
            <div className="flex items-center gap-4 cursor-pointer p-1.5 pr-5 bg-white/60 dark:bg-slate-800/30 rounded-[24px] border border-white/50 shadow-sm">
              <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-2xl object-cover shadow-inner" />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{currentUser.name}</p>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{currentUser.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-14 pb-36 md:pb-12">
          {children}
        </main>

        {/* Updated Mobile Navigation - Optimized for 6 Menu Items with Thai labels */}
        <div className="md:hidden fixed bottom-6 left-4 right-4 h-22 bg-white/80 dark:bg-slate-900/90 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] rounded-[32px] flex items-center justify-around px-1 z-50 border border-white/70 ring-1 ring-black/5 overflow-hidden">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'หน้าหลัก' },
            { id: 'service', icon: <Wrench size={20} />, label: 'งานซ่อม' },
            { id: 'inventory', icon: <Package size={20} />, label: 'คลังอะไหล่' },
            { id: 'customers', icon: <Users size={20} />, label: 'ลูกค้า' },
            { id: 'billing', icon: <Wallet size={20} />, label: 'การเงิน' },
            { id: 'reports', icon: <BarChart3 size={20} />, label: 'รายงาน' },
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`flex flex-col items-center justify-center flex-1 h-full rounded-2xl transition-all relative ${
                activeTab === item.id 
                  ? 'text-blue-600 font-black' 
                  : 'text-slate-400 font-medium'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all ${activeTab === item.id ? 'bg-blue-50 dark:bg-blue-900/30 scale-110 shadow-sm' : ''}`}>
                {item.icon}
              </div>
              <span className={`text-[7px] font-black uppercase tracking-tighter mt-1 whitespace-nowrap overflow-hidden text-ellipsis w-full text-center px-1`}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-blue-600"></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
