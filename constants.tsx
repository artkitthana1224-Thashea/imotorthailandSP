
import { Company, User, UserRole, Customer, Vehicle, Part, WorkOrder, WorkOrderStatus, RepairService } from './types';

export const MOCK_COMPANIES: Company[] = [
  { 
    id: '1001', 
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
    id: '2001', 
    company_id: '1001', 
    name: 'Admin System', 
    email: 'admin@i-motor.th', 
    role: UserRole.ADMIN, 
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop'
  }
];

export const MOCK_REPAIR_SERVICES: RepairService[] = [
  { id: '3001', name: 'เช็คระยะ 1,000 กม.', basePrice: 350 },
  { id: '3002', name: 'เปลี่ยนแบตเตอรี่', basePrice: 0 }
];
