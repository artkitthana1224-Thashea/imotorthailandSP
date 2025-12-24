import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Edit3, Trash2, ShieldCheck, Mail, Phone, X, Save, 
  Camera, Briefcase, User as UserIcon, ShieldAlert, Star
} from 'lucide-react';
import { User, UserRole, Company } from '../types';
import { supabase } from '../services/supabaseClient';
import { generateUUID } from '../constants';

interface StaffViewProps {
  currentCompany: Company;
  currentUser: User;
}

export const StaffView: React.FC<StaffViewProps> = ({ currentCompany, currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('company_id', currentCompany.id)
      .order('name');
    if (data) setUsers(data);
  };

  const handleSaveUser = async () => {
    if (!editingUser?.name || !editingUser?.email) {
      alert("กรุณาระบุชื่อและอีเมลพนักงาน");
      return;
    }
    setIsSaving(true);
    
    const payload = {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role || UserRole.MECHANIC,
      company_id: currentCompany.id,
      avatar: editingUser.avatar || `https://ui-avatars.com/api/?name=${editingUser.name}&background=random`
    };

    const { error } = editingUser.id 
      ? await supabase.from('users').update(payload).eq('id', editingUser.id)
      : await supabase.from('users').insert([{ ...payload, id: generateUUID() }]);

    if (error) {
      alert("Error saving user: " + error.message);
    } else {
      await fetchUsers();
      setIsModalOpen(false);
    }
    setIsSaving(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUser.id) {
      alert("ไม่สามารถลบบัญชีที่คุณกำลังใช้งานอยู่ได้");
      return;
    }
    if (!confirm("ยืนยันการลบพนักงาน? รายชื่อช่างนี้จะหายไปจากระบบและใบงานซ่อม")) return;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (!error) await fetchUsers();
    else alert("Error: " + error.message);
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in duration-700 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">จัดการพนักงาน <span className="text-cyan-600">Staff</span></h1>
           <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">รายชื่อพนักงานและช่างรับผิดชอบประจำศูนย์บริการ</p>
        </div>
        <button onClick={() => { setEditingUser({ role: UserRole.MECHANIC }); setIsModalOpen(true); }} className="h-14 px-10 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
          <UserPlus size={18}/> เพิ่มพนักงาน / ช่างใหม่
        </button>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="relative">
           <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
           <input 
             type="text" 
             placeholder="ค้นหาตามชื่อ หรือ อีเมล..." 
             value={searchTerm} 
             onChange={e => setSearchTerm(e.target.value)} 
             className="w-full pl-16 pr-8 py-5 bg-slate-50 rounded-[24px] border-none text-[11px] font-black uppercase outline-none" 
           />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">
              <tr>
                <th className="px-10 py-6">รูป / ชื่อพนักงาน</th>
                <th className="px-10 py-6">อีเมลติดต่อ</th>
                <th className="px-10 py-6 text-center">บทบาท (Role)</th>
                <th className="px-10 py-6 text-right">ดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-cyan-50/30 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-[18px] overflow-hidden border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <img src={u.avatar} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{u.name}</p>
                        {u.role === UserRole.MECHANIC && <p className="text-[8px] font-black text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-md inline-block mt-1 uppercase">ช่างเทคนิค</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-xs text-slate-400 font-bold">{u.email}</td>
                  <td className="px-10 py-6 text-center">
                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase ${
                      u.role === UserRole.ADMIN || u.role === UserRole.OWNER ? 'bg-indigo-50 text-indigo-600' :
                      u.role === UserRole.MECHANIC ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right space-x-2">
                    <button onClick={() => { setEditingUser(u); setIsModalOpen(true); }} className="p-3 text-slate-300 hover:text-cyan-600 transition-colors"><Edit3 size={18}/></button>
                    <button onClick={() => handleDeleteUser(u.id)} className="p-3 text-slate-200 hover:text-rose-600 transition-colors"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-in zoom-in-95 overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter">{editingUser?.id ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}</h3>
                <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">ระบุสิทธิ์และบทบาทในระบบ</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><X size={24}/></button>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">ชื่อ-นามสกุล</label>
                  <div className="relative">
                    <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                    <input 
                      type="text" 
                      placeholder="เช่น ช่างสมชาย ใจดี" 
                      value={editingUser?.name || ''} 
                      onChange={e => setEditingUser({...editingUser, name: e.target.value})} 
                      className="w-full h-14 pl-14 pr-6 bg-slate-50 rounded-[24px] text-xs font-black outline-none border border-transparent focus:border-cyan-500/20" 
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-slate-400 ml-1">อีเมลพนักงาน</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18}/>
                    <input 
                      type="email" 
                      placeholder="staff@i-motor.th" 
                      value={editingUser?.email || ''} 
                      onChange={e => setEditingUser({...editingUser, email: e.target.value})} 
                      className="w-full h-14 pl-14 pr-6 bg-slate-50 rounded-[24px] text-xs font-black outline-none border border-transparent focus:border-cyan-500/20" 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-widest text-cyan-600 ml-1 font-black">สิทธิ์การเข้าใช้งาน (Role)</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-500" size={18}/>
                    <select 
                      value={editingUser?.role || UserRole.MECHANIC} 
                      onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})} 
                      className="w-full h-14 pl-14 pr-6 bg-cyan-50/50 text-cyan-700 rounded-[24px] text-xs font-black outline-none border border-cyan-100"
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-amber-50 rounded-[28px] border border-amber-100 flex gap-4">
                <ShieldAlert className="text-amber-500 shrink-0" size={20}/>
                <p className="text-[9px] text-amber-700 font-bold leading-relaxed uppercase">
                  พนักงานจะสามารถเข้าใช้งานระบบได้ด้วยสิทธิ์ที่ท่านกำหนด โปรดระมัดระวังการตั้งสิทธิ์ Admin หรือ Owner
                </p>
              </div>

              <button 
                onClick={handleSaveUser} 
                disabled={isSaving} 
                className="w-full py-5 bg-slate-900 text-white rounded-[24px] uppercase tracking-widest text-[10px] font-black shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
              >
                {isSaving ? "Saving..." : <><Save size={18}/> บันทึกข้อมูลพนักงาน</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};