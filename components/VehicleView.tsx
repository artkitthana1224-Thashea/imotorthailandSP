
import React, { useState, useRef } from 'react';
import { 
  Bike, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  BatteryCharging,
  Cpu,
  History,
  Camera,
  Search,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Vehicle, WorkOrder, WorkOrderStatus } from '../types';

interface VehicleWithExtras extends Vehicle {
  color?: string;
  charger?: string;
  image?: string;
}

interface VehicleViewProps {
  vehicles: VehicleWithExtras[];
  setVehicles: React.Dispatch<React.SetStateAction<VehicleWithExtras[]>>;
  workOrders: WorkOrder[];
}

export const VehicleView: React.FC<VehicleViewProps> = ({ vehicles, setVehicles, workOrders }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historyModalVehicle, setHistoryModalVehicle] = useState<VehicleWithExtras | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<VehicleWithExtras | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<VehicleWithExtras>>({
    brand: 'I-Motor',
    model: 'Vapor CBS',
    vin: '',
    batteryType: 'Lithium 72V',
    motorPower: '3000W',
    color: 'Onyx Black',
    charger: '8A',
    image: '',
    warrantyUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0]
  });

  const filteredVehicles = vehicles.filter(v => 
    v.vin.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.color?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddOrEdit = () => {
    if (editingVehicle) {
      setVehicles(prev => prev.map(v => v.id === editingVehicle.id ? { ...v, ...formData } as VehicleWithExtras : v));
    } else {
      const newVehicle: VehicleWithExtras = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        customerId: 'cust1'
      } as VehicleWithExtras;
      setVehicles(prev => [...prev, newVehicle]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingVehicle(null);
    setFormData({ brand: 'I-Motor', model: 'Vapor CBS', vin: '', batteryType: 'Lithium 72V', motorPower: '3000W', color: 'Onyx Black', charger: '8A', image: '' });
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

  const getRepairHistory = (vehicleId: string) => {
    return workOrders.filter(wo => wo.vehicleId === vehicleId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            ฐานข้อมูลรถ <span className="text-blue-600">Vehicles</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            จัดการทะเบียนรถมอเตอร์ไซค์ไฟฟ้าและตรวจสอบประวัติการรับบริการ
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest text-[10px]"
        >
          <Plus size={18} /> ลงทะเบียนรถใหม่
        </button>
      </div>

      {/* Filter & Search */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
           <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
           <input 
            type="text" 
            placeholder="ค้นหาตาม VIN, รุ่น หรือสี..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold text-sm outline-none dark:text-white"
           />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center">
             TOTAL: {vehicles.length} UNITS
           </div>
        </div>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                    <th className="px-8 py-6">รูปรถ</th>
                    <th className="px-8 py-6">รุ่น / สี</th>
                    <th className="px-8 py-6">หมายเลข VIN</th>
                    <th className="px-8 py-6">สเปกไฟฟ้า</th>
                    <th className="px-8 py-6 text-center">ประวัติ</th>
                    <th className="px-8 py-6 text-right">แอคชั่น</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                 {filteredVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-all group">
                       <td className="px-8 py-6">
                          <div className="w-16 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                             {v.image ? (
                               <img src={v.image} className="w-full h-full object-cover" />
                             ) : (
                               <Bike size={20} className="text-slate-300" />
                             )}
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{v.model}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <div className={`w-2.5 h-2.5 rounded-full ${
                               v.color === 'Onyx Black' ? 'bg-zinc-900' : 
                               v.color === 'Aero Blue' ? 'bg-blue-400' :
                               v.color === 'Summer Orange' ? 'bg-orange-500' :
                               v.color === 'Corsa Red' ? 'bg-red-600' :
                               v.color === 'Party Yellow' ? 'bg-yellow-400' : 'bg-slate-200'
                             }`}></div>
                             <span className="text-[10px] font-bold text-slate-500">{v.color}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <span className="text-xs font-black font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">{v.vin}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-3 text-slate-500">
                             <Cpu size={14} className="text-indigo-500" />
                             <span className="text-[10px] font-bold">{v.motorPower}</span>
                             <BatteryCharging size={14} className="text-emerald-500 ml-2" />
                             <span className="text-[10px] font-bold">{v.batteryType}</span>
                          </div>
                       </td>
                       <td className="px-8 py-6 text-center">
                          <button 
                            onClick={() => setHistoryModalVehicle(v)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-900 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400"
                          >
                             <History size={14} /> {getRepairHistory(v.id).length} ครั้ง
                          </button>
                       </td>
                       <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button onClick={() => { setEditingVehicle(v); setFormData(v); setIsModalOpen(true); }} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Edit3 size={16}/></button>
                             <button onClick={() => setVehicles(prev => prev.filter(item => item.id !== v.id))} className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-400 hover:text-rose-600 rounded-xl transition-all"><Trash2 size={16}/></button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* History Modal */}
      {historyModalVehicle && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
              <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-200"><History size={32} /></div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">ประวัติงานซ่อม</h3>
                       <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{historyModalVehicle.model} | {historyModalVehicle.vin}</p>
                    </div>
                 </div>
                 <button onClick={() => setHistoryModalVehicle(null)} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><X size={24}/></button>
              </div>
              <div className="p-10 max-h-[60vh] overflow-y-auto space-y-6 scrollbar-hide">
                 {getRepairHistory(historyModalVehicle.id).length === 0 ? (
                    <div className="py-20 text-center text-slate-400 italic">ไม่พบประวัติงานซ่อมสำหรับรถคันนี้</div>
                 ) : (
                    <div className="grid grid-cols-1 gap-4">
                       {getRepairHistory(historyModalVehicle.id).map(wo => (
                          <div key={wo.id} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-blue-200 transition-all">
                             <div className="flex gap-6">
                                <div className="text-center w-20">
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DATE</p>
                                   <p className="text-xs font-black text-slate-900 dark:text-white">{new Date(wo.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">JOB ID: {wo.orderNumber}</p>
                                   <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{wo.issueDescription}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm font-black text-slate-900 dark:text-white mb-2">฿{wo.totalAmount.toLocaleString()}</p>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Completed</span>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
              </div>
              <div className="p-10 bg-slate-50 dark:bg-slate-800/30 flex justify-end">
                 <button onClick={() => setHistoryModalVehicle(null)} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">ปิดหน้าต่าง</button>
              </div>
           </div>
        </div>
      )}

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">ลงทะเบียนข้อมูล VAPOR</h3>
               <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-8">
               <div className="flex justify-center">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-48 h-32 rounded-3xl bg-slate-50 dark:bg-slate-800 overflow-hidden border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all group-hover:border-blue-400">
                       {formData.image ? (
                         <img src={formData.image} className="w-full h-full object-cover" />
                       ) : (
                         <div className="text-center text-slate-400">
                            <Camera size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-[10px] font-bold uppercase tracking-widest">อัปโหลดรูป</p>
                         </div>
                       )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รุ่นรถ</label>
                    <input type="text" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สีรถ</label>
                    <input type="text" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หมายเลขตัวถัง (VIN)</label>
                  <input type="text" value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})} placeholder="IMT-XXXXXX" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none ring-2 ring-transparent focus:ring-blue-500/20" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">แบตเตอรี่</label>
                    <input type="text" value={formData.batteryType} onChange={e => setFormData({...formData, batteryType: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ประกันถึงวันที่</label>
                    <input type="date" value={formData.warrantyUntil} onChange={e => setFormData({...formData, warrantyUntil: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none" />
                  </div>
               </div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 flex justify-end gap-4">
               <button onClick={closeModal} className="px-6 py-3 text-slate-500 font-black uppercase text-[10px]">ยกเลิก</button>
               <button onClick={handleAddOrEdit} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-blue-200">บันทึกข้อมูลรถ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
