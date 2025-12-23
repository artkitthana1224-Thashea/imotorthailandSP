
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://frqalqtokogxtkeiwlaj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZycWFscXRva29neHRrZWl3bGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0NjAxODksImV4cCI6MjA4MjAzNjE4OX0.6dFxyoqXYA5uRJpVAkdjETUF_13uEhdFA6i311h3Be0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// SQL Setup Script for Supabase SQL Editor
/*
-- 1. Companies Table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo TEXT,
  tax_id TEXT,
  plan TEXT DEFAULT 'FREE',
  vat_rate FLOAT DEFAULT 7,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'MECHANIC',
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Customers Table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  type TEXT DEFAULT 'INDIVIDUAL',
  loyalty_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Vehicles Table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  brand TEXT DEFAULT 'I-Motor',
  model TEXT,
  vin TEXT UNIQUE,
  battery_type TEXT,
  motor_power TEXT,
  warranty_until DATE,
  color TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Parts/Inventory Table
CREATE TABLE parts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id),
  sku TEXT UNIQUE,
  name TEXT NOT NULL,
  category TEXT,
  cost_price FLOAT,
  sale_price FLOAT,
  stock_level INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Work Orders Table
CREATE TABLE work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE,
  company_id UUID REFERENCES companies(id),
  vehicle_id UUID REFERENCES vehicles(id),
  customer_id UUID REFERENCES customers(id),
  status TEXT DEFAULT 'PENDING',
  issue_description TEXT,
  labor_cost FLOAT DEFAULT 0,
  total_amount FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
*/
