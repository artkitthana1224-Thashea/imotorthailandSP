
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Wrench, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  X,
  ClipboardList,
  ChevronRight,
  AlertTriangle,
  User,
  Bike,
  Save,
  DollarSign,
  Calendar
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus, Vehicle } from '../types';
import { getDiagnosticAdvice } from '../services/geminiService';
import { sendWorkOrderNotification } from '../services/lineService';
import { MOCK_CUSTOMERS } from '../constants';

interface WorkOrderViewProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  vehicles: Vehicle[];
}

const SummaryCard = ({ title, count, color, bgClass }: any) => (
  <div className={`p-6 rounded-[32px] ${bgClass} border border-white shadow-sm flex flex-col justify-center items-center text-center transition-all hover:scale-105`}>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
    <p className={`text-4xl font-black ${color}`}>{count}</p>
    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">รายการ</p>
  </div>
);

export const WorkOrderView: React.FC<WorkOrderViewProps> = ({ workOrders, setWorkOrders, vehicles }) => {
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [formData, setFormData] = useState<Partial<WorkOrder>>({
    orderNumber: `IM-WO-${new Date().getFullYear().toString().substr(-2)}-${(workOrders.length + 1).toString().padStart(3, '0')}`,
    status: WorkOrderStatus.PENDING,
    issueDescription: '',
    laborCost: 0,
    totalAmount: 0,
    vehicleId: '',
    customerId: 'cust1'
  });

  const statusCounts = {
    new: workOrders.filter(wo => wo.status === WorkOrderStatus.PENDING).length,
    inProgress: workOrders.filter(wo => [WorkOrderStatus.IN_PROGRESS, WorkOrderStatus.DIAGNOSING].includes(wo.status)).length,
    done: workOrders.filter(wo => wo.status === WorkOrderStatus.COMPLETED).length
  };

  const handleSaveOrder = async () => {
    let finalOrder: WorkOrder;
    const vehicle = vehicles.find(v => v.id === formData.vehicleId);
    const customer = MOCK_CUSTOMERS.find(c => c.id === formData.customerId);

    if (selectedOrder) {
      finalOrder = { ...selectedOrder, ...formData } as WorkOrder;
      setWorkOrders(prev => prev.map(wo => wo.id === selectedOrder.id ? finalOrder : wo));
    } else {
      finalOrder = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        partsUsed: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as WorkOrder;
      setWorkOrders(prev => [finalOrder, ...prev]);
    }

    // Send LINE Notification
    await sendWorkOrderNotification({
      orderNumber: finalOrder.orderNumber,
      status: finalOrder.status,
      customerName: customer?.name || 'ลูกค้าทั่วไป',
      customerPhone: customer?.phone || '-',
      vehicleModel: vehicle?.model || 'ไม่ระบุรุ่น',
      province: customer?.province || 'สมุทรปราการ',
      issue: finalOrder.issueDescription,
      creator: 'ณัฐวุฒิ (Admin)',
      mechanic: finalOrder.status === 'PENDING' ? undefined : 'ช่างสมหมาย'
    });

    setIsModalOpen(false);
    setSelectedOrder(null);
    alert('บันทึกใบงานและส่งแจ้งเตือน LINE เรียบร้อยแล้ว');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="แจ้งซ่อมใหม่" count={statusCounts.new} color="text-blue-600" bgClass="bg-blue-50/50" />
        <SummaryCard title="กำลังดำเนินการ" count={statusCounts.inProgress} color="text-orange-600" bgClass="bg-orange-50/50" />
        <SummaryCard title="ซ่อมเสร็จแล้ว" count={statusCounts.done} color="text-emerald-600" bgClass="bg-emerald-50/50" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/60 dark:bg-slate-900/40 p-6 rounded-[32px] border border-white">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="ค้นหาใบงาน..." className="w-full pl-12 pr-6 py-4 bg-white dark:bg-slate-800 rounded-2xl border-none font-bold text-sm shadow-sm outline-none" />
          </div>
          <div className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 shadow-sm">
             <Calendar size={16} className="text-slate-400" />
             <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="bg-transparent border-none font-bold text-xs outline-none" />
          </div>
        </div>
        <button onClick={() => { setFormData({
          orderNumber: `IM-WO-${Date.now().toString().substr(-5)}`,
          status: WorkOrderStatus.PENDING,
          issueDescription: '',
          laborCost: 0,
          totalAmount: 0,
          vehicleId: '',
          customerId: 'cust1'
        }); setSelectedOrder(null); setIsModalOpen(true); }} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">
          <Plus size={18} className="inline mr-2" /> เปิดใบงานใหม่
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                <th className="px-10 py-6">เลขที่ใบงาน</th>
                <th className="px-10 py-6">รุ่นรถ / อาการที่พบ</th>
                <th className="px-10 py-6 text-center">สถานะ</th>
                <th className="px-10 py-6 text-right">ยอดเงิน</th>
                <th className="px-10 py-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {workOrders.map((wo) => {
                const vehicle = vehicles.find(v => v.id === wo.vehicleId);
                return (
                  <tr key={wo.id} className="hover:bg-blue-50/20 transition-all cursor-pointer" onClick={() => { setSelectedOrder(wo); setFormData(wo); setIsModalOpen(true); }}>
                    <td className="px-10 py-8">
                       <p className="font-black text-slate-900 dark:text-white uppercase">{wo.orderNumber}</p>
                       <p className="text-[9px] text-slate-400 font-bold">{new Date(wo.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-10 py-8">
                       <p className="text-sm font-black text-slate-900 dark:text-white">{vehicle?.model || 'ไม่ระบุรุ่น'}</p>
                       <p className="text-xs text-slate-500 truncate max-w-[200px]">{wo.issueDescription}</p>
                    </td>
                    <td className="px-10 py-8 text-center">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${
                         wo.status === WorkOrderStatus.COMPLETED ? 'bg-emerald-50 text-emerald-600' : 
                         wo.status === WorkOrderStatus.PENDING ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                       }`}>{wo.status}</span>
                    </td>
                    <td className="px-10 py-8 text-right font-black text-slate-900 dark:text-white">฿{wo.totalAmount.toLocaleString()}</td>
                    <td className="px-10 py-8 text-right"><ChevronRight size={18} className="text-slate-300 inline" /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl animate-in zoom-in-95 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                 <h3 className="text-xl font-black uppercase">{selectedOrder ? 'แก้ไขใบงาน' : 'เพิ่มใบงานใหม่'}</h3>
                 <button onClick={() => setIsModalOpen(false)}><X size={20}/></button>
              </div>
              <div className="p-10 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">เลือกรถ</label>
                    <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold">
                       <option value="">-- เลือกรถลูกค้า --</option>
                       {vehicles.map(v => <option key={v.id} value={v.id}>{v.model} ({v.vin})</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">อาการเสีย</label>
                    <textarea value={formData.issueDescription} onChange={e => setFormData({...formData, issueDescription: e.target.value})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl h-24 font-bold" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400">สถานะ</label>
                       <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as WorkOrderStatus})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold">
                          {Object.values(WorkOrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400">ค่าซ่อมรวม</label>
                       <input type="number" value={formData.totalAmount} onChange={e => setFormData({...formData, totalAmount: parseFloat(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 rounded-2xl border-none font-bold" />
                    </div>
                 </div>
                 <button onClick={handleSaveOrder} className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl">บันทึกข้อมูลและส่งแจ้งเตือน LINE</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
