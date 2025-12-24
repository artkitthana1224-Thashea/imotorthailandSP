
import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Camera, X, RefreshCw, ShieldCheck, AlertCircle, FileCode, CheckCircle2, 
  Settings as SettingsIcon, BellRing, User as UserIcon, LogOut, Link
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
  const [companyForm, setCompanyForm] = useState<Company>(currentCompany);
  const [userForm, setUserForm] = useState<User>(currentUser);
  const [lineConfig, setLineConfig] = useState({
    accessToken: '',
    groupId: '',
    channelSecret: ''
  });
  const [healthResults, setHealthResults] = useState<{table: string, status: 'ok'|'error', message: string}[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [fixSql, setFixSql] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const saveUserProfile = async () => {
    setIsSaving(true);
    try {
      // In a real production environment, we'd upload to Supabase Storage first.
      // For this implementation, we store the base64/URL directly in the avatar column.
      const { error } = await supabase.from('users').update({
        name: userForm.name,
        avatar: userForm.avatar,
        updated_at: new Date().toISOString()
      }).eq('id', currentUser.id);

      if (error) {
        alert("Error saving profile: " + error.message);
      } else {
        setCurrentUser(userForm);
        alert("อัปเดตโปรไฟล์และบันทึกรูปภาพสำเร็จ");
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
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
      results.push({ table, status: error ? 'error' : 'ok', message: error ? error.message : 'Validated' });
    }
    setHealthResults(results);
    setIsChecking(false);
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

      {activeTab === 'INTEGRATION' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-10">
           <div className="flex items-center gap-6">
              <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[28px]">
                 <Link size={32}/>
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase italic tracking-tighter">LINE Integration</h2>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Messaging API Configuration</p>
              </div>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">LINE Channel Access Token</label>
                 <input type="password" value={lineConfig.accessToken} onChange={e => setLineConfig({...lineConfig, accessToken: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-blue-500/20" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">LINE Group ID / User ID (Target)</label>
                 <input type="text" value={lineConfig.groupId} onChange={e => setLineConfig({...lineConfig, groupId: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
              </div>
           </div>

           <button onClick={saveLineConfig} disabled={isSaving} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center justify-center gap-3">
              {isSaving ? "Saving..." : <><Save size={18}/> บันทึกการเชื่อมต่อ LINE</>}
           </button>
        </div>
      )}

      {activeTab === 'HEALTH' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8">
           <div className="flex items-center justify-between">
              <div>
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Diagnostics</h3>
                 <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">Schema Compliance Audit</p>
              </div>
              <button onClick={runHealthCheck} disabled={isChecking} className="px-6 py-3 bg-blue-600 text-white rounded-xl uppercase font-black text-[9px] flex items-center gap-2">
                 <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''}/> {isChecking ? 'Checking...' : 'เริ่มตรวจสอบ'}
              </button>
           </div>
           <div className="space-y-3">
              {healthResults.map((r, i) => (
                 <div key={i} className={`p-5 rounded-3xl border flex items-center justify-between transition-all ${r.status === 'ok' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                    <div className="flex items-center gap-4">
                       {r.status === 'ok' ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertCircle className="text-rose-500" size={18}/>}
                       <span className="text-[10px] font-black uppercase">TABLE: {r.table}</span>
                    </div>
                    <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${r.status === 'ok' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>{r.status}</span>
                 </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
