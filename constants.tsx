
import { Company, User, UserRole, Customer, Vehicle, Part, WorkOrder, WorkOrderStatus, RepairService } from './types';

export const MOCK_COMPANIES: Company[] = [
  { 
    id: 'c1', 
    name: 'I-MOTOR MANUFACTURING CO., LTD.', 
    logo: 'https://i-motor-thailand.com/wp-content/uploads/2022/03/logo-i-motor.png', 
    // Fixed taxId to tax_id
    tax_id: '0105561118881', 
    plan: 'ENTERPRISE', 
    // Fixed vatRate to vat_rate
    vat_rate: 7,
    address: '90 Moo 4, Tambon Bang Chalong, Amphur Bang Phli, Samut Prakan 10540, Thailand',
    // Fixed branchName to branch_name
    branch_name: 'Headquarters'
  }
];

export const MOCK_USERS: User[] = [
  { 
    id: 'u1', 
    // Fixed companyId to company_id
    company_id: 'c1', 
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
  { id: 'rs4', name: 'เปลี่ยนถ่ายน้ำมันเครื่องถึงบ้านลูกค้า', basePrice: 450 },
  { id: 'rs5', name: 'เช็คระยะ 1,000 กม.', basePrice: 350 },
  { id: 'rs6', name: 'ซ่อมระบบเบรก', basePrice: 600 }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'cust1', company_id: 'c1', name: 'คุณสมพงษ์ ยอดประเสริฐ', phone: '081-234-5678', email: 'sompong@example.com', province: 'สมุทรปราการ', address: '123/45 หมู่บ้านอิ่มสบาย ซอย 5 ถนนบางนา-ตราด กม.18 ต.บางโฉลง อ.บางพลี จ.สมุทรปราการ 10540', type: 'INDIVIDUAL', loyalty_points: 450 },
  { id: 'cust2', company_id: 'c1', name: 'บริษัท ขนส่งด่วน จำกัด', phone: '02-123-4567', email: 'fleet@express.co.th', province: 'กรุงเทพฯ', address: '99/1 อาคารเอ็กซ์เพรส ชั้น 12 ถนนวิภาวดีรังสิต แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900', type: 'FLEET', loyalty_points: 12000 },
  { id: 'cust3', company_id: 'c1', name: 'คุณมานี รักดี', phone: '089-999-8888', email: 'manee@gmail.com', province: 'นนทบุรี', address: '50/2 ถนนรัตนาธิเบศร์ ต.บางกระสอ อ.เมือง จ.นนทบุรี 11000', type: 'INDIVIDUAL', loyalty_points: 120 },
  { id: 'cust4', company_id: 'c1', name: 'คุณวิชัย สุขใจ', phone: '085-111-2222', email: 'vichai@test.com', province: 'ชลบุรี', address: '12/3 ถนนสุขุมวิท ต.แสนสุข อ.เมือง จ.ชลบุรี 20130', type: 'INDIVIDUAL', loyalty_points: 80 }
];

export const MOCK_VEHICLES: (Vehicle & { color?: string, charger?: string, price?: number })[] = [
  { id: 'v1', customer_id: 'cust1', brand: 'I-Motor', model: 'Vapor CBS', vin: 'IMT-VPR-BK-001', battery_type: 'Lithium 72V', motor_power: '3000W', warranty_until: '2027-03-20', color: 'Onyx Black', charger: '8A', price: 85500 },
  { id: 'v2', customer_id: 'cust2', brand: 'I-Motor', model: 'Vapor CBS', vin: 'IMT-VPR-BL-002', battery_type: 'Lithium 72V', motor_power: '3000W', warranty_until: '2027-03-20', color: 'Aero Blue', charger: '15A', price: 90500 }
];

export const MOCK_PARTS: Part[] = [
  { id: 'p1', company_id: 'c1', sku: 'IM-BATT-LITH', name: 'Lithium Battery Pack 72V', category: 'Battery', cost_price: 25000, sale_price: 35000, stock_level: 5, min_stock: 2 },
  { id: 'p2', company_id: 'c1', sku: 'IM-CTRL-3000', name: 'Motor Controller 3000W', category: 'Electronics', cost_price: 8500, sale_price: 12500, stock_level: 10, min_stock: 3 },
  { id: 'p3', company_id: 'c1', sku: 'IM-TIRE-12', name: 'Vapor Street Tire 12"', category: 'Tires', cost_price: 1200, sale_price: 1850, stock_level: 24, min_stock: 8 }
];

export const MOCK_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'wo1',
    orderNumber: 'IM-WO-24-001',
    company_id: 'c1',
    vehicle_id: 'v1',
    customer_id: 'cust1',
    status: WorkOrderStatus.IN_PROGRESS,
    issue_description: 'ตรวจสอบสุขภาพแบตเตอรี่และระบบเบรก',
    parts_used: [],
    labor_cost: 500,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    total_amount: 500,
    is_claim: false,
    photos: { before: [], after: [] }
  }
];
