
import React, { useState, useRef } from 'react';
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
  Wallet,
  ShieldCheck,
  User,
  LogOut,
  Camera,
  Save
} from 'lucide-react';
import { Company } from '../types';

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
    className={`flex items-center w-full p-4 my-1.5 rounded-2xl transition-all duration-500 group ${
      active 
        ? 'bg-white/80 dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl shadow-blue-100/50 dark:shadow-blue-900/20 ring-1 ring-blue-100/50 dark:ring-blue-900/30' 
        : 'text-slate-500 hover:bg-white/40 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
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
  setCurrentUser: (u: any) => void;
  currentCompany: Company;
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
  setCurrentUser,
  currentCompany, 
  isDarkMode, 
  toggleDarkMode,
  notifications,
  setNotifications
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingUser, setEditingUser] = useState(currentUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: 'dashboard', label: 'หน้าหลัก', icon: <LayoutDashboard size={22} />, colorClass: 'text-blue-500' },
    { id: 'service', label: 'งานซ่อมบำรุง', icon: <Wrench size={22} />, colorClass: 'text-indigo-500' },
    { id: 'inventory', label: 'คลังอะไหล่', icon: <Package size={22} />, colorClass: 'text-orange-500' },
    { id: 'customers', label: 'ข้อมูลลูกค้า', icon: <Users size={22} />, colorClass: 'text-emerald-500' },
    { id: 'vehicles', label: 'ฐานข้อมูลรถ', icon: <Bike size={22} />, colorClass: 'text-rose-500' },
    { id: 'billing', label: 'ระบบการเงิน', icon: <Wallet size={22} />, colorClass: 'text-sky-500' },
    { id: 'reports', label: 'รายงานสรุป', icon: <BarChart3 size={22} />, colorClass: 'text-purple-500' },
    { id: 'settings', label: 'ตั้งค่าระบบ', icon: <Settings size={22} />, colorClass: 'text-slate-500' },
  ];

  const handleUpdateProfile = () => {
    setCurrentUser(editingUser);
    setShowProfileModal(false);
    alert('อัปเดตข้อมูลส่วนตัวเรียบร้อยแล้ว');
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingUser({ ...editingUser, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#f0f9ff] via-[#ffffff] to-[#f0fdf4] dark:from-[#0B1120] dark:via-[#0F172A] dark:to-[#0B1120] transition-colors duration-700">
      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col bg-white/40 dark:bg-slate-900/60 backdrop-blur-3xl border-r border-white dark:border-slate-800 transition-all duration-700 ${isSidebarOpen ? 'w-80' : 'w-24'}`}>
        <div className="flex flex-col items-center justify-center h-48 px-8">
          <div className="w-24 h-24 rounded-full bg-white shadow-2xl flex items-center justify-center border-4 border-white ring-8 ring-blue-50 dark:ring-slate-800 overflow-hidden relative group">
             <img 
               src={currentCompany.logo} 
               alt="Logo" 
               className="w-[85%] h-auto object-contain transition-transform group-hover:scale-110 duration-700"
               onError={(e) => {
                 (e.target as HTMLImageElement).src = 'https://i-motor-thailand.com/wp-content/uploads/2022/03/logo-i-motor.png';
               }}
             />
          </div>
          {isSidebarOpen && (
            <div className="mt-4 text-center">
               <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">I-MOTOR</h1>
               <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 tracking-widest bg-white/80 dark:bg-slate-800/80 px-4 py-1.5 rounded-full mt-1.5 shadow-sm uppercase">Smart ERP System</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-5 py-6 overflow-y-auto scrollbar-hide space-y-1">
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
          <button onClick={toggleDarkMode} className="flex items-center justify-center w-full h-14 bg-white/60 dark:bg-slate-800/30 rounded-2xl border border-white text-blue-500 transition-all shadow-sm">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 overflow-hidden relative">
        <header className="h-24 bg-white/30 dark:bg-slate-900/60 backdrop-blur-2xl border-b border-white dark:border-slate-800 px-6 md:px-12 flex items-center justify-between z-10">
          <div className="flex items-center gap-6">
             <div className="w-14 h-14 rounded-[22px] bg-white flex items-center justify-center p-2 shadow-xl border-4 border-white ring-4 ring-blue-50/50 overflow-hidden cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                <img src={currentCompany.logo} className="w-full h-full object-contain" alt="I-Motor" />
             </div>
             <div className="relative hidden lg:block w-[400px]">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="ค้นหาข้อมูล..." className="w-full pl-14 pr-6 py-4 bg-white/80 dark:bg-slate-800/60 border-none rounded-[24px] text-sm font-bold shadow-sm" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-4 bg-white/80 dark:bg-slate-800/50 rounded-2xl border border-white relative transition-all shadow-sm">
              <Bell size={22} className="text-slate-500" />
              {notifications.length > 0 && <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>}
            </button>
            
            <div onClick={() => { setEditingUser(currentUser); setShowProfileModal(true); }} className="flex items-center gap-4 cursor-pointer p-1.5 pr-5 bg-white/60 dark:bg-slate-800/30 rounded-[28px] border border-white shadow-sm hover:bg-white group">
              <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-2xl object-cover shadow-inner group-hover:scale-110 transition-transform" />
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1">{currentUser.name.split(' ')[0]}</p>
                <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{currentUser.role}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-14 pb-40 md:pb-12 scroll-smooth">
          {children}
        </main>

        {/* Mobile Navigation */}
        <div className="md:hidden fixed bottom-6 left-4 right-4 h-24 bg-white/90 dark:bg-slate-900/95 backdrop-blur-3xl shadow-2xl rounded-[40px] flex items-center justify-around px-2 z-50 border border-white">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={20} />, label: 'หน้าหลัก' },
            { id: 'service', icon: <Wrench size={20} />, label: 'งานซ่อม' },
            { id: 'inventory', icon: <Package size={20} />, label: 'คลัง' },
            { id: 'customers', icon: <Users size={20} />, label: 'ลูกค้า' },
            { id: 'billing', icon: <Wallet size={20} />, label: 'การเงิน' },
            { id: 'settings', icon: <Settings size={20} />, label: 'ตั้งค่า' },
          ].map((item) => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center flex-1 h-[80%] rounded-2xl transition-all ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}>
              <div className={`p-2.5 rounded-[18px] transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg scale-110' : ''}`}>{item.icon}</div>
              <span className={`text-[9px] font-bold mt-2 whitespace-nowrap tracking-tight ${activeTab === item.id ? 'font-black' : 'opacity-70'}`}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[48px] shadow-2xl border border-white/20 animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">จัดการพนักงาน / โปรไฟล์</h3>
               <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={20}/></button>
            </div>
            <div className="p-10 space-y-8 text-center">
               <div className="flex justify-center">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-32 h-32 rounded-[40px] overflow-hidden ring-8 ring-blue-50 dark:ring-slate-800 shadow-2xl transition-all group-hover:scale-105">
                       <img src={editingUser.avatar} className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white transition-all"><Camera size={18} /></div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="space-y-2 text-left">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                     <input type="text" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white shadow-inner" />
                  </div>
                  <div className="space-y-2 text-left">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">อีเมลงาน</label>
                     <input type="email" value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white shadow-inner" />
                  </div>
                  <button onClick={handleUpdateProfile} className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3"><Save size={18}/> บันทึกการเปลี่ยนแปลง</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
