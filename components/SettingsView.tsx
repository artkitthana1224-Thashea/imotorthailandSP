
import React, { useRef, useState } from 'react';
import { 
  Settings, MapPin, Building, CreditCard, Shield, Camera, 
  User, Trash2, Image as ImageIcon, Save, Plus, Database, 
  Activity, Users, UserPlus, CheckCircle2, Wrench, FileCode,
  Globe, LayoutGrid, ClipboardList
} from 'lucide-react';
import { Company, UserRole, RepairService } from '../types';
import { supabase } from '../services/supabaseClient';
import { MOCK_REPAIR_SERVICES } from '../constants';

interface SettingsViewProps {
  currentUser: any;
  setCurrentUser: (u: any) => void;
  currentCompany: Company;
  setCurrentCompany: (c: Company) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, setCurrentUser, currentCompany, setCurrentCompany }) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'BRANCH' | 'REPAIR' | 'STAFF' | 'SQL'>('PROFILE');
  
  const [repairServices, setRepairServices] = useState<RepairService[]>(MOCK_REPAIR_SERVICES);
  const [newRepair, setNewRepair] = useState({ name: '', basePrice: 0 });
  
  const [branchData, setBranchData] = useState({ ...currentCompany });

  const testConnection = async () => {
    try {
      const { data, error } = await supabase.from('companies').select('count', { count: 'exact' });
      if (error) throw error;
      alert('การเชื่อมต่อฐานข้อมูล Supabase สำเร็จ!');
    } catch (e) {
      alert('การเชื่อมต่อล้มเหลว ตรวจสอบ API Key อีกครั้ง');
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentCompany({ ...currentCompany, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSQL = () => {
    const sql = `
-- I-MOTOR ERP DATABASE SCHEMA
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo TEXT,
    tax_id TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE repair_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id),
    name TEXT NOT NULL,
    base_price FLOAT DEFAULT 0
);

-- เพิ่มรายการซ่อมเบื้องต้น
INSERT INTO repair_services (name, base_price) VALUES 
('เคลมแบตเตอรี่', 0),
('เปลี่ยนเฟรม', 2500),
('เปลี่ยนล้อ ยาง', 850),
('เปลี่ยนถ่ายน้ำมันเครื่องถึงบ้านลูกค้า', 450);
    `;
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'i_motor_setup.sql';
    a.click();
  };

  const addRepairService = () => {
    if (!newRepair.name) return;
    setRepairServices([...repairServices, { id: Date.now().toString(), ...newRepair }]);
    setNewRepair({ name: '', basePrice: 0 });
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
           <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">การตั้งค่า <span className="text-blue-600">Settings</span></h1>
           <p className="text-slate-500 font-medium">จัดการทุกส่วนของระบบ ERP I-MOTOR</p>
        </div>
        <div className="flex bg-white/60 p-1.5 rounded-[24px] shadow-sm border border-white">
           {[
             { id: 'PROFILE', label: 'โปรไฟล์', icon: <User size={16}/> },
             { id: 'BRANCH', label: 'สาขา', icon: <Building size={16}/> },
             { id: 'REPAIR', label: 'รายการซ่อม', icon: <Wrench size={16}/> },
             { id: 'STAFF', label: 'พนักงาน', icon: <Users size={16}/> },
             { id: 'SQL', label: 'ฐานข้อมูล', icon: <Database size={16}/> }
           ].map(tab => (
             <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-6 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl scale-105' : 'text-slate-400 hover:text-slate-900'}`}>
                {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
             </button>
           ))}
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900 p-10 rounded-[48px] border border-white dark:border-slate-800 shadow-2xl backdrop-blur-xl">
        {activeTab === 'PROFILE' && (
           <div className="space-y-10 animate-in slide-in-from-left-4">
              <div className="flex flex-col items-center text-center">
                 <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                    <img src={currentUser.avatar} className="w-40 h-40 rounded-[48px] shadow-2xl border-8 border-white group-hover:scale-105 transition-all" />
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-xl"><Camera size={20}/></div>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 mt-6 uppercase tracking-tighter">{currentUser.name}</h3>
                 <p className="text-blue-500 font-black text-[10px] tracking-[0.3em] uppercase">{currentUser.role}</p>
                 <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                       const reader = new FileReader();
                       reader.onloadend = () => setCurrentUser({...currentUser, avatar: reader.result as string});
                       reader.readAsDataURL(file);
                    }
                 }} />
              </div>
           </div>
        )}

        {activeTab === 'BRANCH' && (
           <div className="space-y-10 animate-in slide-in-from-left-4">
              <div className="flex flex-col md:flex-row gap-10">
                 <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ชื่อศูนย์บริการ</label>
                       <input type="text" value={branchData.name} onChange={e => setBranchData({...branchData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ที่อยู่สาขา</label>
                       <textarea value={branchData.address} onChange={e => setBranchData({...branchData, address: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold h-32" />
                    </div>
                 </div>
                 <div className="flex flex-col items-center gap-6">
                    <p className="text-[10px] font-black uppercase text-slate-400">โลโก้บริษัท</p>
                    <div className="w-48 h-48 bg-white shadow-xl rounded-[40px] flex items-center justify-center p-6 border-4 border-blue-50 group cursor-pointer relative overflow-hidden" onClick={() => logoInputRef.current?.click()}>
                       <img src={currentCompany.logo} className="w-full h-full object-contain" />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-white"><ImageIcon size={32}/></div>
                    </div>
                    <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                    <button onClick={() => setCurrentCompany({...currentCompany, ...branchData})} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">บันทึกข้อมูลสาขา</button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'REPAIR' && (
           <div className="space-y-8 animate-in slide-in-from-left-4">
              <div className="flex gap-4">
                 <input type="text" placeholder="ชื่อรายการซ่อม..." value={newRepair.name} onChange={e => setNewRepair({...newRepair, name: e.target.value})} className="flex-1 px-6 py-4 bg-slate-50 rounded-2xl font-bold" />
                 <input type="number" placeholder="ค่าแรงพื้นฐาน..." value={newRepair.basePrice} onChange={e => setNewRepair({...newRepair, basePrice: parseFloat(e.target.value)})} className="w-40 px-6 py-4 bg-slate-50 rounded-2xl font-bold" />
                 <button onClick={addRepairService} className="px-8 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest"><Plus size={18}/></button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {repairServices.map(rs => (
                    <div key={rs.id} className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-blue-100">
                       <div>
                          <p className="font-black text-slate-900 uppercase">{rs.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Labor: ฿{rs.basePrice.toLocaleString()}</p>
                       </div>
                       <button onClick={() => setRepairServices(repairServices.filter(i => i.id !== rs.id))} className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {activeTab === 'SQL' && (
           <div className="space-y-10 text-center animate-in slide-in-from-left-4">
              <div className="py-10">
                 <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-100"><FileCode size={48}/></div>
                 <h3 className="text-2xl font-black text-slate-900 uppercase">ระบบจัดการฐานข้อมูล (SQL)</h3>
                 <p className="text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed font-medium">เชื่อมต่อ Supabase ของคุณให้พร้อมใช้งานด้วยโครงสร้างตารางที่เหมาะสมกับ ERP I-MOTOR</p>
                 <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <button onClick={testConnection} className="px-10 py-5 bg-white border border-slate-200 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 justify-center"><Activity size={18}/> ทดสอบการเชื่อมต่อ</button>
                    <button onClick={generateSQL} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 justify-center shadow-2xl shadow-blue-200"><Database size={18}/> Generate SQL Script</button>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'STAFF' && (
           <div className="space-y-8 animate-in slide-in-from-left-4">
              <div className="flex items-center justify-between">
                 <h3 className="text-xl font-black text-slate-900 flex items-center gap-3"><Users className="text-indigo-600"/> รายชื่อพนักงานสาขา</h3>
                 <button className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest">+ เพิ่มพนักงาน</button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                 {[1, 2, 3].map(i => (
                    <div key={i} className="p-6 bg-slate-50 rounded-3xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center font-black">ST</div>
                          <div>
                             <p className="font-black text-slate-900 uppercase">เจ้าหน้าที่ ทดสอบ {i}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Role: MECHANIC</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-2">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Settings size={18}/></button>
                          <button className="p-2 text-slate-400 hover:text-rose-500 transition-all"><Trash2 size={18}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>
    </div>
  );
};
