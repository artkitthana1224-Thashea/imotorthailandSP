
import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Trash2, Edit3, AlertCircle, X, Save, Layers, Banknote, ClipboardList } from 'lucide-react';
import { Part } from '../types';

interface InventoryViewProps {
  parts: Part[];
  setParts: React.Dispatch<React.SetStateAction<Part[]>>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ parts, setParts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const totalValue = parts.reduce((acc, p) => acc + (p.costPrice * p.stockLevel), 0);
  const lowStockCount = parts.filter(p => p.stockLevel <= p.minStock).length;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
         <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">คลังอะไหล่ <span className="text-orange-500">Inventory</span></h1>
         <p className="text-slate-500 font-medium">จัดการสต็อกอะไหล่สำรองสำหรับรถ I-MOTOR VAPOR</p>
      </div>

      {/* Balanced Summary Grid: 2 Columns x 2 Rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-blue-50/50 p-8 rounded-[40px] border border-white flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">จำนวนอะไหล่ทั้งหมด</p>
               <p className="text-4xl font-black text-blue-600">{parts.length}</p>
            </div>
            <Package size={40} className="text-blue-200" />
         </div>
         <div className="bg-emerald-50/50 p-8 rounded-[40px] border border-white flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">มูลค่าคงคลังรวม</p>
               <p className="text-3xl font-black text-emerald-600">฿{totalValue.toLocaleString()}</p>
            </div>
            <Banknote size={40} className="text-emerald-200" />
         </div>
         <div className="bg-indigo-50/50 p-8 rounded-[40px] border border-white flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">รายการประเภทอะไหล่</p>
               <p className="text-4xl font-black text-indigo-600">{Array.from(new Set(parts.map(p => p.category))).length}</p>
            </div>
            <ClipboardList size={40} className="text-indigo-200" />
         </div>
         <div className="bg-rose-50/50 p-8 rounded-[40px] border border-white flex items-center justify-between">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">อะไหล่ที่สต็อกต่ำ</p>
               <p className="text-4xl font-black text-rose-600">{lowStockCount}</p>
            </div>
            <AlertCircle size={40} className="text-rose-200" />
         </div>
      </div>

      <div className="bg-white/60 dark:bg-slate-900 p-8 rounded-[48px] border border-white shadow-xl space-y-8">
         <div className="flex flex-col md:flex-row gap-6">
            <div className="relative flex-1">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
               <input type="text" placeholder="ค้นหารหัส SKU หรือชื่ออะไหล่..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-800 border-none rounded-3xl text-sm font-bold shadow-sm" />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95">
               <Plus size={18} className="inline mr-2" /> เพิ่มรายการใหม่
            </button>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.25em] bg-slate-50/50 rounded-xl">
                     <th className="px-8 py-4">SKU / ชื่ออะไหล่</th>
                     <th className="px-8 py-4">หมวดหมู่</th>
                     <th className="px-8 py-4 text-center">คงคลัง</th>
                     <th className="px-8 py-4 text-right">ราคาขาย</th>
                     <th className="px-8 py-4 text-right">แอคชั่น</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {parts.filter(p => p.name.includes(searchTerm) || p.sku.includes(searchTerm)).map(part => (
                     <tr key={part.id} className="hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6">
                           <p className="font-black text-slate-900 dark:text-white">{part.sku}</p>
                           <p className="text-xs text-slate-500">{part.name}</p>
                        </td>
                        <td className="px-8 py-6"><span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black uppercase tracking-widest">{part.category}</span></td>
                        <td className="px-8 py-6 text-center">
                           <span className={`text-lg font-black ${part.stockLevel <= part.minStock ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{part.stockLevel}</span>
                        </td>
                        <td className="px-8 py-6 text-right font-black">฿{part.salePrice.toLocaleString()}</td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => setParts(prev => prev.filter(p => p.id !== part.id))} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18}/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
      
      {/* CRUD Modal for Parts would go here (same as before) */}
    </div>
  );
};
