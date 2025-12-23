
import React, { useState } from 'react';
import { Package, Plus, Search, Filter, Trash2, Edit3, AlertCircle, X, Save, Layers } from 'lucide-react';
import { Part } from '../types';

interface InventoryViewProps {
  parts: Part[];
  setParts: React.Dispatch<React.SetStateAction<Part[]>>;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ parts, setParts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPart, setEditingPart] = useState<Part | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Battery', 'Motor', 'Controller', 'Braking System', 'Tire', 'Body Parts', 'Electronics'];

  const [formData, setFormData] = useState<Partial<Part>>({
    name: '',
    sku: '',
    category: 'Battery',
    costPrice: 0,
    salePrice: 0,
    stockLevel: 0,
    minStock: 2
  });

  const filteredParts = parts.filter(p => 
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSave = () => {
    if (editingPart) {
      setParts(prev => prev.map(p => p.id === editingPart.id ? { ...p, ...formData } as Part : p));
    } else {
      const newPart: Part = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        companyId: 'c1',
      } as Part;
      setParts(prev => [...prev, newPart]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPart(null);
    setFormData({ name: '', sku: '', category: 'Battery', costPrice: 0, salePrice: 0, stockLevel: 0, minStock: 2 });
  };

  const openEdit = (part: Part) => {
    setEditingPart(part);
    setFormData(part);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            คลังอะไหล่ <span className="text-orange-500">Stock</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">จัดการรายการชิ้นส่วนมอเตอร์ไซค์ไฟฟ้าและระบบสต็อกสินค้า</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="h-14 px-8 bg-black dark:bg-orange-600 text-white rounded-2xl font-black shadow-2xl flex items-center gap-3 uppercase tracking-widest text-[10px]">
          <Plus size={20} /> เพิ่มอะไหล่ใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Items</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-black text-slate-900 dark:text-white">{parts.length}</p>
              <Package size={32} className="text-blue-500 opacity-20" />
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-rose-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Low Stock Alert</p>
            <div className="flex items-end justify-between">
              <p className="text-4xl font-black text-rose-500">{parts.filter(p => p.stockLevel <= p.minStock).length}</p>
              <AlertCircle size={32} className="text-rose-500 opacity-20" />
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm border-l-4 border-l-indigo-500">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Stock Value</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-black text-slate-900 dark:text-white">฿{(parts.reduce((acc, p) => acc + (p.costPrice * p.stockLevel), 0)).toLocaleString()}</p>
            </div>
         </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="relative flex-1">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="ค้นหาตามรหัส SKU หรือ ชื่ออะไหล่..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl text-sm font-bold shadow-inner dark:text-white outline-none ring-2 ring-transparent focus:ring-blue-500/10 transition-all" />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             {categories.map(cat => (
               <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-black text-white' : 'bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100'}`}>
                 {cat}
               </button>
             ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/30 text-slate-400 text-[10px] font-black uppercase tracking-[0.25em]">
                <th className="px-10 py-6">รายการอะไหล่</th>
                <th className="px-10 py-6">หมวดหมู่</th>
                <th className="px-10 py-6 text-center">คงเหลือ</th>
                <th className="px-10 py-6 text-right">ราคาขาย</th>
                <th className="px-10 py-6 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {filteredParts.map((part) => (
                <tr key={part.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform"><Package size={22} /></div>
                      <div>
                        <p className="text-sm font-black text-slate-900 dark:text-white">{part.name}</p>
                        <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase mt-1">SKU: {part.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className="px-4 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700">{part.category}</span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex flex-col items-center">
                       <span className={`text-lg font-black ${part.stockLevel <= part.minStock ? 'text-rose-500' : 'text-slate-900 dark:text-white'}`}>{part.stockLevel}</span>
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Units</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">฿{part.salePrice.toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(part)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={18} /></button>
                      <button onClick={() => setParts(parts.filter(p => p.id !== part.id))} className="p-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[40px] shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3"><Layers className="text-orange-500" /> {editingPart ? 'แก้ไขอะไหล่' : 'เพิ่มอะไหล่ใหม่'}</h3>
               <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={20}/></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
               <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่ออะไหล่</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" placeholder="เช่น Lithium Battery Vapor S" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">รหัส SKU</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" placeholder="IMT-XXX" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">หมวดหมู่</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white">
                     {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ราคาทุน</label>
                  <input type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ราคาขาย</label>
                  <input type="number" value={formData.salePrice} onChange={e => setFormData({...formData, salePrice: parseFloat(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">จำนวนคงเหลือ</label>
                  <input type="number" value={formData.stockLevel} onChange={e => setFormData({...formData, stockLevel: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">จุดเตือนสต็อกต่ำ</label>
                  <input type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white" />
               </div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 flex justify-end gap-4">
               <button onClick={closeModal} className="px-6 py-3 text-slate-500 font-black uppercase text-[10px]">ยกเลิก</button>
               <button onClick={handleSave} className="px-12 py-4 bg-orange-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center gap-3">
                  <Save size={18}/> {editingPart ? 'อัปเดตอะไหล่' : 'บันทึกลงคลัง'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
