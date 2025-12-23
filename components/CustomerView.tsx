
import React, { useState, useEffect } from 'react';
import { Users, Search, MapPin, ChevronRight, X, Save, Trash2, Phone, Mail, UserPlus } from 'lucide-react';
import { Customer } from '../types';
import { supabase } from '../services/supabaseClient';

interface CustomerViewProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ customers, setCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ทั้งหมด');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState<Partial<Customer>>({
    name: '',
    phone: '',
    email: '',
    province: 'กรุงเทพฯ',
    address: '',
    type: 'INDIVIDUAL',
    loyalty_points: 0
  });

  const fetchCustomers = async () => {
    const { data, error } = await supabase.from('customers').select('*').order('name');
    if (!error && data) setCustomers(data);
  };

  const handleSaveCustomer = async () => {
    if (!formData.name || !formData.phone) {
      alert("กรุณากรอกชื่อและเบอร์โทรศัพท์");
      return;
    }

    setIsSaving(true);
    const customerData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      province: formData.province,
      address: formData.address,
      type: formData.type,
      company_id: 'c1' // Multi-tenant ID
    };

    const { error } = editingCustomer 
      ? await supabase.from('customers').update(customerData).eq('id', editingCustomer.id)
      : await supabase.from('customers').insert([customerData]);

    if (error) {
      alert("Error: " + error.message);
    } else {
      await fetchCustomers();
      setIsModalOpen(false);
      resetForm();
    }
    setIsSaving(false);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("คุณต้องการลบรายชื่อลูกค้านี้ใช่หรือไม่?")) return;
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (!error) await fetchCustomers();
    else alert("Error: " + error.message);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', email: '', province: 'กรุงเทพฯ', address: '', type: 'INDIVIDUAL', loyalty_points: 0 });
    setEditingCustomer(null);
  };

  const provinces = ['ทั้งหมด', ...Array.from(new Set(customers.map(c => c.province)))];
  
  const filteredCustomers = customers.filter(c => 
    (selectedProvince === 'ทั้งหมด' || c.province === selectedProvince) &&
    (c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c.phone?.includes(searchTerm))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">ลูกค้า <span className="text-emerald-500">CRM</span></h1>
            <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">การจัดการข้อมูลลูกค้าผ่านระบบ Cloud Database</p>
         </div>
         <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="h-12 px-10 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all">
            + ลงทะเบียนลูกค้าใหม่
         </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
         {provinces.map((prov) => (
            <button 
              key={prov} 
              onClick={() => setSelectedProvince(prov)}
              className={`px-8 py-4 rounded-[32px] border transition-all text-[10px] font-black uppercase tracking-widest flex-shrink-0 ${selectedProvince === prov ? 'bg-emerald-600 text-white border-transparent shadow-lg' : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'}`}
            >
              {prov} ({prov === 'ทั้งหมด' ? customers.length : customers.filter(c => c.province === prov).length})
            </button>
         ))}
      </div>

      <div className="bg-white rounded-[48px] border border-slate-100 shadow-xl overflow-hidden">
         <div className="p-8 border-b border-slate-50">
            <div className="relative">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
               <input type="text" placeholder="ค้นหาชื่อลูกค้า หรือ เบอร์โทรศัพท์..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-3xl text-xs font-bold outline-none shadow-inner" />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] bg-slate-50/50">
                     <th className="px-10 py-5">ชื่อลูกค้า</th>
                     <th className="px-10 py-5">จังหวัด</th>
                     <th className="px-10 py-5">ข้อมูลติดต่อ</th>
                     <th className="px-10 py-5 text-center">ประเภท</th>
                     <th className="px-10 py-5 text-right">ดำเนินการ</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {filteredCustomers.map(cust => (
                     <tr key={cust.id} className="hover:bg-slate-50 transition-all group">
                        <td className="px-10 py-6 font-black text-xs text-slate-900 uppercase">{cust.name}</td>
                        <td className="px-10 py-6 text-[10px] font-bold text-slate-400 uppercase">{cust.province}</td>
                        <td className="px-10 py-6">
                           <p className="text-xs font-black">{cust.phone}</p>
                           <p className="text-[9px] text-slate-400 uppercase">{cust.email || '-'}</p>
                        </td>
                        <td className="px-10 py-6 text-center">
                           <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase ${cust.type === 'FLEET' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>{cust.type}</span>
                        </td>
                        <td className="px-10 py-6 text-right space-x-2">
                           <button onClick={() => { setEditingCustomer(cust); setFormData(cust); setIsModalOpen(true); }} className="p-2 text-slate-300 hover:text-blue-500"><ChevronRight size={18}/></button>
                           <button onClick={() => handleDeleteCustomer(cust.id)} className="p-2 text-slate-200 hover:text-rose-500"><Trash2 size={16}/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                 <h3 className="text-xl font-black uppercase italic tracking-tighter">ลงทะเบียนลูกค้า</h3>
                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={24}/></button>
              </div>
              
              <div className="p-10 space-y-6">
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ชื่อ-นามสกุล / ชื่อบริษัท</label>
                       <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="ระบุชื่อลูกค้า..." />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">เบอร์โทรศัพท์</label>
                       <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="08x-xxx-xxxx" />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">อีเมล</label>
                       <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" placeholder="example@mail.com" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-1">จังหวัด</label>
                       <input type="text" value={formData.province} onChange={e => setFormData({...formData, province: e.target.value})} className="w-full h-14 px-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">ที่อยู่</label>
                    <textarea value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full h-24 p-6 bg-slate-50 rounded-2xl font-black text-xs outline-none" />
                 </div>
                 <button onClick={handleSaveCustomer} disabled={isSaving} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3">
                    {isSaving ? "กําลังบันทึก..." : <><Save size={18}/> บันทึกข้อมูลลูกค้า</>}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
