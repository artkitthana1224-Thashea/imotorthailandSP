
import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Wrench, Clock, CheckCircle2, X, ChevronRight, 
  Activity, Calendar, Package, MapPin, Phone, User, Save, UserPlus
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus, Vehicle, Part, Customer } from '../types';
import { sendWorkOrderNotification } from '../services/lineService';
import { supabase } from '../services/supabaseClient';

interface WorkOrderViewProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  vehicles: Vehicle[];
}

export const WorkOrderView: React.FC<WorkOrderViewProps> = ({ workOrders, setWorkOrders, vehicles }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('ทั้งหมด');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  
  const [formData, setFormData] = useState<Partial<WorkOrder>>({
    orderNumber: '',
    status: WorkOrderStatus.PENDING,
    issue_description: '',
    labor_cost: 500,
    total_amount: 500,
    vehicle_id: '',
    customer_id: '',
    parts_used: [],
    is_claim: false
  });

  const [newCustomerData, setNewCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    province: 'กรุงเทพฯ'
  });

  useEffect(() => {
    fetchCustomers();
    fetchWorkOrders();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('name');
    if (data) setCustomers(data);
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
        total_amount: d.total_amount,
        created_at: d.created_at
      }));
      setWorkOrders(mapped);
    }
  };

  const generateNumericId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 100).toString().padStart(2, '0');
  };

  const handleSaveOrder = async () => {
    if (!formData.customer_id && !showNewCustomerForm) {
      alert("กรุณาเลือกหรือเพิ่มลูกค้าก่อนบันทึก");
      return;
    }

    setIsSaving(true);
    let finalCustomerId = formData.customer_id;

    if (showNewCustomerForm) {
      const { data: newCust, error: custErr } = await supabase
        .from('customers')
        .insert([{ 
          id: generateNumericId(),
          name: newCustomerData.name, 
          phone: newCustomerData.phone, 
          address: newCustomerData.address,
          province: newCustomerData.province,
          company_id: 'c1',
          type: 'INDIVIDUAL' // Explicitly set for schema consistency
        }])
        .select()
        .single();
      
      if (custErr) {
        alert("Error creating customer: " + custErr.message);
        setIsSaving(false);
        return;
      }
      finalCustomerId = newCust.id;
      await fetchCustomers();
    }

    const orderData = {
      id: selectedOrder?.id || generateNumericId(),
      order_number: formData.orderNumber,
      customer_id: finalCustomerId,
      vehicle_id: formData.vehicle_id || null,
      status: formData.status,
      issue_description: formData.issue_description,
      labor_cost: formData.labor_cost,
      total_amount: formData.total_amount,
      company_id: 'c1'
    };

    const { error } = selectedOrder 
      ? await supabase.from('work_orders').update(orderData).eq('id', selectedOrder.id)
      : await supabase.from('work_orders').insert([orderData]);

    if (error) {
      alert("Error saving work order: " + error.message);
    } else {
      await fetchWorkOrders();
      setIsModalOpen(false);
      
      const cust = customers.find(c => c.id === finalCustomerId) || newCustomerData;
      await sendWorkOrderNotification({
        orderNumber: formData.orderNumber,
        status: formData.status,
        customerName: cust.name,
        issue: formData.issue_description,
        creator: 'Admin'
      });
    }
    setIsSaving(false);
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("ยืนยันการลบใบงานนี้?")) return;
    const { error } = await supabase.from('work_orders').delete().eq('id', id);
    if (!error) await fetchWorkOrders();
  };

  const filteredOrders = workOrders.filter(wo => (selectedStatus === 'ทั้งหมด' || wo.status === selectedStatus));

  return (
    <div className="space-y-8 animate-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">ศูนย์ซ่อม <span className="text-blue-600">Workshop</span></h1>
           <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">การจัดการใบงานแบบ Real-time (Supabase Sync)</p>
        </div>
        <button onClick={() => { 
          setFormData({ orderNumber: `WO-${new Date().getFullYear().toString().slice(-2)}${Date.now().toString().slice(-6)}`, status: WorkOrderStatus.PENDING, labor_cost: 500, total_amount: 500, customer_id: '' }); 
          setSelectedOrder(null); 
          setShowNewCustomerForm(false);
          setIsModalOpen(true); 
        }} className="h-12 px-8 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all">
          + เปิดใบงานใหม่
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
         {['ทั้งหมด', WorkOrderStatus.PENDING, WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.COMPLETED].map(status => (
           <button key={status} onClick={() => setSelectedStatus(status)} className={`flex-1 min-w-[120px] p-5 rounded-[32px] border transition-all text-center ${selectedStatus === status ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400'}`}>
              <p className="text-[10px] font-black uppercase tracking-widest">{status === 'ทั้งหมด' ? 'งานทั้งหมด' : status}</p>
           </button>
         ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400">
               <tr>
                  <th className="px-10 py-5">ใบงาน</th>
                  <th className="px-10 py-5">ลูกค้า</th>
                  <th className="px-10 py-5">อาการ</th>
                  <th className="px-10 py-5 text-center">สถานะ</th>
                  <th className="px-10 py-5 text-right">จัดการ</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {filteredOrders.map(wo => {
                 const cust = customers.find(c => c.id === wo.customer_id);
                 return (
                   <tr key={wo.id} className="hover:bg-slate-50 group">
                      <td className="px-10 py-6 font-black text-xs">{wo.orderNumber}</td>
                      <td className="px-10 py-6">
                        <p className="text-[11px] font-black">{cust?.name || 'ไม่ระบุ'}</p>
                        <p className="text-[9px] text-slate-400">{cust?.phone}</p>
                      </td>
                      <td className="px-10 py-6 text-[11px] text-slate-500 truncate max-w-[150px]">{wo.issue_description}</td>
                      <td className="px-10 py-6 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${wo.status === WorkOrderStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>{wo.status}</span>
                      </td>
                      <td className="px-10 py-6 text-right space-x-2">
                        <button onClick={() => { setSelectedOrder(wo); setFormData(wo); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Wrench size={16}/></button>
                        <button onClick={() => handleDeleteOrder(wo.id)} className="p-2 text-slate-300 hover:text-rose-500"><X size={16}/></button>
                      </td>
                   </tr>
                 );
               })}
            </tbody>
         </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl animate-in overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">Work Order Detail</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-xl"><X size={24}/></button>
              </div>
              
              <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                 <div className="space-y-4">
                    <div className="flex justify-between items-end">
                       <label className="text-[10px] font-black uppercase text-slate-400">ข้อมูลลูกค้า</label>
                       <button onClick={() => setShowNewCustomerForm(!showNewCustomerForm)} className="text-[9px] font-black uppercase text-blue-600 flex items-center gap-1">
                          {showNewCustomerForm ? "- เลือกจากรายชื่อเดิม" : "+ เพิ่มลูกค้าใหม่"}
                       </button>
                    </div>

                    {!showNewCustomerForm ? (
                      <select 
                        value={formData.customer_id} 
                        onChange={e => setFormData({...formData, customer_id: e.target.value})}
                        className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none"
                      >
                        <option value="">-- ค้นหารายชื่อลูกค้า --</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                      </select>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 animate-in">
                        <input type="text" placeholder="ชื่อ-นามสกุล" value={newCustomerData.name} onChange={e => setNewCustomerData({...newCustomerData, name: e.target.value})} className="px-6 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs outline-none" />
                        <input type="text" placeholder="เบอร์โทรศัพท์" value={newCustomerData.phone} onChange={e => setNewCustomerData({...newCustomerData, phone: e.target.value})} className="px-6 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs outline-none" />
                        <input type="text" placeholder="ที่อยู่" value={newCustomerData.address} onChange={e => setNewCustomerData({...newCustomerData, address: e.target.value})} className="col-span-2 px-6 py-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-xs outline-none" />
                      </div>
                    )}
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-slate-400">อาการเสียที่ระบุ</label>
                    <textarea value={formData.issue_description} onChange={e => setFormData({...formData, issue_description: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl h-24 text-xs font-black outline-none" placeholder="ระบุอาการ..." />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400">สถานะงาน</label>
                       <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full h-14 px-6 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase">
                          {Object.values(WorkOrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2 text-right">
                       <label className="text-[10px] font-black uppercase text-slate-400">ยอดรวมค่าบริการ (฿)</label>
                       <input type="number" value={formData.total_amount} onChange={e => setFormData({...formData, total_amount: Number(e.target.value)})} className="w-full h-14 px-6 bg-blue-50 text-blue-600 rounded-2xl font-black text-xl text-right outline-none" />
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50 flex justify-end gap-4">
                 <button onClick={handleSaveOrder} disabled={isSaving} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3">
                    {isSaving ? "Processing..." : <><Save size={16}/> บันทึกใบงาน</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
