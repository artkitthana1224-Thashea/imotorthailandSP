
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bike, ShieldCheck, Plus, Trash2, Edit3, X, Save, BatteryCharging,
  Cpu, History, Camera, Search, ChevronRight, ExternalLink, Calendar, Wrench, Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { Vehicle, WorkOrder, Customer, Company, WorkOrderStatus } from '../types';
import { supabase } from '../services/supabaseClient';

interface VehicleWithExtras extends Vehicle {
  color?: string;
  charger?: string;
  image?: string;
}

interface VehicleViewProps {
  vehicles: VehicleWithExtras[];
  setVehicles: React.Dispatch<React.SetStateAction<VehicleWithExtras[]>>;
  workOrders: WorkOrder[];
  currentCompany: Company;
}

export const VehicleView: React.FC<VehicleViewProps> = ({ vehicles, setVehicles, workOrders, currentCompany }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyModalVehicle, setHistoryModalVehicle] = useState<VehicleWithExtras | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<VehicleWithExtras | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<VehicleWithExtras>>({
    brand: 'I-Motor',
    model: 'Vapor CBS',
    vin: '',
    customer_id: '',
    battery_type: 'Lithium 72V',
    motor_power: '3000W',
    color: 'Onyx Black',
    charger: '8A',
    image: '',
    warranty_until: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*').order('name');
    if (data) setCustomers(data);
  };

  const fetchVehicles = async () => {
    const { data } = await supabase.from('vehicles').select('*');
    if (data) setVehicles(data);
  };

  const handleAddOrEdit = async () => {
    if (!formData.vin || !formData.customer_id) {
      alert("กรุณากรอก VIN และเลือกลูกเจ้าของรถ");
      return;
    }

    const vehicleData = {
      customer_id: formData.customer_id,
      brand: formData.brand,
      model: formData.model,
      vin: formData.vin,
      battery_type: formData.battery_type,
      motor_power: formData.motor_power,
      warranty_until: formData.warranty_until,
      company_id: currentCompany.id
    };

    const { error } = editingVehicle 
      ? await supabase.from('vehicles').update(vehicleData).eq('id', editingVehicle.id)
      : await supabase.from('vehicles').insert([vehicleData]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      await fetchVehicles();
      closeModal();
    }
  };

  const handleDeleteVehicle = async (id: string) => {
    if (!confirm("ยืนยันการลบข้อมูลรถคันนี้?")) return;
    const { error } = await supabase.from('vehicles').delete().eq('id', id);
    if (!error) {
      await fetchVehicles();
    } else {
      alert("Error deleting vehicle: " + error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setFormData({ brand: 'I-Motor', model: 'Vapor CBS', vin: '', customer_id: '', battery_type: 'Lithium 72V', motor_power: '3000W', color: 'Onyx Black', charger: '8A', image: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredVehicles = vehicles.filter(v => 
    v.vin.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVehicleHistory = (vehicleId: string) => {
    return workOrders.filter(wo => wo.vehicle_id === vehicleId).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  };

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.COMPLETED: return <CheckCircle2 size={16} className="text-emerald-500" />;
      case WorkOrderStatus.CANCELLED: return <X size={16} className="text-rose-500" />;
      case WorkOrderStatus.WAITING_PARTS: return <AlertCircle size={16} className="text-amber-500" />;
      default: return <Clock size={16} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            ฐานข้อมูลรถ <span className="text-blue-600">Vehicles</span>
          </h1>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">
            ทะเบียนรถไฟฟ้า I-MOTOR VAPOR (Supabase Synchronized)
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest text-[10px]"
        >
          <Plus size={18} /> ลงทะเบียนรถใหม่
        </button>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
           <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
           <input type="text" placeholder="ค้นหาตาม VIN หรือรุ่นรถ..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-sm outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                    <th className="px-8 py-6">รูป / รุ่น</th>
                    <th className="px-8 py-6">หมายเลข VIN</th>
                    <th className="px-8 py-6">สเปกไฟฟ้า</th>
                    <th className="px-8 py-6">เจ้าของรถ</th>
                    <th className="px-8 py-6 text-right">จัดการ</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                 {filteredVehicles.map((v) => {
                    const owner = customers.find(c => c.id === v.customer_id);
                    return (
                      <tr key={v.id} className="hover:bg-blue-50/30 transition-all group">
                         <td className="px-8 py-6">
                            <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{v.model}</p>
                            <p className="text-[10px] font-bold text-slate-400">{v.brand}</p>
                         </td>
                         <td className="px-8 py-6">
                            <span className="text-xs font-black font-mono text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">{v.vin}</span>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3 text-slate-500">
                               <Cpu size={14} className="text-indigo-500" />
                               <span className="text-[10px] font-bold">{v.motor_power || '3000W'}</span>
                               <BatteryCharging size={14} className="text-emerald-500 ml-2" />
                               <span className="text-[10px] font-bold">{v.battery_type || '72V'}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 font-black text-xs">{owner?.name || 'ไม่ระบุเจ้าของ'}</td>
                         <td className="px-8 py-6 text-right space-x-1">
                            <button 
                              onClick={() => setHistoryModalVehicle(v)}
                              className="p-3 text-slate-300 hover:text-indigo-600 transition-colors"
                              title="ดูประวัติการซ่อม"
                            >
                              <History size={16}/>
                            </button>
                            <button onClick={() => { setEditingVehicle(v); setFormData(v); setIsModalOpen(true); }} className="p-3 text-slate-300 hover:text-blue-600 transition-colors"><Edit3 size={16}/></button>
                            <button onClick={() => handleDeleteVehicle(v.id)} className="p-3 text-slate-200 hover:text-rose-600 transition-colors"><Trash2 size={16}/></button>
                         </td>
                      </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
      </div>

      {/* History Modal */}
      {historyModalVehicle && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                    <History size={24} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">ประวัติงานซ่อม <span className="text-blue-400">{historyModalVehicle.model}</span></h3>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">VIN: {historyModalVehicle.vin}</p>
                  </div>
               </div>
               <button onClick={() => setHistoryModalVehicle(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all text-white"><X size={24}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50">
              {getVehicleHistory(historyModalVehicle.id).length > 0 ? (
                <div className="space-y-4 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
                  {getVehicleHistory(historyModalVehicle.id).map((wo, idx) => (
                    <div key={wo.id} className="relative pl-12">
                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-10 h-10 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex items-center justify-center z-10">
                        {getStatusIcon(wo.status)}
                      </div>
                      
                      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-3">
                           <div>
                              <p className="text-[12px] font-black uppercase text-slate-900">{wo.orderNumber || `WO-${wo.id.slice(0, 8).toUpperCase()}`}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Calendar size={12} className="text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-500 uppercase">{new Date(wo.created_at).toLocaleDateString('th-TH')} - {new Date(wo.created_at).toLocaleTimeString('th-TH')}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-black text-blue-600 italic">฿{wo.total_amount?.toLocaleString()}</p>
                              <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mt-1">{wo.status}</p>
                           </div>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                           <div className="flex items-start gap-2 mb-2">
                             <Wrench size={14} className="text-slate-400 mt-0.5" />
                             <p className="text-[11px] font-bold text-slate-600 leading-relaxed">{wo.issue_description || 'ไม่มีรายละเอียดอาการเสีย'}</p>
                           </div>
                           {wo.parts_used && wo.parts_used.length > 0 && (
                             <div className="flex flex-wrap gap-2 mt-2">
                               {wo.parts_used.map((p, i) => (
                                 <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-emerald-600 uppercase">
                                   {p.name} x{p.quantity}
                                 </span>
                               ))}
                             </div>
                           )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center p-10 bg-white rounded-[40px] border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 opacity-50">
                    <History size={32} className="text-slate-400" />
                  </div>
                  <p className="text-xs font-black uppercase text-slate-400 tracking-widest">ไม่พบประวัติการรับบริการ</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">รถคันนี้ยังไม่เคยมีใบงานซ่อมในระบบ</p>
                </div>
              )}
            </div>
            
            <div className="p-8 bg-white border-t border-slate-100 flex justify-center">
               <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300">I-MOTOR SERVICE HISTORY LOG</p>
            </div>
          </div>
        </div>
      )}

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <h3 className="text-xl font-black uppercase italic tracking-tighter">{editingVehicle ? 'แก้ไขข้อมูลรถ' : 'ลงทะเบียนรถใหม่'} <span className="text-blue-600">Vehicle Entry</span></h3>
               <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-xl transition-all"><X size={24}/></button>
            </div>
            <div className="p-10 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">เลือกเจ้าของรถ</label>
                  <select value={formData.customer_id} onChange={e => setFormData({...formData, customer_id: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-blue-500/20">
                     <option value="">-- กรุณาเลือกลูกค้า --</option>
                     {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">รุ่นรถ</label>
                    <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">หมายเลขตัวถัง (VIN)</label>
                    <input type="text" value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} placeholder="IMT-XXXXXX" className="w-full h-14 px-6 bg-blue-50/50 border border-blue-100 rounded-2xl font-black text-xs outline-none" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">สเปกแบตเตอรี่</label>
                    <input type="text" value={formData.battery_type} onChange={e => setFormData({...formData, battery_type: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ประกันถึงวันที่</label>
                    <input type="date" value={formData.warranty_until} onChange={e => setFormData({...formData, warranty_until: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
                  </div>
               </div>
            </div>
            <div className="p-8 bg-slate-50 flex justify-end gap-4">
               <button onClick={handleAddOrEdit} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                  <Save size={18}/> {editingVehicle ? 'อัปเดตข้อมูล' : 'บันทึกข้อมูลรถใหม่'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
