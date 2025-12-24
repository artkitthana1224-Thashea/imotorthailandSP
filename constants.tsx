
import { Company, User, UserRole, Customer, Vehicle, Part, WorkOrder, WorkOrderStatus, RepairService } from './types';

// Use valid UUID format strings to match Supabase UUID column type
export const MOCK_COMPANIES: Company[] = [
  { 
    id: '00000000-0000-0000-0000-000000001001', 
    name: 'I-MOTOR MANUFACTURING CO., LTD.', 
    logo: 'https://i-motor-thailand.com/wp-content/uploads/2022/03/logo-i-motor.png', 
    tax_id: '0105561118881', 
    plan: 'ENTERPRISE', 
    vat_rate: 7,
    address: '90 Moo 4, Tambon Bang Chalong, Samut Prakan',
    branch_name: 'สำนักงานใหญ่'
  }
];

export const MOCK_USERS: User[] = [
  { 
    id: '00000000-0000-0000-0000-000000002001', 
    company_id: '00000000-0000-0000-0000-000000001001', 
    name: 'Admin System', 
    email: 'admin@i-motor.th', 
    role: UserRole.ADMIN, 
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop'
  }
];

export const MOCK_REPAIR_SERVICES: RepairService[] = [
  { id: '00000000-0000-0000-0000-000000003001', name: 'เช็คระยะ 1,000 กม.', basePrice: 350 },
  { id: '00000000-0000-0000-0000-000000003002', name: 'เปลี่ยนแบตเตอรี่', basePrice: 0 }
];

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
