
import React, { useRef } from 'react';
import { Settings, MapPin, Building, CreditCard, Shield, Camera, User, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  currentUser: any;
  setCurrentUser: (u: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, setCurrentUser }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentUser({ ...currentUser, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">ตั้งค่าพรีเมียม (Settings)</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">จัดการข้อมูลส่วนตัว สาขา และการเข้าถึงระบบ</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Profile Section */}
        <section className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
           <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                 <div className="w-32 h-32 rounded-[40px] overflow-hidden ring-8 ring-blue-50 dark:ring-slate-800 shadow-2xl transition-all group-hover:scale-105 duration-500">
                    <img src={currentUser.avatar} alt="Profile" className="w-full h-full object-cover" />
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white dark:border-slate-900 transition-all group-hover:rotate-12">
                    <Camera size={20} />
                 </div>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                 />
              </div>
              <div className="flex-1 text-center md:text-left">
                 <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{currentUser.name}</h3>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{currentUser.role} | ศูนย์บริการสมุทรปราการ</p>
                 <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                    <button onClick={handleAvatarClick} className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-100 transition-all">เปลี่ยนรูป</button>
                    <button onClick={() => setCurrentUser({...currentUser, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop'})} className="px-6 py-3 text-rose-500 text-xs font-black uppercase tracking-widest hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-xl transition-all flex items-center gap-2"><Trash2 size={14}/> ลบรูป</button>
                 </div>
              </div>
           </div>
        </section>

        <section className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
           <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-4"><Building className="text-blue-600" /> ข้อมูลสาขาสมุทรปราการ</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">ชื่อสาขา</label>
                 <input type="text" defaultValue="I-Motor Thailand | Samut Prakan" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">เลขประจำตัวผู้เสียภาษี</label>
                 <input type="text" defaultValue="0115565000001" className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold dark:text-white" />
              </div>
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">ที่อยู่สาขา</label>
              <textarea className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl font-bold h-32 dark:text-white">ตำบลบางปู อำเภอเมืองสมุทรปราการ จังหวัดสมุทรปราการ 10280</textarea>
           </div>
        </section>

        <section className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
           <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-4"><Shield className="text-indigo-600" /> การรักษาความปลอดภัย</h3>
           <div className="flex items-center justify-between p-8 bg-slate-50 dark:bg-slate-800 rounded-[32px]">
              <div>
                 <p className="font-black text-slate-900 dark:text-white">การยืนยันตัวตนสองชั้น (2FA)</p>
                 <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">เพิ่มความปลอดภัยให้กับบัญชีผู้ใช้ของคุณ</p>
              </div>
              <div className="w-16 h-9 bg-blue-600 rounded-full relative p-1.5 cursor-pointer">
                 <div className="absolute right-1.5 top-1.5 w-6 h-6 bg-white rounded-full shadow-lg"></div>
              </div>
           </div>
        </section>
      </div>

      <div className="flex justify-end gap-6 pt-8">
         <button className="px-10 py-5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest">ยกเลิก</button>
         <button className="px-14 py-5 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-slate-200 dark:shadow-none uppercase text-[10px] tracking-widest hover:scale-105 transition-transform">บันทึกข้อมูลทั้งหมด</button>
      </div>
    </div>
  );
};
