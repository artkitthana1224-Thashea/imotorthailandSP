
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

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company>(MOCK_COMPANIES[0]);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  
  // Data State (Will be populated by Supabase)
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [vRes, woRes, cRes, pRes] = await Promise.all([
        supabase.from('vehicles').select('*'),
        supabase.from('work_orders').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('name'),
        supabase.from('parts').select('*')
      ]);

      if (vRes.data) setVehicles(vRes.data);
      if (cRes.data) setCustomers(cRes.data);
      if (pRes.data) setParts(pRes.data);
      
      if (woRes.data) {
        // Fix: Mapping snake_case from Supabase to correctly match the WorkOrder interface fields
        setWorkOrders(woRes.data.map((d: any) => ({
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
    } catch (err) {
      console.error("Supabase load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const activeContent = useMemo(() => {
    if (loading) return <div className="flex items-center justify-center h-64 font-black uppercase tracking-widest text-slate-400">Loading Database...</div>;

    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'service': return <WorkOrderView workOrders={workOrders} setWorkOrders={setWorkOrders} vehicles={vehicles} />;
      case 'inventory': return <InventoryView parts={parts} setParts={setParts} />;
      case 'customers': return <CustomerView customers={customers} setCustomers={setCustomers} />;
      case 'vehicles': return <VehicleView vehicles={vehicles} setVehicles={setVehicles} workOrders={workOrders} />;
      case 'billing': return <BillingView currentCompany={currentCompany} />;
      case 'settings': return <SettingsView currentUser={currentUser} setCurrentUser={setCurrentUser} currentCompany={currentCompany} setCurrentCompany={setCurrentCompany} />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  }, [activeTab, workOrders, vehicles, parts, customers, currentCompany, currentUser, loading]);

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
          // Fix: Removed notifications and setNotifications which were causing the TypeScript error as they are not in LayoutProps
        >
          {activeContent}
        </Layout>
      </div>
    </div>
  );
};

export default App;
