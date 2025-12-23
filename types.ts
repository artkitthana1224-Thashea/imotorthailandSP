
export enum UserRole {
  ADMIN = 'ADMIN',
  MECHANIC = 'MECHANIC',
  INVENTORY = 'INVENTORY',
  SALES = 'SALES',
  ACCOUNTING = 'ACCOUNTING',
  MANAGER = 'MANAGER'
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

export interface RepairService {
  id: string;
  name: string;
  basePrice: number;
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  taxId: string;
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  vatRate: number;
  address: string;
}

export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Customer {
  id: string;
  companyId: string;
  name: string;
  phone: string;
  email: string;
  province: string;
  type: 'INDIVIDUAL' | 'FLEET';
  loyaltyPoints: number;
}

export interface Vehicle {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  vin: string;
  batteryType: string;
  motorPower: string;
  warrantyUntil: string;
}

export interface Part {
  id: string;
  companyId: string;
  sku: string;
  name: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stockLevel: number;
  minStock: number;
  image?: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  companyId: string;
  vehicleId: string;
  customerId: string;
  status: WorkOrderStatus;
  issueDescription: string;
  mechanicId?: string;
  partsUsed: { partId: string; quantity: number; price: number }[];
  laborCost: number;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
}
