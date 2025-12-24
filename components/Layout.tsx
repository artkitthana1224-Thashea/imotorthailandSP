
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Bike, Package, Wrench, BarChart3, Settings, 
  Search, Sun, Moon, Wallet, X, Menu
} from 'lucide-react';
import { Company, UserRole } from '../types';

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
  children, activeTab, setActiveTab, currentUser, setCurrentUser, currentCompany, isDarkMode, toggleDarkMode,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsMobileNavVisible(false); // Scroll Down - Hide
      } else {
        setIsMobileNavVisible(true); // Scroll Up - Show
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: <LayoutDashboard size={20} />, color: 'text-blue-500' },
    { id: 'service', label: 'งานซ่อม', icon: <Wrench size={20} />, color: 'text-indigo-500' },
    { id: 'inventory', label: 'คลังอะไหล่', icon: <Package size={20} />, color: 'text-orange-500' },
    { id: 'customers', label: 'ลูกค้า CRM', icon: <Users size={20} />, color: 'text-teal-500' },
    { id: 'vehicles', label: 'รถ EV', icon: <Bike size={20} />, color: 'text-rose-500' },
    { id: 'billing', label: 'การเงิน', icon: <Wallet size={20} />, color: 'text-sky-500' },
    { id: 'reports', label: 'วิเคราะห์', icon: <BarChart3 size={20} />, color: 'text-purple-500' },
    { id: 'settings', label: 'ตั้งค่า', icon: <Settings size={20} />, color: 'text-slate-500' },
  ];

  const currentMenu = menuItems.find(m => m.id === activeTab);

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-24'}`}>
        <div className="flex flex-col items-center justify-center h-40 border-b border-slate-50 dark:border-slate-800">
          <div className="w-16 h-16 rounded-2xl bg-white shadow-md flex items-center justify-center p-1 overflow-hidden">
             <img src={currentCompany.logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          {isSidebarOpen && <h1 className="mt-4 text-[10px] font-black uppercase italic tracking-widest text-slate-400">Enterprise ERP</h1>}
        </div>
        <nav className="flex-1 px-4 py-4 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full p-4 my-1 rounded-2xl transition-all ${activeTab === item.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
            >
              <span className={activeTab === item.id ? 'text-white' : item.color}>{item.icon}</span>
              {isSidebarOpen && <span className="ml-4 text-[11px] uppercase tracking-widest">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hidden md:block">
               <Menu size={20} />
             </button>
             <h2 className="text-[12px] uppercase italic tracking-tighter text-slate-400">
                I-MOTOR / <span className="text-slate-900 dark:text-white">{currentMenu?.label}</span>
             </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-[10px] text-slate-900 dark:text-white uppercase leading-none">{currentUser.name}</p>
                <p className="text-[7px] text-blue-500 uppercase mt-1 tracking-widest">{currentUser.role}</p>
             </div>
             <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100 bg-slate-100">
                <img src={currentUser.avatar} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentUser.name}&background=random` }} />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 pb-32 md:pb-10 scrollbar-hide">
          {children}
        </main>

        {/* Premium Mobile Navigation */}
        <div className={`md:hidden fixed bottom-6 left-6 right-6 h-18 bg-blue-50/80 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(37,99,235,0.3)] rounded-[32px] flex items-center justify-around px-2 z-50 border border-white/40 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isMobileNavVisible ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}>
          {menuItems.slice(0, 5).map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)} 
              className={`p-4 rounded-[24px] transition-all duration-300 relative ${activeTab === item.id ? 'text-blue-600 scale-110' : 'text-slate-400 opacity-70 hover:opacity-100'}`}
            >
              {item.icon}
              {activeTab === item.id && (
                <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></span>
              )}
            </button>
          ))}
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-4 rounded-[24px] transition-all duration-300 ${activeTab === 'settings' ? 'text-blue-600 scale-110' : 'text-slate-400 opacity-70'}`}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
