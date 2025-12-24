
import React, { useState, useEffect } from 'react';
import { Package, Search, Trash2, AlertCircle, Banknote, X, Save, Edit3 } from 'lucide-react';
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
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  
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
      alert("กรุณาระบุรหัส SKU และชื่ออะไหล่");
      return;
    }
    setIsSaving(true);
    const payload = {
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      cost_price: formData.cost_price,
      sale_price: formData.sale_price,
      stock_level: formData.stock_level,
      min_stock: formData.min_stock,
      company_id: '1001'
    };

    const { error } = editingPart 
      ? await supabase.from('parts').update(payload).eq('id', editingPart.id)
      : await supabase.from('parts').insert([{ ...payload, id: generateNumericId() }]);

    if (!error) {
      await fetchParts();
      closeModal();
    } else {
      alert("Error: " + error.message);
    }
    setIsSaving(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPart(null);
    setFormData({ sku: '', name: '', category: 'Battery', cost_price: 0, sale_price: 0, stock_level: 0, min_stock: 5 });
  };

  return (
    <div className="space-y-8 animate-in pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">คลังอะไหล่ <span className="text-orange-500">Inventory</span></h1>
           <p className="text-slate-500 text-[10px] uppercase tracking-widest mt-1">Stock Management System</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="h-12 px-10 bg-slate-900 text-white rounded-2xl uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
           + ลงทะเบียนอะไหล่
        </button>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input type="text" placeholder="ค้นหา SKU หรือชื่ออะไหล่..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-6 py-4 bg-slate-50 rounded-2xl border-none text-[11px] outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50 text-[9px] uppercase text-slate-400 tracking-widest">
                  <tr>
                     <th className="px-10 py-5">SKU / ชื่ออะไหล่</th>
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
                           <p className="text-slate-900 text-xs uppercase">{part.sku}</p>
                           <p className="text-[10px] text-slate-400 uppercase">{part.name}</p>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <span className={`text-sm ${part.stock_level <= part.min_stock ? 'text-rose-500' : 'text-slate-900'}`}>{part.stock_level}</span>
                        </td>
                        <td className="px-10 py-6 text-right text-[10px] text-slate-400">฿{part.cost_price?.toLocaleString()}</td>
                        <td className="px-10 py-6 text-right text-xs text-blue-600 italic">฿{part.sale_price?.toLocaleString()}</td>
                        <td className="px-10 py-6 text-right">
                           <button onClick={() => { setEditingPart(part); setFormData(part); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-blue-500 mr-2"><Edit3 size={16}/></button>
                           <button className="p-2 text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-in zoom-in-95 overflow-hidden">
              <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                 <div>
                    <h3 className="text-xl uppercase italic tracking-tighter">ลงทะเบียนอะไหล่ใหม่</h3>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">Register New Part</p>
                 </div>
                 <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={24}/></button>
              </div>
              <div className="p-10 space-y-6">
                 {/* SKU & Name with Labels */}
                 <div className="space-y-4">
                    <div className="space-y-1">
                       <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">รหัส SKU</label>
                       <input type="text" placeholder="ระบุ SKU..." value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">ชื่ออะไหล่</label>
                       <input type="text" placeholder="ระบุชื่ออะไหล่..." value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl text-xs outline-none" />
                    </div>
                 </div>

                 {/* 2x2 Numeric Grid with Labels */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">ราคาทุน</label>
                       <input type="number" value={formData.cost_price} onChange={e => setFormData({...formData, cost_price: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl text-xs outline-none text-blue-600" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] uppercase tracking-widest text-blue-500 ml-1">ราคาขาย</label>
                       <input type="number" value={formData.sale_price} onChange={e => setFormData({...formData, sale_price: Number(e.target.value)})} className="w-full h-14 px-6 bg-blue-50/50 text-blue-600 rounded-2xl text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">จำนวนสต็อก</label>
                       <input type="number" value={formData.stock_level} onChange={e => setFormData({...formData, stock_level: Number(e.target.value)})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl text-xs outline-none" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[9px] uppercase tracking-widest text-rose-500 ml-1">จุดเตือนสต็อกต่ำ</label>
                       <input type="number" value={formData.min_stock} onChange={e => setFormData({...formData, min_stock: Number(e.target.value)})} className="w-full h-14 px-6 bg-rose-50/50 text-rose-600 rounded-2xl text-xs outline-none" />
                    </div>
                 </div>

                 <button onClick={handleSavePart} disabled={isSaving} className="w-full py-5 bg-slate-900 text-white rounded-2xl uppercase tracking-widest text-[10px] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                    {isSaving ? "กําลังบันทึก..." : <><Save size={18}/> บันทึกข้อมูลอะไหล่</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
