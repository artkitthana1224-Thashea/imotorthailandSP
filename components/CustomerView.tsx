
import React, { useState } from 'react';
import { Users, Plus, Search, Mail, Phone, MapPin, Trash2, Edit3, X, Save, UserCheck, ChevronRight } from 'lucide-react';
import { Customer } from '../types';

interface CustomerViewProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

export const CustomerView: React.FC<CustomerViewProps> = ({ customers, setCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('ทั้งหมด');

  const provinces = ['ทั้งหมด', ...Array.from(new Set(customers.map(c => c.province)))];

  const filteredCustomers = customers.filter(c => 
    (selectedProvince === 'ทั้งหมด' || c.province === selectedProvince) &&
    (c.name.includes(searchTerm) || c.phone.includes(searchTerm))
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
         <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">ฐานข้อมูลลูกค้า <span className="text-emerald-500">CRM</span></h1>
            <p className="text-slate-500 font-medium">ดูแลลูกค้าของคุณและประวัติการเข้าซ่อมตามจังหวัด</p>
         </div>
         <button className="px-10 py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">
            <Plus size={18} className="inline mr-2" /> ลงทะเบียนลูกค้าใหม่
         </button>
      </div>

      {/* Summary Provinces */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
         {provinces.map(prov => (
            <button key={prov} onClick={() => setSelectedProvince(prov)} className={`p-5 rounded-[28px] border transition-all text-center ${selectedProvince === prov ? 'bg-emerald-600 text-white border-emerald-600 shadow-xl' : 'bg-white border-slate-100 hover:bg-emerald-50 text-slate-500'}`}>
               <p className="text-[10px] font-black uppercase tracking-widest mb-1">{prov}</p>
               <p className="text-xl font-black">{prov === 'ทั้งหมด' ? customers.length : customers.filter(c => c.province === prov).length}</p>
            </button>
         ))}
      </div>

      <div className="bg-white/60 dark:bg-slate-900 rounded-[48px] border border-white shadow-xl overflow-hidden">
         <div className="p-8 border-b border-slate-100 flex gap-4">
            <div className="relative flex-1">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input type="text" placeholder="ค้นหาชื่อลูกค้าหรือเบอร์โทร..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-800 border-none rounded-2xl text-sm font-bold shadow-inner" />
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/50">
                     <th className="px-8 py-6">ชื่อ-นามสกุล</th>
                     <th className="px-8 py-6">จังหวัด</th>
                     <th className="px-8 py-6">เบอร์ติดต่อ</th>
                     <th className="px-8 py-6 text-center">ประเภท</th>
                     <th className="px-8 py-6 text-right">แอคชั่น</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {filteredCustomers.map(cust => (
                     <tr key={cust.id} className="hover:bg-emerald-50/30 transition-all">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">{cust.name.charAt(0)}</div>
                              <p className="text-sm font-black text-slate-900">{cust.name}</p>
                           </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold text-slate-500"><MapPin size={14} className="inline mr-2 text-rose-500"/>{cust.province}</td>
                        <td className="px-8 py-6 text-sm font-bold text-slate-600">{cust.phone}</td>
                        <td className="px-8 py-6 text-center">
                           <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase ${cust.type === 'FLEET' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>{cust.type}</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button className="p-2 text-slate-400 hover:text-blue-600"><ChevronRight size={18}/></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};
