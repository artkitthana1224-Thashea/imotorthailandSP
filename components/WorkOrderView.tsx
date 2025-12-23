
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Wrench, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  X,
  MoreVertical,
  ClipboardList,
  ChevronRight,
  AlertTriangle,
  User,
  Bike,
  Save,
  DollarSign
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus, Vehicle } from '../types';
import { getDiagnosticAdvice } from '../services/geminiService';

interface WorkOrderViewProps {
  workOrders: WorkOrder[];
  setWorkOrders: React.Dispatch<React.SetStateAction<WorkOrder[]>>;
  vehicles: Vehicle[];
}

const StatusBadge = ({ status }: { status: WorkOrderStatus }) => {
  const configs: any = {
    [WorkOrderStatus.PENDING]: { color: 'bg-slate-100 text-slate-600', label: 'รอดำเนินการ' },
    [WorkOrderStatus.DIAGNOSING]: { color: 'bg-indigo-50 text-indigo-600', label: 'กำลังวินิจฉัย' },
    [WorkOrderStatus.WAITING_PARTS]: { color: 'bg-orange-50 text-orange-600', label: 'รออะไหล่' },
    [WorkOrderStatus.IN_PROGRESS]: { color: 'bg-blue-50 text-blue-600', label: 'กำลังซ่อม' },
    [WorkOrderStatus.QC]: { color: 'bg-purple-50 text-purple-600', label: 'ตรวจสอบความเรียบร้อย' },
    [WorkOrderStatus.COMPLETED]: { color: 'bg-emerald-50 text-emerald-600', label: 'เสร็จสมบูรณ์' },
    [WorkOrderStatus.CANCELLED]: { color: 'bg-rose-50 text-rose-600', label: 'ยกเลิก' },
  };
  const config = configs[status] || configs[WorkOrderStatus.PENDING];
  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${config.color} border border-white/20 shadow-sm flex items-center gap-2`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {config.label}
    </span>
  );
};

export const WorkOrderView: React.FC<WorkOrderViewProps> = ({ workOrders, setWorkOrders, vehicles }) => {
  const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<WorkOrder>>({
    orderNumber: `IM-WO-${new Date().getFullYear().toString().substr(-2)}-${(workOrders.length + 1).toString().padStart(3, '0')}`,
    status: WorkOrderStatus.PENDING,
    issueDescription: '',
    laborCost: 0,
    totalAmount: 0,
    vehicleId: '',
    customerId: 'cust1'
  });

  const handleDiagnose = async (order: WorkOrder) => {
    setIsAnalysing(true);
    const vehicle = vehicles.find(v => v.id === order.vehicleId);
    const advice = await getDiagnosticAdvice(order.issueDescription, `${vehicle?.brand} ${vehicle?.model}`);
    setAiAnalysis(advice);
    setIsAnalysing(false);
  };

  const handleSaveOrder = () => {
    if (selectedOrder) {
      setWorkOrders(prev => prev.map(wo => wo.id === selectedOrder.id ? { ...wo, ...formData } as WorkOrder : wo));
    } else {
      const newOrder: WorkOrder = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        partsUsed: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as WorkOrder;
      setWorkOrders(prev => [newOrder, ...prev]);
    }
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const openAddModal = () => {
    setFormData({
      orderNumber: `IM-WO-${new Date().getFullYear().toString().substr(-2)}-${(workOrders.length + 1).toString().padStart(3, '0')}`,
      status: WorkOrderStatus.PENDING,
      issueDescription: '',
      laborCost: 0,
      totalAmount: 0,
      vehicleId: vehicles[0]?.id || '',
      customerId: 'cust1'
    });
    setSelectedOrder(null);
    setIsModalOpen(true);
  };

  const openEditModal = (wo: WorkOrder) => {
    setSelectedOrder(wo);
    setFormData(wo);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            ใบสั่งซ่อม <span className="text-blue-600">Work Orders</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            จัดการรายการซ่อม มอบหมายงานช่าง และติดตามสถานะงานแบบเรียลไทม์
          </p>
        </div>
        <button 
          onClick={openAddModal}
          className="h-14 px-8 bg-blue-600 text-white rounded-2xl font-black shadow-2xl hover:scale-105 transition-all flex items-center gap-3 uppercase tracking-widest text-xs"
        >
          <Plus size={20} /> เปิด Job Card ใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Orders List */}
        <div className="xl:col-span-7 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden h-[750px] flex flex-col">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/30">
                 <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="ค้นหาตาม Job ID หรือชื่อลูกค้า..." className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl text-sm font-bold shadow-inner" />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-800 scrollbar-hide">
                 {workOrders.map((wo) => {
                    const vehicle = vehicles.find(v => v.id === wo.vehicleId);
                    return (
                       <div key={wo.id} onClick={() => openEditModal(wo)} className={`p-8 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 cursor-pointer transition-all flex items-center justify-between group ${selectedOrder?.id === wo.id ? 'bg-blue-50/50 dark:bg-blue-900/20 ring-inset ring-2 ring-blue-500/20' : ''}`}>
                          <div className="flex items-center gap-6">
                             <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 shadow-sm group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <Wrench size={24} />
                             </div>
                             <div>
                                <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight uppercase">{wo.orderNumber}</h4>
                                <div className="flex items-center gap-3 mt-1">
                                   <p className="text-xs font-bold text-slate-500">{vehicle?.brand} {vehicle?.model}</p>
                                   <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{vehicle?.vin}</p>
                                </div>
                             </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                             <StatusBadge status={wo.status} />
                             <p className="text-sm font-black text-slate-900 dark:text-white">฿{wo.totalAmount.toLocaleString()}</p>
                          </div>
                       </div>
                    );
                 })}
              </div>
           </div>
        </div>

        {/* Action Panel / AI Diagnostics */}
        <div className="xl:col-span-5">
           {selectedOrder ? (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                 <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">การวินิจฉัยงานซ่อม</h3>
                       <StatusBadge status={selectedOrder.status} />
                    </div>
                    
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">อาการเสียเบื้องต้น</p>
                       <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">{selectedOrder.issueDescription}</p>
                    </div>

                    <button 
                       onClick={() => handleDiagnose(selectedOrder)}
                       disabled={isAnalysing}
                       className="w-full flex items-center justify-center gap-3 p-5 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[24px] font-black shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all disabled:opacity-50 uppercase tracking-widest text-[11px]"
                    >
                       <Sparkles size={20} className={isAnalysing ? 'animate-pulse' : ''} />
                       {isAnalysing ? 'กำลังวิเคราะห์ด้วย AI...' : 'ใช้ AI ช่วยวินิจฉัยอาการ'}
                    </button>

                    {aiAnalysis && (
                       <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-[32px] animate-in zoom-in-95">
                          <div className="flex items-center gap-3 mb-4 text-indigo-700 dark:text-indigo-400 font-black uppercase text-xs tracking-widest">
                             <Sparkles size={18} /> ข้อแนะนำสำหรับช่าง
                          </div>
                          <div className="text-xs text-indigo-800 dark:text-indigo-300 space-y-3 whitespace-pre-wrap leading-relaxed font-medium">
                             {aiAnalysis}
                          </div>
                       </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => openEditModal(selectedOrder)} className="p-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">แก้ไขข้อมูลงาน</button>
                       <button className="p-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">เสร็จสิ้นงานซ่อม</button>
                    </div>
                 </div>
              </div>
           ) : (
              <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[48px] h-[500px] flex flex-col items-center justify-center p-12 text-center">
                 <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 mb-6"><ClipboardList size={40}/></div>
                 <h3 className="text-xl font-black text-slate-900 dark:text-white">เลือกใบสั่งซ่อมเพื่อจัดการ</h3>
                 <p className="text-sm text-slate-500 mt-2">คลิกที่รายการด้านซ้ายเพื่อดูรายละเอียด อัปเดตสถานะ หรือใช้ระบบวินิจฉัยด้วย AI</p>
              </div>
           )}
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/30 dark:bg-slate-800/30">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg"><ClipboardList size={20}/></div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedOrder ? 'แก้ไข Job Card' : 'เปิด Job Card ใหม่'}</h3>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all text-slate-400"><X size={20}/></button>
              </div>
              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto scrollbar-hide">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job ID</label>
                       <input type="text" value={formData.orderNumber} disabled className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none font-bold text-slate-500" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">สถานะงาน</label>
                       <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as WorkOrderStatus})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none ring-2 ring-transparent focus:ring-blue-500/20">
                          {Object.values(WorkOrderStatus).map(status => <option key={status} value={status}>{status}</option>)}
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">เลือกรถลูกค้า</label>
                    <select value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none">
                       {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.vin})</option>)}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">อาการเสียที่ได้รับแจ้ง</label>
                    <textarea value={formData.issueDescription} onChange={e => setFormData({...formData, issueDescription: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none h-32" placeholder="อธิบายปัญหาที่เกิดขึ้น..."></textarea>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ค่าบริการ / ค่าแรง</label>
                       <div className="relative">
                          <DollarSign size={14} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input type="number" value={formData.laborCost} onChange={e => setFormData({...formData, laborCost: parseFloat(e.target.value), totalAmount: parseFloat(e.target.value)})} className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ยอดรวมประมาณการ</label>
                       <div className="w-full px-6 py-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl font-black text-blue-600 dark:text-blue-400 text-lg">฿{formData.totalAmount?.toLocaleString()}</div>
                    </div>
                 </div>
              </div>
              <div className="p-8 bg-slate-50 dark:bg-slate-800/30 flex justify-end gap-4">
                 <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-slate-500 font-black uppercase text-[10px]">ยกเลิก</button>
                 <button onClick={handleSaveOrder} className="px-12 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center gap-3">
                    <Save size={18}/> {selectedOrder ? 'อัปเดตข้อมูล' : 'บันทึกใบสั่งซ่อม'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
