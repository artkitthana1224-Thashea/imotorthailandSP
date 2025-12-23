
import React, { useState, useEffect } from 'react';
import { Save, Camera, Edit3, X, RefreshCw, ShieldCheck, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';
import { Company, User, UserRole } from '../types';
import { supabase } from '../services/supabaseClient';

interface SettingsViewProps {
  currentUser: User;
  setCurrentUser: (u: User) => void;
  currentCompany: Company;
  setCurrentCompany: (c: Company) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, setCurrentUser, currentCompany, setCurrentCompany }) => {
  const [activeTab, setActiveTab] = useState<'PROFILE' | 'HEALTH'>('PROFILE');
  const [companyForm, setCompanyForm] = useState<Company>(currentCompany);
  const [healthResults, setHealthResults] = useState<{table: string, status: 'ok'|'error', message: string}[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [fixSql, setFixSql] = useState('');

  const runHealthCheck = async () => {
    setIsChecking(true);
    const results: any[] = [];
    const tables = ['companies', 'users', 'customers', 'vehicles', 'parts', 'work_orders'];
    
    for (const table of tables) {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        results.push({ table, status: 'error', message: error.message });
      } else {
        results.push({ table, status: 'ok', message: 'Connection Verified' });
      }
    }
    
    setHealthResults(results);
    generateFixSQL(results);
    setIsChecking(false);
  };

  const generateFixSQL = (results: any[]) => {
    let sql = `-- I-MOTOR ERP SCHEMA REPAIR SCRIPT (RUN IN SUPABASE SQL EDITOR)\n\n`;
    
    // Fix common missing columns causing errors
    sql += `-- 1. Fix Companies (branch_name)\n`;
    sql += `ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS branch_name TEXT DEFAULT 'Headquarters';\n\n`;
    
    sql += `-- 2. Fix Customers (type)\n`;
    sql += `ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'INDIVIDUAL';\n`;
    sql += `ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS loyalty_points INT DEFAULT 0;\n\n`;
    
    sql += `-- 3. Fix Users Table If Missing\n`;
    sql += `CREATE TABLE IF NOT EXISTS public.users (\n  id TEXT PRIMARY KEY,\n  company_id TEXT,\n  name TEXT,\n  email TEXT,\n  role TEXT,\n  avatar TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- 4. Fix Parts (cost_price, sale_price, stock_level, min_stock)\n`;
    sql += `CREATE TABLE IF NOT EXISTS public.parts (\n  id TEXT PRIMARY KEY,\n  company_id TEXT DEFAULT 'c1',\n  sku TEXT,\n  name TEXT,\n  category TEXT,\n  cost_price NUMERIC DEFAULT 0,\n  sale_price NUMERIC DEFAULT 0,\n  stock_level INT DEFAULT 0,\n  min_stock INT DEFAULT 5,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- 5. Create System Config (LINE Keys)\n`;
    sql += `CREATE TABLE IF NOT EXISTS public.system_config (\n  config_key TEXT PRIMARY KEY,\n  config_value TEXT,\n  updated_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- Note: After running this, please Refresh the page.`;
    setFixSql(sql);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in pb-24">
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
        <button onClick={() => setActiveTab('PROFILE')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'PROFILE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>โปรไฟล์บริษัท</button>
        <button onClick={() => setActiveTab('HEALTH')} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'HEALTH' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>ระบบตรวจสอบ</button>
      </div>

      {activeTab === 'PROFILE' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-10">
           <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-[28px] bg-slate-50 p-4 border-2 border-slate-100">
                 <img src={companyForm.logo} className="w-full h-full object-contain" />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase italic tracking-tighter">ตั้งค่าบริษัท</h2>
                 <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Company & Brand Management</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ชื่อบริษัท</label>
                 <input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-bold text-xs outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-1">สาขา</label>
                 <input type="text" value={companyForm.branch_name} onChange={e => setCompanyForm({...companyForm, branch_name: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-bold text-xs outline-none" />
              </div>
           </div>
           <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center justify-center gap-3">
              <Save size={18}/> บันทึกข้อมูลบริษัท
           </button>
        </div>
      )}

      {activeTab === 'HEALTH' && (
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Database Consistency</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">ตรวจสอบและแก้ไขปัญหาการเชื่อมต่อฐานข้อมูล</p>
                 </div>
                 <button onClick={runHealthCheck} disabled={isChecking} className="px-6 py-3 bg-blue-600 text-white rounded-xl font-black uppercase text-[9px] flex items-center gap-2">
                    <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''}/> {isChecking ? 'Checking...' : 'ตรวจสอบระบบ'}
                 </button>
              </div>

              <div className="space-y-3">
                 {healthResults.map((r, i) => (
                    <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between ${r.status === 'ok' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                       <div className="flex items-center gap-4">
                          {r.status === 'ok' ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertCircle className="text-rose-500" size={18}/>}
                          <span className="text-[10px] font-black uppercase tracking-tight">TABLE: {r.table}</span>
                       </div>
                       <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${r.status === 'ok' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
                          {r.status === 'ok' ? 'Verified' : 'Error'}
                       </span>
                    </div>
                 ))}
              </div>
           </div>

           {fixSql && (
              <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl space-y-6 animate-in">
                 <div className="flex items-center gap-3 text-emerald-400">
                    <FileCode size={20}/>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">SQL REPAIR SCRIPT (แก้ไขปัญหา Schema Cache)</h4>
                 </div>
                 <pre className="text-[9px] font-mono text-emerald-500 bg-black/40 p-6 rounded-2xl overflow-x-auto border border-emerald-500/20 leading-relaxed">
                    {fixSql}
                 </pre>
                 <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                    <p className="text-[9px] font-bold text-emerald-400 italic">
                       * วิธีแก้ไข: คัดลอกโค้ดด้านบนทั้งหมด ไปวางในช่อง SQL Editor ของ Supabase แล้วกดปุ่ม Run เพื่อเพิ่ม Column ที่ขาดหายไป จากนั้นรีเฟรชหน้านี้ครับ
                    </p>
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
};
