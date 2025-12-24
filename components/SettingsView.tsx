
import React, { useState, useEffect } from 'react';
import { Save, Camera, X, RefreshCw, ShieldCheck, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';
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
        results.push({ table, status: 'ok', message: 'Connected & Column Validated' });
      }
    }
    
    setHealthResults(results);
    generateFixSQL(results);
    setIsChecking(false);
  };

  const generateFixSQL = (results: any[]) => {
    let sql = `-- I-MOTOR ERP FULL SCHEMA RESET & REPAIR (TEXT-BASED IDs)\n`;
    sql += `-- RUN THIS IN SUPABASE SQL EDITOR TO FIX UUID ERRORS\n\n`;
    
    sql += `-- Step 1: Drop existing tables (Warning: This will clear data)\n`;
    sql += `DROP TABLE IF EXISTS work_orders;\n`;
    sql += `DROP TABLE IF EXISTS vehicles;\n`;
    sql += `DROP TABLE IF EXISTS customers;\n`;
    sql += `DROP TABLE IF EXISTS parts;\n`;
    sql += `DROP TABLE IF EXISTS users;\n`;
    sql += `DROP TABLE IF EXISTS companies;\n\n`;

    sql += `-- Step 2: Create Companies\n`;
    sql += `CREATE TABLE companies (\n  id TEXT PRIMARY KEY,\n  name TEXT,\n  logo TEXT,\n  tax_id TEXT,\n  plan TEXT,\n  vat_rate NUMERIC,\n  address TEXT,\n  branch_name TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- Step 3: Create Users\n`;
    sql += `CREATE TABLE users (\n  id TEXT PRIMARY KEY,\n  company_id TEXT REFERENCES companies(id),\n  name TEXT,\n  email TEXT,\n  role TEXT,\n  avatar TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- Step 4: Create Customers\n`;
    sql += `CREATE TABLE customers (\n  id TEXT PRIMARY KEY,\n  company_id TEXT REFERENCES companies(id),\n  name TEXT,\n  phone TEXT,\n  email TEXT,\n  province TEXT,\n  address TEXT,\n  type TEXT DEFAULT 'INDIVIDUAL',\n  loyalty_points INT DEFAULT 0,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- Step 5: Create Vehicles\n`;
    sql += `CREATE TABLE vehicles (\n  id TEXT PRIMARY KEY,\n  customer_id TEXT REFERENCES customers(id),\n  brand TEXT,\n  model TEXT,\n  vin TEXT UNIQUE,\n  battery_type TEXT,\n  motor_power TEXT,\n  warranty_until TEXT,\n  qr_code TEXT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- Step 6: Create Parts\n`;
    sql += `CREATE TABLE parts (\n  id TEXT PRIMARY KEY,\n  company_id TEXT REFERENCES companies(id),\n  sku TEXT,\n  name TEXT,\n  category TEXT,\n  cost_price NUMERIC,\n  sale_price NUMERIC,\n  stock_level INT,\n  min_stock INT,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- Step 7: Create Work Orders\n`;
    sql += `CREATE TABLE work_orders (\n  id TEXT PRIMARY KEY,\n  order_number TEXT,\n  company_id TEXT REFERENCES companies(id),\n  vehicle_id TEXT REFERENCES vehicles(id),\n  customer_id TEXT REFERENCES customers(id),\n  status TEXT,\n  issue_description TEXT,\n  labor_cost NUMERIC,\n  total_amount NUMERIC,\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\n`;

    sql += `-- Step 8: Initial Data\n`;
    sql += `INSERT INTO companies (id, name, logo) VALUES ('1001', 'I-MOTOR MANUFACTURING', 'https://i-motor-thailand.com/wp-content/uploads/2022/03/logo-i-motor.png');\n\n`;

    sql += `-- After running, please refresh the browser tab.`;
    setFixSql(sql);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in pb-24">
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
        <button onClick={() => setActiveTab('PROFILE')} className={`flex-1 py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all ${activeTab === 'PROFILE' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>โปรไฟล์บริษัท</button>
        <button onClick={() => setActiveTab('HEALTH')} className={`flex-1 py-4 rounded-xl text-[10px] uppercase tracking-widest transition-all ${activeTab === 'HEALTH' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>ระบบตรวจสอบ</button>
      </div>

      {activeTab === 'PROFILE' && (
        <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-10">
           <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-[28px] bg-slate-50 p-4 border-2 border-slate-100 flex items-center justify-center overflow-hidden">
                 <img src={companyForm.logo} className="w-full h-full object-contain" />
              </div>
              <div>
                 <h2 className="text-xl uppercase italic tracking-tighter">ตั้งค่าบริษัท</h2>
                 <p className="text-[10px] text-blue-600 uppercase tracking-widest">Brand Management</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-slate-400 ml-1">ชื่อบริษัท</label>
                 <input type="text" value={companyForm.name} onChange={e => setCompanyForm({...companyForm, name: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl text-xs outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase text-slate-400 ml-1">ชื่อสาขา</label>
                 <input type="text" value={companyForm.branch_name} onChange={e => setCompanyForm({...companyForm, branch_name: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl text-xs outline-none" />
              </div>
           </div>
           <button className="w-full py-5 bg-slate-900 text-white rounded-2xl uppercase text-[10px] shadow-xl flex items-center justify-center gap-3">
              <Save size={18}/> บันทึกข้อมูลบริษัท
           </button>
        </div>
      )}

      {activeTab === 'HEALTH' && (
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                 <div>
                    <h3 className="text-xl uppercase italic tracking-tighter">Database Diagnostics</h3>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">ตรวจสอบความสอดคล้องของ Schema ฐานข้อมูล</p>
                 </div>
                 <button onClick={runHealthCheck} disabled={isChecking} className="px-6 py-3 bg-blue-600 text-white rounded-xl uppercase text-[9px] flex items-center gap-2">
                    <RefreshCw size={14} className={isChecking ? 'animate-spin' : ''}/> {isChecking ? 'Checking...' : 'เริ่มตรวจสอบ'}
                 </button>
              </div>

              <div className="space-y-3">
                 {healthResults.map((r, i) => (
                    <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between ${r.status === 'ok' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                       <div className="flex items-center gap-4">
                          {r.status === 'ok' ? <CheckCircle2 className="text-emerald-500" size={18}/> : <AlertCircle className="text-rose-500" size={18}/>}
                          <span className="text-[10px] uppercase tracking-tight">TABLE: {r.table}</span>
                       </div>
                       <span className={`text-[8px] uppercase px-3 py-1 rounded-full ${r.status === 'ok' ? 'bg-emerald-200 text-emerald-700' : 'bg-rose-200 text-rose-700'}`}>
                          {r.status === 'ok' ? 'Validated' : 'Error'}
                       </span>
                    </div>
                 ))}
              </div>
           </div>

           {fixSql && (
              <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl space-y-6 animate-in">
                 <div className="flex items-center gap-3 text-emerald-400">
                    <FileCode size={20}/>
                    <h4 className="text-[10px] uppercase tracking-widest">SQL Repair Tool (คัดลอกไปวางใน Supabase SQL Editor)</h4>
                 </div>
                 <pre className="text-[9px] font-mono text-emerald-500 bg-black/40 p-6 rounded-2xl overflow-x-auto border border-emerald-500/20 leading-relaxed">
                    {fixSql}
                 </pre>
                 <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20">
                    <p className="text-[9px] text-emerald-400 italic leading-relaxed">
                       * วิธีแก้ไข Error UUID: คัดลอกโค้ดด้านบนทั้งหมดไปวางใน Supabase SQL Editor แล้วกดปุ่ม Run เพื่อลบและสร้างตารางใหม่ด้วยประเภท TEXT สำหรับ ID ทั้งหมดครับ (ข้อมูลเดิมจะถูกลบ)
                    </p>
                 </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
};
