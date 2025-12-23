
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Bike, Package, Wrench, BarChart3, Settings, 
  Search, Sun, Moon, Wallet, X, Menu, ShieldCheck
} from 'lucide-react';
import { Company, UserRole } from '../types';

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
    className={`flex items-center w-full p-4 my-1 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg scale-[1.02]' 
        : 'text-slate-400 hover:bg-white/40 dark:hover:bg-slate-800/60 hover:text-slate-900'
    }`}
  >
    <span className={`flex-shrink-0 transition-all duration-300 ${active ? 'scale-110 ' + colorClass : 'group-hover:scale-110 ' + colorClass}`}>
      {icon}
    </span>
    {!isCollapsed && <span className="ml-4 text-[11px] uppercase tracking-widest whitespace-nowrap">{label}</span>}
  </button>
);

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: any;
  setCurrentUser: (u: any) => void;
  currentCompany: Company;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  activeTab, 
  setActiveTab, 
  currentUser, 
  setCurrentUser,
  currentCompany, 
  isDarkMode, 
  toggleDarkMode,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsMobileNavVisible(false);
      } else {
        setIsMobileNavVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: <LayoutDashboard size={18} />, color: 'text-blue-500' },
    { id: 'service', label: 'งานซ่อม', icon: <Wrench size={18} />, color: 'text-indigo-500' },
    { id: 'inventory', label: 'คลังอะไหล่', icon: <Package size={18} />, color: 'text-orange-500' },
    { id: 'customers', label: 'ลูกค้า', icon: <Users size={18} />, color: 'text-teal-500' },
    { id: 'vehicles', label: 'รถ EV', icon: <Bike size={18} />, color: 'text-rose-500' },
    { id: 'billing', label: 'การเงิน', icon: <Wallet size={18} />, color: 'text-sky-500' },
    { id: 'reports', label: 'วิเคราะห์', icon: <BarChart3 size={18} />, color: 'text-purple-500' },
    { id: 'settings', label: 'ตั้งค่า', icon: <Settings size={18} />, color: 'text-slate-500' },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="flex flex-col items-center justify-center h-40 border-b border-slate-50 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center overflow-hidden p-1">
             <img src={currentCompany.logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
        </div>
        <nav className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeTab === item.id}
              onClick={() => setActiveTab(item.id)}
              isCollapsed={!isSidebarOpen}
              colorClass={item.color}
            />
          ))}
        </nav>
        <div className="p-6">
          <button onClick={toggleDarkMode} className="flex items-center justify-center w-full h-11 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-400">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 md:px-10 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hidden md:block">
               <Menu size={20} />
             </button>
             <h2 className="text-sm font-black uppercase italic tracking-tighter text-slate-400">
                {menuItems.find(m => m.id === activeTab)?.label}
             </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">{currentUser.name}</p>
                <p className="text-[7px] font-bold text-blue-500 uppercase">{currentUser.role}</p>
             </div>
             <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                <img src={currentUser.avatar} className="w-full h-full object-cover" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32 scrollbar-hide">
          {children}
        </main>

        {/* Smart Mobile Nav */}
        <div className={`md:hidden fixed bottom-6 left-6 right-6 h-16 bg-slate-900/95 backdrop-blur-xl shadow-2xl rounded-[28px] flex items-center justify-around px-4 z-50 border border-white/10 transition-all duration-500 ${isMobileNavVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
          {menuItems.slice(0, 5).map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg scale-110' : 'text-slate-400'}`}>
              {item.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
