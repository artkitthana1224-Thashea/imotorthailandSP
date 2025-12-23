
import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MoreHorizontal, Trash2, Edit3, X, Save, UserCheck } from 'lucide-react';
import { Customer } from '../types';

interface CustomerViewProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ customers, setCustomers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    type: 'INDIVIDUAL',
    loyaltyPoints: 0
  });

  const handleSave = () => {
    if (editingCustomer) {
      setCustomers(prev => prev.map(c => c.id === editingCustomer.id ? { ...c, ...formData } as Customer : c));
    } else {
      const newCust: Customer = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        companyId: 'c1',
      } as Customer;
      setCustomers(prev => [...prev, newCust]);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
    setFormData({ name: '', phone: '', email: '', type: 'INDIVIDUAL', loyaltyPoints: 0 });
  };

  const openEdit = (cust: Customer) => {
    setEditingCustomer(cust);
    setFormData(cust);
    setIsModalOpen(true);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
            ลูกค้า <span className="text-emerald-500">CRM</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">จัดการรายชื่อลูกค้าและฐานข้อมูลประวัติการรับบริการ</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="h-14 px-8 bg-emerald-600 text-white rounded-2xl font-black shadow-2xl flex items-center gap-3 uppercase tracking-widest text-[10px]">
          <Plus size={20} /> เพิ่มลูกค้าใหม่
        </button>
      </div>

      <div className="relative">
         <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
         <input type="text" placeholder="ค้นหาตามชื่อ หรือ เบอร์โทรศัพท์..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white dark:bg-slate-900 border-none rounded-3xl text-sm font-bold shadow-xl outline-none ring-2 ring-transparent focus:ring-emerald-500/10 transition-all dark:text-white" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white dark:bg-slate-900 p-8 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 dark:bg-emerald-900/10 -mr-16 -mt-16 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="flex items-start justify-between mb-8 relative">
               <div className="w-16 h-16 rounded-[24px] bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center text-xl font-black shadow-xl uppercase">{customer.name.substring(0,2)}</div>
               <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase ${customer.type === 'FLEET' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{customer.type}</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-emerald-500 transition-colors">{customer.name}</h3>
            <div className="space-y-4">
               <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 group/item">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover/item:text-emerald-600 transition-colors"><Phone size={16} /></div>
                  <span className="text-sm font-bold">{customer.phone}</span>
               </div>
               <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 group/item">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover/item:text-emerald-600 transition-colors"><Mail size={16} /></div>
                  <span className="text-sm font-bold truncate">{customer.email}</span>
               </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">สะสม</p>
                  <p className="text-lg font-black text-emerald-600">{customer.loyaltyPoints.toLocaleString()} <span className="text-xs text-slate-400">PTS</span></p>
               </div>
               <div className="flex gap-2">
                  <button onClick={() => openEdit(customer)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl hover:text-emerald-600 transition-all"><Edit3 size={18} /></button>
                  <button onClick={() => setCustomers(customers.filter(c => c.id !== customer.id))} className="p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl hover:bg-rose-100 transition-all"><Trash2 size={18} /></button>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-[40px] shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3"><UserCheck className="text-emerald-500" /> {editingCustomer ? 'แก้ไขลูกค้า' : 'เพิ่มลูกค้าใหม่'}</h3>
               <button onClick={closeModal} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ชื่อ-นามสกุล</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white shadow-inner" placeholder="ชื่อลูกค้า หรือ ชื่อบริษัท" />
               </div>
               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">เบอร์โทรศัพท์</label>
                     <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white shadow-inner" placeholder="0XX-XXX-XXXX" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">ประเภทลูกค้า</label>
                     <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as 'INDIVIDUAL' | 'FLEET'})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white outline-none">
                        <option value="INDIVIDUAL">ทั่วไป (Individual)</option>
                        <option value="FLEET">องค์กร (Fleet)</option>
                     </select>
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">อีเมล</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white shadow-inner" placeholder="example@email.com" />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">แต้มสะสมเบื้องต้น</label>
                  <input type="number" value={formData.loyaltyPoints} onChange={e => setFormData({...formData, loyaltyPoints: parseInt(e.target.value)})} className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none font-bold dark:text-white shadow-inner" />
               </div>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 flex justify-end gap-4">
               <button onClick={closeModal} className="px-6 py-3 text-slate-500 font-black uppercase text-[10px]">ยกเลิก</button>
               <button onClick={handleSave} className="px-12 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl flex items-center gap-3">
                  <Save size={18}/> {editingCustomer ? 'อัปเดตข้อมูล' : 'ลงทะเบียนลูกค้า'}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
