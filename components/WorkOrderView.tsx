
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Wrench, Clock, CheckCircle2, X, ChevronRight, 
  Activity, Calendar, Package, MapPin, Phone, User as UserIcon, Save, UserPlus, AlertCircle, ExternalLink, Eye, Trash2, PlusCircle
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus, Vehicle, Part, Customer, Company, User } from '../types';
import { sendWorkOrderNotification } from '../services/lineService';
import { supabase } from '../services/supabaseClient';
import { generateUUID } from '../constants';
import { WorkOrderFlex } from './WorkOrderFlex';

interface WorkOrderViewProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  vehicles: Vehicle[];
  currentCompany: Company;
}

export const WorkOrderView: React.FC<WorkOrderViewProps> = ({ workOrders, setWorkOrders, vehicles, currentCompany }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'FORM' | 'PREVIEW'>('FORM');
  const [selectedStatus, setSelectedStatus] = useState<string>('ทั้งหมด');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [mechanics, setMechanics] = useState<User[]>([]);
  const [availableParts, setAvailableParts] = useState<Part[]>([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<WorkOrder>>({
    orderNumber: '',
    status: WorkOrderStatus.PENDING,
    issue_description: '',
    labor_cost: 500,
    total_amount: 500,
    duration_hours: 1,
    vehicle_id: '',
    customer_id: '',
    mechanic_id: '',
    parts_used: [],
    is_claim: false
  });

  useEffect(() => {
    fetchCustomers();
    fetchWorkOrders();
    fetchMechanics();
    fetchParts();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('name');
    if (data) setCustomers(data);
  };

  const fetchMechanics = async () => {
    const { data } = await supabase.from('users').select('*').order('name');
    if (data) setMechanics(data);
  };

  const fetchParts = async () => {
    const { data } = await supabase.from('parts').select('*').order('name');
    if (data) setAvailableParts(data);
  };

  const fetchWorkOrders = async () => {
    const { data } = await supabase.from('work_orders').select('*').order('created_at', { ascending: false });
    if (data) {
      const mapped = data.map((d: any) => ({
        ...d,
        orderNumber: d.order_number,
        customer_id: d.customer_id,
        vehicle_id: d.vehicle_id,
        issue_description: d.issue_description,
        labor_cost: d.labor_cost,
        duration_hours: d.duration_hours,
        total_amount: d.total_amount,
        mechanic_id: d.mechanic_id,
        parts_used: Array.isArray(d.parts_used) ? d.parts_used : [],
        created_at: d.created_at
      }));
      setWorkOrders(mapped);
    }
  };

  const calculateTotal = (labor: number, parts: any[]) => {
    const partsTotal = parts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    return labor + partsTotal;
  };

  const addPartToOrder = (partId: string) => {
    const part = availableParts.find(p => p.id === partId);
    if (!part) return;
    
    const existing = (formData.parts_used || []).find(p => p.partId === partId);
    let newParts;
    if (existing) {
      newParts = (formData.parts_used || []).map(p => 
        p.partId === partId ? { ...p, quantity: p.quantity + 1 } : p
      );
    } else {
      newParts = [...(formData.parts_used || []), { 
        partId: part.id, 
        name: part.name, 
        price: part.sale_price, 
        quantity: 1 
      }];
    }
    const labor = formData.labor_cost || 0;
    setFormData({ 
      ...formData, 
      parts_used: newParts,
      total_amount: calculateTotal(labor, newParts)
    });
  };

  const removePartFromOrder = (partId: string) => {
    const newParts = (formData.parts_used || []).filter(p => p.partId !== partId);
    const labor = formData.labor_cost || 0;
    setFormData({ 
      ...formData, 
      parts_used: newParts,
      total_amount: calculateTotal(labor, newParts)
    });
  };

  const updatePartQuantity = (partId: string, qty: number) => {
    const newParts = (formData.parts_used || []).map(p => 
      p.partId === partId ? { ...p, quantity: Math.max(1, qty) } : p
    );
    const labor = formData.labor_cost || 0;
    setFormData({ 
      ...formData, 
      parts_used: newParts,
      total_amount: calculateTotal(labor, newParts)
    });
  };

  const handleLaborChange = (val: number) => {
    const parts = formData.parts_used || [];
    setFormData({ 
      ...formData, 
      labor_cost: val,
      total_amount: calculateTotal(val, parts)
    });
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

  const selectedCustomer = customers.find(c => c.id === formData.customer_id);
  const selectedMechanic = mechanics.find(m => m.id === formData.mechanic_id);

  const handleSaveOrder = async () => {
    if (!formData.customer_id) {
      alert("กรุณาเลือกหรือเพิ่มลูกค้าก่อนบันทึก");
      return;
    }
    setIsSaving(true);

    const orderData = { 
      order_number: formData.orderNumber, 
      customer_id: formData.customer_id, 
      vehicle_id: (formData.vehicle_id && formData.vehicle_id !== "" && formData.vehicle_id !== "null") ? formData.vehicle_id : null, 
      status: formData.status, 
      issue_description: formData.issue_description, 
      labor_cost: formData.labor_cost, 
      duration_hours: formData.duration_hours,
      mechanic_id: formData.mechanic_id || null,
      parts_used: formData.parts_used || [],
      total_amount: formData.total_amount, 
      company_id: currentCompany.id
    };

    const { error } = selectedOrder 
      ? await supabase.from('work_orders').update(orderData).eq('id', selectedOrder.id) 
      : await supabase.from('work_orders').insert([{ ...orderData, id: generateUUID() }]);
    
    if (!error) {
      await fetchWorkOrders();
      setIsModalOpen(false);
      const cust = customers.find(c => c.id === formData.customer_id);
      
      // Send Rich Flex Notification
      await sendWorkOrderNotification({ 
        orderNumber: formData.orderNumber || '', 
        status: formData.status || 'PENDING', 
        customerName: cust?.name || 'ลูกค้าทั่วไป', 
        issue: formData.issue_description || 'ไม่มีรายละเอียด', 
        creator: selectedMechanic?.name || 'Admin', 
        totalAmount: formData.total_amount,
        parts: formData.parts_used,
        isUpdate: !!selectedOrder 
      });
    } else {
      alert(`WorkOrder Error: ${getErrorString(error)}\n\nคำแนะนำ: หากพบว่า 'duration_hours' หายไป ให้ไปที่หน้า 'ตั้งค่า' > 'ระบบตรวจสอบ' เพื่อรัน SQL Repair`);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">ศูนย์ซ่อม <span className="text-blue-600">Workshop</span></h1>
           <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Enterprise Repair Workflow Management</p>
        </div>
        <button onClick={() => { 
          setFormData({ 
            orderNumber: `WO-${Date.now().toString().slice(-6)}`, 
            status: WorkOrderStatus.PENDING, 
            labor_cost: 500, 
            total_amount: 500, 
            duration_hours: 1,
            customer_id: '',
            mechanic_id: '',
            parts_used: []
          }); 
          setSelectedOrder(null); 
          setShowNewCustomerForm(false); 
          setActiveSubTab('FORM'); 
          setIsModalOpen(true); 
        }} className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">
          + เปิดใบงานใหม่
        </button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400">
               <tr>
                  <th className="px-10 py-5">ใบงาน</th>
                  <th className="px-10 py-5">ลูกค้า / ช่าง</th>
                  <th className="px-10 py-5 text-center">สถานะ</th>
                  <th className="px-10 py-5 text-right">ยอดรวม</th>
                  <th className="px-10 py-5 text-right">จัดการ</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {workOrders.filter(wo => selectedStatus === 'ทั้งหมด' || wo.status === selectedStatus).map(wo => {
                 const cust = customers.find(c => c.id === wo.customer_id);
                 const mech = mechanics.find(m => m.id === wo.mechanic_id);
                 return (
                   <tr key={wo.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6">
                        <p className="font-black text-xs uppercase">{wo.orderNumber}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{new Date(wo.created_at).toLocaleDateString()}</p>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-[11px] font-black">{cust?.name || 'ไม่ระบุ'}</p>
                        <p className="text-[9px] text-blue-500 font-bold uppercase tracking-wider">ช่าง: {mech?.name || '-'}</p>
                      </td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${
                          wo.status === WorkOrderStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' : 
                          wo.status === WorkOrderStatus.WAITING_PARTS ? 'bg-amber-50 text-amber-600' :
                          'bg-blue-50 text-blue-600'
                        }`}>{wo.status}</span>
                      </td>
                      <td className="px-10 py-6 text-right font-black text-xs italic">฿{wo.total_amount?.toLocaleString()}</td>
                      <td className="px-10 py-6 text-right">
                        <button onClick={() => { 
                          setSelectedOrder(wo); 
                          setFormData(wo); 
                          setActiveSubTab('FORM'); 
                          setIsModalOpen(true); 
                        }} className="p-2 text-slate-300 hover:text-blue-600 transition-colors"><Wrench size={16}/></button>
                      </td>
                   </tr>
                 );
               })}
            </tbody>
         </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl animate-in overflow-hidden flex flex-col h-[90vh]">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                 <div className="flex bg-slate-200/50 p-1 rounded-2xl">
                    <button onClick={() => setActiveSubTab('FORM')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'FORM' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>รายละเอียดงาน</button>
                    <button onClick={() => setActiveSubTab('PREVIEW')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'PREVIEW' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}>ดูตัวอย่าง Flex</button>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={24}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {activeSubTab === 'FORM' ? (
                  <div className="p-8 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-6">
                          <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-blue-600 border-b border-blue-100 pb-2">Customer Info</h4>
                          <div className="grid grid-cols-1 gap-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">เลือกชื่อลูกค้า</label>
                                <select value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-blue-500/20">
                                   <option value="">-- ค้นหารายชื่อลูกค้า --</option>
                                   {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                                </select>
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ช่างรับผิดชอบ</label>
                                <select value={formData.mechanic_id} onChange={e => setFormData({...formData, mechanic_id: e.target.value})} className="w-full h-14 px-6 bg-blue-50 rounded-2xl font-black text-xs outline-none border border-blue-100">
                                   <option value="">-- ระบุช่างซ่อม --</option>
                                   {mechanics.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                </select>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400 ml-1">รายละเอียดอาการเสีย</label>
                             <textarea value={formData.issue_description} onChange={e => setFormData({...formData, issue_description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl h-24 text-xs font-black outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="ระบุอาการเบื้องต้น..." />
                          </div>
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-[12px] font-black uppercase tracking-[0.3em] text-indigo-600 border-b border-indigo-100 pb-2">Parts Requisition</h4>
                          <div className="space-y-4">
                             <div className="relative">
                                <select onChange={e => addPartToOrder(e.target.value)} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none border border-slate-100 focus:ring-2 focus:ring-indigo-500/20">
                                   <option value="">+ ค้นหาและเพิ่มอะไหล่...</option>
                                   {availableParts.map(p => <option key={p.id} value={p.id}>{p.name} (฿{p.sale_price})</option>)}
                                </select>
                             </div>
                             
                             <div className="space-y-3 max-h-48 overflow-y-auto scrollbar-hide pr-2">
                                {formData.parts_used?.map((p, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                                     <div className="flex-1">
                                        <p className="text-[11px] font-black uppercase">{p.name}</p>
                                        <p className="text-[9px] text-slate-400 font-bold">฿{p.price?.toLocaleString()} x {p.quantity}</p>
                                     </div>
                                     <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-white rounded-xl border border-slate-200 overflow-hidden">
                                           <button onClick={() => updatePartQuantity(p.partId, p.quantity - 1)} className="px-3 py-1 hover:bg-slate-50 text-slate-400">-</button>
                                           <span className="px-3 py-1 text-[10px] font-black border-x border-slate-100">{p.quantity}</span>
                                           <button onClick={() => updatePartQuantity(p.partId, p.quantity + 1)} className="px-3 py-1 hover:bg-slate-50 text-slate-400">+</button>
                                        </div>
                                        <button onClick={() => removePartFromOrder(p.partId)} className="p-2 text-rose-300 hover:text-rose-500 transition-colors"><Trash2 size={16}/></button>
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">สถานะงานซ่อม</label>
                          <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className={`w-full h-14 px-6 rounded-2xl font-black text-[10px] uppercase text-white shadow-lg ${
                            formData.status === WorkOrderStatus.COMPLETED ? 'bg-emerald-600' : 
                            formData.status === WorkOrderStatus.IN_PROGRESS ? 'bg-blue-600' :
                            formData.status === WorkOrderStatus.WAITING_PARTS ? 'bg-amber-600' : 'bg-slate-900'
                          }`}>
                             {Object.values(WorkOrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-slate-400">เวลาซ่อม (ชั่วโมง)</label>
                          <input type="number" step="0.5" value={formData.duration_hours} onChange={e => setFormData({...formData, duration_hours: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-sm outline-none border border-slate-100" />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-400">ค่าแรง (฿)</label>
                             <input type="number" value={formData.labor_cost} onChange={e => handleLaborChange(Number(e.target.value))} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-sm outline-none border border-slate-100" />
                          </div>
                          <div className="space-y-2 text-right">
                             <label className="text-[10px] font-black uppercase text-blue-500">รวมสุทธิ (฿)</label>
                             <div className="w-full h-14 px-6 bg-blue-50 text-blue-600 rounded-2xl font-black text-xl flex items-center justify-end italic shadow-inner border border-blue-100">
                                {formData.total_amount?.toLocaleString()}
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-10 bg-slate-50 min-h-full flex flex-col items-center justify-center">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-8 tracking-[0.4em]">Live Flex Message Preview</p>
                    <WorkOrderFlex order={formData} customer={selectedCustomer} mechanicName={selectedMechanic?.name} />
                    <p className="mt-8 text-[9px] font-bold text-slate-400 uppercase text-center">ระบบจะส่ง Flex Message รูปแบบนี้ไปยัง LINE Group ของคุณเมื่อบันทึก</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white border-t border-slate-50 flex justify-end gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-transform">ยกเลิก</button>
                 <button onClick={handleSaveOrder} disabled={isSaving} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-transform">
                    {isSaving ? "Saving..." : <><Save size={16}/> บันทึกและส่ง Flex ไปยัง LINE</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
