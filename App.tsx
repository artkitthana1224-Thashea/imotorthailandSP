
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { WorkOrderView } from './components/WorkOrderView';
import { InventoryView } from './components/InventoryView';
import { CustomerView } from './components/CustomerView';
import { VehicleView } from './components/VehicleView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { BillingView } from './components/BillingView';
import { MOCK_COMPANIES, MOCK_USERS, MOCK_PARTS, MOCK_VEHICLES, MOCK_WORK_ORDERS, MOCK_CUSTOMERS } from './constants';
import { WorkOrder, Customer, Part } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentCompany] = useState(MOCK_COMPANIES[0]);
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  // Centralized States for CRUD
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(MOCK_WORK_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [parts, setParts] = useState<Part[]>(MOCK_PARTS);

  // Check for low stock
  useEffect(() => {
    const lowStockItems = parts.filter(p => p.stockLevel <= p.minStock);
    if (lowStockItems.length > 0) {
      const newNotifs = lowStockItems.map(item => ({
        id: Math.random().toString(36).substr(2, 9),
        title: 'สต็อกอะไหล่ต่ำ!',
        message: `${item.name} เหลือเพียง ${item.stockLevel} ชิ้น`,
        type: 'warning',
        time: new Date().toISOString()
      }));
      setNotifications(prev => [...prev, ...newNotifs].slice(-5));
    }
  }, [parts]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'service': return <WorkOrderView workOrders={workOrders} setWorkOrders={setWorkOrders} vehicles={vehicles} />;
      case 'inventory': return <InventoryView parts={parts} setParts={setParts} />;
      case 'customers': return <CustomerView customers={customers} setCustomers={setCustomers} />;
      case 'vehicles': return <VehicleView vehicles={vehicles} setVehicles={setVehicles} workOrders={workOrders} />;
      case 'billing': return <BillingView />;
      case 'reports': return <ReportsView />;
      case 'settings': return <SettingsView currentUser={currentUser} setCurrentUser={setCurrentUser} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Layout 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={currentUser} 
          currentCompany={currentCompany}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          notifications={notifications}
          setNotifications={setNotifications}
        >
          {renderContent()}
        </Layout>
      </div>
    </div>
  );
};

export default App;
