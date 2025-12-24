
import React from 'react';
import { WorkOrder, WorkOrderStatus, Customer } from '../types';

interface WorkOrderFlexProps {
  order: Partial<WorkOrder>;
  customer?: Customer;
  mechanicName?: string;
}

export const WorkOrderFlex: React.FC<WorkOrderFlexProps> = ({ order, customer, mechanicName = '-' }) => {
  const getStatusConfig = (status?: WorkOrderStatus) => {
    switch (status) {
      case WorkOrderStatus.COMPLETED:
        return { label: 'จบงานซ่อมเสร็จสิ้น', color: 'bg-[#10b981]', textColor: 'text-white' };
      case WorkOrderStatus.IN_PROGRESS:
      case WorkOrderStatus.DIAGNOSING:
        return { label: 'กำลังดำเนินการซ่อม', color: 'bg-[#2563eb]', textColor: 'text-white' };
      case WorkOrderStatus.WAITING_PARTS:
        return { label: 'รออะไหล่ / สั่งของ', color: 'bg-[#f59e0b]', textColor: 'text-white' };
      case WorkOrderStatus.CANCELLED:
        return { label: 'ยกเลิกรายการซ่อม', color: 'bg-[#f43f5e]', textColor: 'text-white' };
      case WorkOrderStatus.QC:
        return { label: 'ตรวจสอบคุณภาพ (QC)', color: 'bg-[#6366f1]', textColor: 'text-white' };
      default:
        return { label: 'รับรถเข้าบริการ', color: 'bg-[#64748b]', textColor: 'text-white' };
    }
  };

  const config = getStatusConfig(order.status);
  const formattedDate = order.created_at 
    ? new Date(order.created_at).toLocaleString('th-TH', { 
        year: 'numeric', month: '2-digit', day: '2-digit', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }) 
    : '-';

  return (
    <div className="w-full max-w-[400px] mx-auto bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-100 font-sans animate-in zoom-in-95">
      {/* Header - Dynamic Color */}
      <div className={`${config.color} p-6 pb-8`}>
        <h4 className="text-[14px] font-black text-white/80 uppercase tracking-widest mb-1">I-MOTOR CENTRAL SERVICE</h4>
        <h2 className="text-3xl font-black text-white italic tracking-tighter">{config.label}</h2>
      </div>

      <div className="p-6 space-y-6">
        {/* Meta Info */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">เลขใบงาน</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">วันที่</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-[14px] font-black text-slate-900">{order.orderNumber || 'IM-WO-XX-XXX'}</p>
            <p className="text-[12px] font-bold text-slate-600">{formattedDate}</p>
          </div>
        </div>

        {/* Customer Section */}
        <div className="space-y-3">
          <h5 className="text-[15px] font-black text-slate-900 italic">ลูกค้าและพื้นที่</h5>
          <div className="space-y-1">
            <p className="text-[13px] text-slate-600">
              <span className="font-bold">ชื่อ:</span> {customer?.name || 'ไม่ระบุชื่อ'}
            </p>
            <p className="text-[13px] text-slate-600">
              <span className="font-bold">เบอร์โทร:</span> {customer?.phone || '-'}
            </p>
            <p className="text-[13px] text-slate-600">
              <span className="font-bold">จังหวัด:</span> {customer?.province || '-'}
            </p>
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <h5 className="text-[15px] font-black text-slate-900 italic">อาการและงานซ่อม</h5>
          <div className="space-y-2">
            <p className="text-[13px] text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-900">อาการเสีย:</span> {order.issue_description || 'ไม่มีรายละเอียด'}
            </p>
            <p className="text-[13px] text-slate-600">
              <span className="font-bold text-slate-900">เวลาซ่อม:</span> {order.duration_hours || 0} ชั่วโมง
            </p>
            
            <div className="pt-2 space-y-1">
              <p className="text-[13px] font-bold text-slate-900">รายการอะไหล่:</p>
              {order.parts_used && order.parts_used.length > 0 ? (
                <div className="pl-4 space-y-1">
                  {order.parts_used.map((p, idx) => (
                    <p key={idx} className="text-[12px] text-emerald-600 font-bold">
                      • {p.name} (x{p.quantity})
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-slate-400 italic pl-4">ไม่มีรายการอะไหล่</p>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-dashed border-slate-200 flex justify-between items-end">
           <p className="text-[12px] font-black text-slate-400 uppercase tracking-widest">ยอดรวมสุทธิ</p>
           <p className="text-2xl font-black text-blue-600 italic">฿{order.total_amount?.toLocaleString()}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100">
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">ช่างผู้รับผิดชอบ</p>
          <p className="text-[14px] font-black text-slate-900 uppercase italic">{mechanicName}</p>
        </div>
      </div>
    </div>
  );
};
