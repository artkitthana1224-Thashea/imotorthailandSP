
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
import { AlertCircle, RefreshCcw, ShieldCheck, Database } from 'lucide-react';

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
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    // Set a maximum timeout for the initial load to prevent indefinite white screen
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("DATA_FETCH_TIMEOUT");
      }
    }, 5000);

    try {
      // 1. Fetch Company First
      const { data: compRes, error: compErr } = await supabase.from('companies').select('*').limit(1);
      if (!compErr && compRes && compRes.length > 0) {
        setCurrentCompany(compRes[0]);
      }

      // 2. Parallel Fetches
      const results = await Promise.allSettled([
        supabase.from('vehicles').select('*'),
        supabase.from('customers').select('*').order('name'),
        supabase.from('parts').select('*'),
        supabase.from('work_orders').select('*').order('created_at', { ascending: false })
      ]);

      results.forEach((result, idx) => {
        if (result.status === 'fulfilled' && result.value.data) {
          const data = result.value.data;
          if (idx === 0) setVehicles(data);
          if (idx === 1) setCustomers(data);
          if (idx === 2) setParts(data);
          if (idx === 3) {
            setWorkOrders(data.map((d: any) => ({
              ...d,
              orderNumber: d.order_number || d.orderNumber,
              customer_id: d.customer_id,
              vehicle_id: d.vehicle_id,
              issue_description: d.issue_description,
              labor_cost: d.labor_cost,
              total_amount: d.total_amount,
              created_at: d.created_at
            })));
          }
        }
      });
      
      clearTimeout(timeoutId);
      setError(null);
    } catch (err: any) {
      console.error("Data fetch error:", err);
      setError(err.message || "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const activeContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[70vh] space-y-8">
           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <div className="text-center">
              <h3 className="text-sm font-black uppercase tracking-tighter text-slate-900">I-MOTOR CENTRAL</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-400 mt-2">Loading System...</p>
           </div>
        </div>
      );
    }

    if (error === "DATABASE_NOT_READY") {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-10 space-y-6">
           <Database size={48} className="text-amber-500" />
           <h2 className="text-xl font-black uppercase">Database Setup Required</h2>
           <p className="text-slate-500 text-xs max-w-sm">กรุณาไปที่หน้าตั้งค่าและรัน SQL Repair Script</p>
           <button onClick={() => setActiveTab('settings')} className="px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase">ไปหน้าตั้งค่า</button>
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
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
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
