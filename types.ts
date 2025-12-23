
export enum UserRole {
  ADMIN = 'ADMIN',
  MECHANIC = 'MECHANIC',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  ACCOUNTING = 'ACCOUNTING',
  MANAGER = 'MANAGER',
  SUPERVISOR = 'SUPERVISOR',
  OWNER = 'OWNER'
}

export enum WorkOrderStatus {
  PENDING = 'PENDING',
  DIAGNOSING = 'DIAGNOSING',
  WAITING_PARTS = 'WAITING_PARTS',
  IN_PROGRESS = 'IN_PROGRESS',
  QC = 'QC',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface Company {
  id: string; // Numeric ID String
  name: string;
  logo: string;
  tax_id: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  vat_rate: number;
  address: string;
  branch_name: string;
}

export interface User {
  id: string; // Numeric ID String
  company_id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Customer {
  id: string; // Numeric ID String
  company_id: string;
  name: string;
  phone: string;
  email: string;
  province: string;
  address: string;
  type: 'INDIVIDUAL' | 'FLEET';
  loyalty_points: number;
}

export interface Vehicle {
  id: string; // Numeric ID String
  customer_id: string;
  brand: string;
  model: string;
  vin: string;
  battery_type: string;
  motor_power: string;
  warranty_until: string;
  qr_code?: string;
}

export interface Part {
  id: string; // Numeric ID String
  company_id: string;
  sku: string;
  name: string;
  category: string;
  cost_price: number;
  sale_price: number;
  stock_level: number;
  min_stock: number;
  image?: string;
}

export interface WorkOrder {
  id: string; // Numeric ID String
  orderNumber: string;
  company_id: string;
  vehicle_id: string;
  customer_id: string;
  status: WorkOrderStatus;
  issue_description: string;
  mechanic_id?: string;
  parts_used: { partId: string; quantity: number; price: number; name?: string }[];
  labor_cost: number;
  created_at: string;
  updated_at: string;
  total_amount: number;
  is_claim: boolean;
  photos: { before: string[]; after: string[] };
}

export interface RepairService {
  id: string;
  name: string;
  basePrice: number;
}
