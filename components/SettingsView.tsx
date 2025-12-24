
import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Camera, X, RefreshCw, ShieldCheck, AlertCircle, FileCode, CheckCircle2, 
  Settings as SettingsIcon, BellRing, User as UserIcon, LogOut, Link, Copy, Database
} from 'lucide-react';
import { Company, User, UserRole } from '../types';
import { supabase } from '../services/supabaseClient';

interface SettingsViewProps {
  currentUser: User;
  setCurrentUser: (u: User) => void;
  currentCompany: Company;
  setCurrentCompany: (c: Company) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, setCurrentUser, currentCompany, setCurrentCompany }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'INTEGRATION' | 'HEALTH'>('PROFILE');
  const [userForm, setUserForm] = useState<User>(currentUser);
  const [lineConfig, setLineConfig] = useState({
    accessToken: '',
    groupId: '',
    channelSecret: ''
  });
  const [healthResults, setHealthResults] = useState<{table: string, status: 'ok'|'error', message: string}[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const repairSql = `-- 🛠️ I-MOTOR SQL REPAIR SCRIPT 🛠️
-- กรุณารันโค้ดทั้งหมดนี้ใน Supabase SQL Editor เพื่อแก้ไข Error และคอลัมน์ที่หายไป

-- 1. เพิ่มคอลัมน์ updated_at ในตาราง users (หากไม่มี)
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. เพิ่มคอลัมน์ที่จำเป็นในตาราง work_orders (ซ่อมจุดที่ Error: duration_hours)
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS duration_hours NUMERIC DEFAULT 0;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS mechanic_id UUID REFERENCES users(id);
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS parts_used JSONB DEFAULT '[]';
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES vehicles(id);
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS labor_cost NUMERIC DEFAULT 0;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS issue_description TEXT;
ALTER TABLE work_orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING';

-- 3. ตรวจสอบตารางอื่นๆ
ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);
ALTER TABLE parts ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id);

-- 4. รีเฟรช Schema Cache (สำคัญมากเพื่อให้ระบบมองเห็นคอลัมน์ใหม่ทันที)
NOTIFY pgrst, 'reload schema';`;

  useEffect(() => {
    if (activeTab === 'INTEGRATION') {
      fetchLineConfig();
    }
  }, [activeTab]);

  const fetchLineConfig = async () => {
    const { data } = await supabase.from('system_config').select('*');
    if (data) {
      const config: any = {};
      data.forEach((item: any) => { config[item.config_key] = item.config_value; });
      setLineConfig({
        accessToken: config['LINE_ACCESS_TOKEN'] || '',
        groupId: config['LINE_GROUP_ID'] || '',
        channelSecret: config['LINE_CHANNEL_SECRET'] || ''
      });
    }
  };

  const saveLineConfig = async () => {
    setIsSaving(true);
    const updates = [
      { config_key: 'LINE_ACCESS_TOKEN', config_value: lineConfig.accessToken },
      { config_key: 'LINE_GROUP_ID', config_value: lineConfig.groupId },
      { config_key: 'LINE_CHANNEL_SECRET', config_value: lineConfig.channelSecret }
    ];
    await supabase.from('system_config').upsert(updates);
    alert("บันทึกการตั้งค่า LINE สำเร็จ");
    setIsSaving(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserForm({ ...userForm, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const getErrorString = (err: any) => {
    if (!err) return "Unknown Error";
    if (typeof err === 'string') return err;
    if (err.message) return err.message;
    if (err.details) return err.details;
    try {
      return JSON.stringify(err, null, 2);
    } catch (e) {
      return String(err);
    }
  };

  const saveUserProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('users').update({
        name: userForm.name,
        avatar: userForm.avatar,
        updated_at: new Date().toISOString()
      }).eq('id', currentUser.id);

      if (error) {
        alert("Error saving profile: " + getErrorString(error));
      } else {
        setCurrentUser(userForm);
        alert("อัปเดตโปรไฟล์และบันทึกรูปภาพสำเร็จ");
      }
    } catch (err: any) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + getErrorString(err));
    } finally {
      setIsSaving(false);
    }
  };

  const runHealthCheck = async () => {
    setIsChecking(true);
    const results: any[] = [];
    const tables = ['companies', 'users', 'customers', 'vehicles', 'parts', 'work_orders', 'system_config'];
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      results.push({ table, status: error ? 'error' : 'ok', message: error ? getErrorString(error) : 'Validated' });
    }
    setHealthResults(results);
    setIsChecking(false);
  };

  const copyRepairSql = () => {
    navigator.clipboard.writeText(repairSql);
    alert("คัดลอก SQL Script เรียบร้อยแล้ว! กรุณานำไปรันที่ Supabase SQL Editor เพื่อซ่อมแซม duration_hours");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in pb-24">
      <div className="flex bg-white p-1.5 rounded-3xl border border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
        <button onClick={() => setActiveTab('PROFILE')} className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'PROFILE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>โปรไฟล์</button>
        <button onClick={() => setActiveTab('INTEGRATION')} className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'INTEGRATION' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>การเชื่อมต่อ</button>
        <button onClick={() => setActiveTab('HEALTH')} className={`flex-1 py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'HEALTH' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>ระบบตรวจสอบ</button>
      </div>

      {activeTab === 'PROFILE' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-10">
           <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-[40px] bg-slate-50 p-1 border-2 border-slate-100 flex items-center justify-center overflow-hidden shadow-inner">
                   <img src={userForm.avatar} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${userForm.name}&background=random` }} />
                </div>
                <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white">
                   <Camera size={18}/>
                </button>
                <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
              </div>
              <div className="text-center">
                 <h2 className="text-xl font-black uppercase italic tracking-tighter">{userForm.name}</h2>
                 <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">{userForm.role}</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ชื่อผู้ใช้งาน</label>
                 <input type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">อีเมล</label>
                 <input type="email" value={userForm.email} readOnly className="w-full h-14 px-6 bg-slate-100 text-slate-400 rounded-2xl font-black text-xs outline-none cursor-not-allowed" />
              </div>
           </div>

           <button onClick={saveUserProfile} disabled={isSaving} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
              {isSaving ? "Saving..." : <><Save size={18}/> บันทึกข้อมูลและรูปโปรไฟล์</>}
           </button>
        </div>
      )}

      {activeTab === 'HEALTH' && (
        <div className="space-y-10">
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">System Health Check</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Database & Connection Audit</p>
                 </div>
                 <button onClick={runHealthCheck} disabled={isChecking} className="px-6 py-3 bg-blue-600 text-white rounded-xl uppercase font-black text-[9px] flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-100">
                    <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''}/> {isChecking ? 'Checking...' : 'เริ่มตรวจสอบ'}
                 </button>
              </div>
              
              <div className="space-y-3">
                 {healthResults.length > 0 ? healthResults.map((r, i) => (
                    <div key={i} className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${r.status === 'ok' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                       <div className="flex items-center gap-4">
                          {r.status === 'ok' ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertCircle className="text-rose-500" size={18}/>}
                          <span className="text-[10px] font-black uppercase tracking-wider">Table: {r.table}</span>
                       </div>
                       <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${r.status === 'ok' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>{r.status}</span>
                    </div>
                 )) : (
                    <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-[32px] opacity-40">
                       <Database className="mx-auto mb-3" size={32}/>
                       <p className="text-[10px] font-black uppercase tracking-widest">กดปุ่มเริ่มตรวจสอบเพื่อเริ่มการ Diagnostics</p>
                    </div>
                 )}
              </div>
           </div>

           <div className="bg-slate-900 p-10 rounded-[48px] text-white space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                    <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-xl">
                       <FileCode size={24}/>
                    </div>
                    <div>
                       <h4 className="text-lg font-black uppercase italic tracking-tighter">SQL Schema Repair Tool</h4>
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed mt-1">
                          เครื่องมือซ่อมแซมโครงสร้างฐานข้อมูล (Schema Repair)
                       </p>
                    </div>
                 </div>
                 <button onClick={copyRepairSql} className="h-12 px-8 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-3 transition-all active:scale-95">
                    <Copy size={16}/> คัดลอก SQL Code
                 </button>
              </div>

              <div className="relative group">
                 <div className="absolute -top-3 left-6 px-3 py-1 bg-blue-600 text-[8px] font-black uppercase tracking-[0.2em] rounded-md z-10 shadow-lg">SQL EDITOR CODE</div>
                 <pre className="bg-black/40 p-8 rounded-[32px] text-[11px] font-mono text-blue-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-white/5 shadow-inner">
                    {repairSql}
                 </pre>
              </div>

              <div className="bg-blue-500/10 p-6 rounded-3xl border border-blue-500/20 flex gap-4 items-start">
                 <AlertCircle className="text-blue-400 shrink-0 mt-0.5" size={18}/>
                 <p className="text-[10px] text-blue-100 font-medium leading-relaxed">
                    <b>คำแนะนำ:</b> หากคุณพบ Error เช่น <span className="text-blue-300">"duration_hours missing"</span> ให้นำโค้ดด้านบนนี้ไปรันในเมนู **SQL Editor** ของ Supabase และกดรันเพื่อซ่อมแซมโครงสร้างและรีเฟรชแคช
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
