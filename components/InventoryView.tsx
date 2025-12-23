
import React, { useState, useEffect } from 'react';
import { Package, Search, Trash2, AlertCircle, Banknote, ClipboardList, X, Save } from 'lucide-react';
import { Part } from '../types';
import { supabase } from '../services/supabaseClient';

interface InventoryViewProps {
  parts: Part[];
  setParts: React.Dispatch<React.SetStateAction<Part[]>>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ parts, setParts }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Part>>({
    sku: '', name: '', category: 'Battery', cost_price: 0, sale_price: 0, stock_level: 0, min_stock: 5
  });

  const generateNumericId = () => Date.now().toString() + Math.floor(Math.random() * 100).toString().padStart(2, '0');

  const fetchParts = async () => {
    const { data } = await supabase.from('parts').select('*').order('sku');
    if (data) setParts(data);
  };

  const handleSavePart = async () => {
    if (!formData.sku || !formData.name) {
      alert("กรุณาระบุรหัสและชื่ออะไหล่");
      return;
    }
    setIsSaving(true);
    const payload = {
      id: generateNumericId(),
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      cost_price: formData.cost_price,
      sale_price: formData.sale_price,
      stock_level: formData.stock_level,
      min_stock: formData.min_stock,
      company_id: 'c1'
    };

    const { error } = await supabase.from('parts').insert([payload]);
    if (!error) {
      await fetchParts();
      setIsModalOpen(false);
      setFormData({ sku: '', name: '', category: 'Battery', cost_price: 0, sale_price: 0, stock_level: 0, min_stock: 5 });
    } else {
      alert("Error: " + error.message);
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-8 animate-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">คลังอะไหล่ <span className="text-orange-500">Inventory</span></h1>
           <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">บริหารจัดการสต็อกและราคาทุน-ขาย</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="h-12 px-10 bg-slate-900 text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
           + ลงทะเบียนอะไหล่
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input type="text" placeholder="ค้นหา SKU หรือชื่ออะไหล่..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none text-[11px] font-bold uppercase outline-none" />
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400">
               <tr>
                  <th className="px-10 py-5">SKU / ชื่อรายการ</th>
                  <th className="px-10 py-5 text-center">คงเหลือ</th>
                  <th className="px-10 py-5 text-right">ราคาทุน</th>
                  <th className="px-10 py-5 text-right">ราคาขาย</th>
                  <th className="px-10 py-5 text-right">จัดการ</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {parts.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase())).map(part => (
                  <tr key={part.id} className="hover:bg-slate-50 transition-all">
                     <td className="px-10 py-6">
                        <p className="font-black text-slate-900 text-xs uppercase">{part.sku}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{part.name}</p>
                     </td>
                     <td className="px-10 py-6 text-center">
                        <span className={`text-sm font-black ${part.stock_level <= part.min_stock ? 'text-rose-500' : 'text-slate-900'}`}>{part.stock_level}</span>
                     </td>
                     <td className="px-10 py-6 text-right font-bold text-[10px] text-slate-400">฿{part.cost_price?.toLocaleString()}</td>
                     <td className="px-10 py-6 text-right font-black text-xs text-blue-600 italic">฿{part.sale_price?.toLocaleString()}</td>
                     <td className="px-10 py-6 text-right">
                        <button className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Registration Modal - Corrected UI per provided screenshot */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-in zoom-in-95 overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">ลงทะเบียนอะไหล่ใหม่</h3>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Register New Part to Inventory</p>
                 </div>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={24}/></button>
              </div>
              <div className="p-10 space-y-6">
                 {/* SKU Field */}
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">รหัส SKU</label>
                    <input type="text" placeholder="ระบุรหัสอะไหล่..." value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-bold text-xs outline-none" />
                 </div>
                 
                 {/* Name Field */}
                 <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่ออะไหล่</label>
                    <input type="text" placeholder="ระบุชื่อรายการ..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-bold text-xs outline-none" />
                 </div>

                 {/* 2x2 Grid for Numbers - As shown in the screenshot */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">ราคาทุน (Cost)</label>
                       <input type="number" value={formData.cost_price} onChange={e => setFormData({...formData, cost_price: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-blue-500 uppercase tracking-widest ml-1">ราคาขาย (Sale)</label>
                       <input type="number" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: Number(e.target.value)})} className="w-full h-14 px-6 bg-blue-50/50 text-blue-600 rounded-2xl font-black text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">สต็อกต้นงวด</label>
                       <input type="number" value={formData.stock_level} onChange={e => setFormData({...formData, stock_level: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-1">จุดเตือนสต็อกต่ำ</label>
                       <input type="number" value={formData.min_stock} onChange={e => setFormData({...formData, min_stock: Number(e.target.value)})} className="w-full h-14 px-6 bg-rose-50/50 text-rose-600 rounded-2xl font-black text-xs outline-none" />
                    </div>
                 </div>

                 <button onClick={handleSavePart} disabled={isSaving} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                    {isSaving ? "กําลังบันทึก..." : <><Save size={18}/> บันทึกอะไหล่ลงคลัง</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
