
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WorkOrderView } from './components/WorkOrderView';
import { InventoryView } from './components/InventoryView';
import { CustomerView } from './components/CustomerView';
import { VehicleView } from './components/VehicleView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { BillingView } from './components/BillingView';
import { MOCK_COMPANIES, MOCK_USERS } from './constants';
import { WorkOrder, Customer, Part, Company, User, Vehicle } from './types';
import { supabase } from './services/supabaseClient';
import { AlertCircle, RefreshCcw, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company>(MOCK_COMPANIES[0]);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Start showing the layout immediately even before data finishes
    setLoading(true);
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      // 1. Fetch Company First (Critical for context)
      const { data: compRes, error: compErr } = await supabase.from('companies').select('*').limit(1);
      if (compErr) throw compErr;
      if (compRes && compRes.length > 0) setCurrentCompany(compRes.data?.[0] || compRes[0]);

      // 2. Fetch Other Data in parallel without blocking main render if one fails
      const fetches = [
        supabase.from('vehicles').select('*').then(res => res.data && setVehicles(res.data)),
        supabase.from('customers').select('*').order('name').then(res => res.data && setCustomers(res.data)),
        supabase.from('parts').select('*').then(res => res.data && setParts(res.data)),
        supabase.from('work_orders').select('*').order('created_at', { ascending: false }).then(res => {
          if (res.data) {
            setWorkOrders(res.data.map((d: any) => ({
              ...d,
              orderNumber: d.order_number,
              customer_id: d.customer_id,
              vehicle_id: d.vehicle_id,
              issue_description: d.issue_description,
              labor_cost: d.labor_cost,
              total_amount: d.total_amount,
              created_at: d.created_at
            })));
          }
        })
      ];

      // Wait for all non-critical fetches but catch errors gracefully
      await Promise.allSettled(fetches);
      setError(null);
    } catch (err: any) {
      console.error("Critical fetch error:", err);
      const msg = err.message?.toLowerCase() || "";
      if (msg.includes("does not exist") || msg.includes("relation")) {
        setError("DATABASE_NOT_READY");
      } else {
        setError(err.message || "Unable to connect to service database");
      }
    } finally {
      setLoading(false);
    }
  };

  const activeContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-8 animate-in">
           <div className="relative">
              <div className="w-20 h-20 border-[6px] border-blue-100 rounded-full"></div>
              <div className="w-20 h-20 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <ShieldCheck className="text-blue-600 animate-pulse" size={24} />
              </div>
           </div>
           <div className="text-center space-y-2">
              <h3 className="text-sm font-black uppercase italic tracking-tighter text-slate-900">I-MOTOR CENTRAL</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Initializing System...</p>
           </div>
        </div>
      );
    }

    if (error === "DATABASE_NOT_READY") {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-10 space-y-6">
           <div className="p-6 bg-amber-50 rounded-[40px] text-amber-600">
              <AlertCircle size={48} />
           </div>
           <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter">Database Setup Required</h2>
              <p className="text-slate-500 text-xs mt-2 max-w-sm leading-relaxed">
                 ไม่พบตารางในฐานข้อมูล หรือ Schema ไม่ถูกต้อง<br/>กรุณาไปที่เมนู <b>"ตั้งค่า"</b> > <b>"ระบบตรวจสอบ"</b><br/>เพื่อรัน SQL Repair Script ครับ
              </p>
           </div>
           <button onClick={() => setActiveTab('settings')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
              ไปที่หน้าตั้งค่า
           </button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-10 space-y-6">
           <div className="p-6 bg-rose-50 rounded-[40px] text-rose-600">
              <AlertCircle size={48} />
           </div>
           <div>
              <h2 className="text-xl font-black uppercase italic tracking-tighter text-rose-600">Connection Error</h2>
              <p className="text-slate-500 text-xs mt-2 max-w-sm font-mono bg-slate-100 p-4 rounded-xl overflow-x-auto">
                 {error}
              </p>
           </div>
           <button onClick={() => fetchAllData()} className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-3">
              <RefreshCcw size={16} /> ลองใหม่อีกครั้ง
           </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'service': return <WorkOrderView workOrders={workOrders} setWorkOrders={setWorkOrders} vehicles={vehicles} currentCompany={currentCompany} />;
      case 'inventory': return <InventoryView parts={parts} setParts={setParts} currentCompany={currentCompany} />;
      case 'customers': return <CustomerView customers={customers} setCustomers={setCustomers} currentCompany={currentCompany} />;
      case 'vehicles': return <VehicleView vehicles={vehicles} setVehicles={setVehicles} workOrders={workOrders} currentCompany={currentCompany} />;
      case 'billing': return <BillingView currentCompany={currentCompany} />;
      case 'reports': return <ReportsView />;
      case 'settings': return <SettingsView currentUser={currentUser} setCurrentUser={setCurrentUser} currentCompany={currentCompany} setCurrentCompany={setCurrentCompany} />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  }, [activeTab, workOrders, vehicles, parts, customers, currentCompany, currentUser, loading, error]);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100">
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser}
          currentCompany={currentCompany}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        >
          {activeContent}
        </Layout>
      </div>
    </div>
  );
};

export default App;
