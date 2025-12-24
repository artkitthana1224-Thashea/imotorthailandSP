
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

    // Initial timeout to prevent hanging UI
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 6000);

    try {
      // Fetch data sequentially or in parallel depending on criticality
      const compRes = await supabase.from('companies').select('*').limit(1);
      if (compRes.data && compRes.data.length > 0) {
        setCurrentCompany(compRes.data[0]);
      }

      // Parallel secondary fetches
      const [vRes, cRes, pRes, wRes] = await Promise.all([
        supabase.from('vehicles').select('*').limit(50),
        supabase.from('customers').select('*').order('name').limit(50),
        supabase.from('parts').select('*').limit(50),
        supabase.from('work_orders').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      if (vRes.data) setVehicles(vRes.data);
      if (cRes.data) setCustomers(cRes.data);
      if (pRes.data) setParts(pRes.data);
      if (wRes.data) {
        setWorkOrders(wRes.data.map((d: any) => ({
          ...d,
          orderNumber: d.order_number || `WO-${d.id.slice(0, 5)}`,
          customer_id: d.customer_id,
          vehicle_id: d.vehicle_id,
          issue_description: d.issue_description,
          labor_cost: d.labor_cost || 0,
          total_amount: d.total_amount || 0,
          created_at: d.created_at
        })));
      }

      clearTimeout(timeoutId);
    } catch (err: any) {
      console.warn("Non-critical data fetch issue:", err);
      // We don't block the whole app for non-critical errors
    } finally {
      setLoading(false);
    }
  };

  const activeContent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] space-y-8">
           <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
           <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">Syncing Cloud Database...</p>
           </div>
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
  }, [activeTab, workOrders, vehicles, parts, customers, currentCompany, currentUser, loading]);

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
