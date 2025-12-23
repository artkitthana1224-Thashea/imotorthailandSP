
import { Company, User, UserRole, Customer, Vehicle, Part, WorkOrder, WorkOrderStatus, RepairService } from './types';

export const MOCK_COMPANIES: Company[] = [
  { 
    id: 'c1', 
    name: 'I-MOTOR MANUFACTURING CO., LTD.', 
    logo: 'https://i-motor-thailand.com/wp-content/uploads/2022/03/logo-i-motor.png', 
    taxId: '0105561118881', 
    plan: 'ENTERPRISE', 
    vatRate: 7,
    address: '90 Moo 4, Tambon Bang Chalong, Amphur Bang Phli, Samut Prakan 10540, Thailand'
  }
];

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    companyId: 'c1', 
    name: 'ณัฐวุฒิ พรหมอ่อน', 
    email: 'natthawut@i-motor.th', 
    role: UserRole.ADMIN, 
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=256&h=256&auto=format&fit=crop'
  }
];

export const MOCK_REPAIR_SERVICES: RepairService[] = [
  { id: 'rs1', name: 'เคลมแบตเตอรี่', basePrice: 0 },
  { id: 'rs2', name: 'เปลี่ยนเฟรม', basePrice: 2500 },
  { id: 'rs3', name: 'เปลี่ยนล้อ/ยาง', basePrice: 850 },
  { id: 'rs4', name: 'เปลี่ยนถ่ายน้ำมันเครื่องถึงบ้านลูกค้า', basePrice: 450 }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust1', companyId: 'c1', name: 'คุณสมพงษ์ ยอดประเสริฐ', phone: '081-234-5678', email: 'sompong@example.com', province: 'สมุทรปราการ', type: 'INDIVIDUAL', loyaltyPoints: 450 },
  { id: 'cust2', companyId: 'c1', name: 'บริษัท ขนส่งด่วน จำกัด', phone: '02-123-4567', email: 'fleet@express.co.th', province: 'กรุงเทพฯ', type: 'FLEET', loyaltyPoints: 12000 },
  { id: 'cust3', companyId: 'c1', name: 'คุณมานี รักดี', phone: '089-999-8888', email: 'manee@gmail.com', province: 'นนทบุรี', type: 'INDIVIDUAL', loyaltyPoints: 120 }
];

export const MOCK_VEHICLES: (Vehicle & { color?: string, charger?: string, price?: number })[] = [
  { id: 'v1', customerId: 'cust1', brand: 'I-Motor', model: 'Vapor CBS', vin: 'IMT-VPR-BK-001', batteryType: 'Lithium 72V', motorPower: '3000W', warrantyUntil: '2027-03-20', color: 'Onyx Black', charger: '8A', price: 85500 },
  { id: 'v2', customerId: 'cust2', brand: 'I-Motor', model: 'Vapor CBS', vin: 'IMT-VPR-BL-002', batteryType: 'Lithium 72V', motorPower: '3000W', warrantyUntil: '2027-03-20', color: 'Aero Blue', charger: '15A', price: 90500 }
];

export const MOCK_PARTS: Part[] = [
  { id: 'p1', companyId: 'c1', sku: 'IM-BATT-LITH', name: 'Lithium Battery Pack 72V', category: 'Battery', costPrice: 25000, salePrice: 35000, stockLevel: 5, minStock: 2 },
  { id: 'p2', companyId: 'c1', sku: 'IM-CTRL-3000', name: 'Motor Controller 3000W', category: 'Electronics', costPrice: 8500, salePrice: 12500, stockLevel: 10, minStock: 3 }
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo1',
    orderNumber: 'IM-WO-24-001',
    companyId: 'c1',
    vehicleId: 'v1',
    customerId: 'cust1',
    status: WorkOrderStatus.IN_PROGRESS,
    issueDescription: 'ตรวจสอบสุขภาพแบตเตอรี่และระบบเบรก',
    partsUsed: [],
    laborCost: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    totalAmount: 500
  }
];
