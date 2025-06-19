export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Device {
  id: number;
  customer_id: number;
  type: string;
  brand: string;
  model: string;
  serial_number?: string;
  created_at: string;
  updated_at: string;
}

export interface DevicePart {
  id: number;
  device_id: number;
  name: string;
  category: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceCustomer {
  id: number;
  name: string;
  phone: string;
  email?: string;
}

export interface ServiceDevice {
  id: number;
  brand: string;
  model: string;
  type: string;
}

export interface ServiceTechnician {
  id: number;
  name: string;
  email: string;
}

export interface Service {
  id: number;
  customer_id: number;
  device_id: number;
  technician_id?: number;
  problem: string;
  diagnosis?: string;
  solution?: string;
  status: string;
  created_at: string;
  updated_at: string;
  customer: Customer;
  device: Device;
  technician?: User;
  messages?: ServiceMessage[];
}

export interface ServiceMessage {
  id: number;
  service_id: number;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AvailablePart {
  id: number;
  partName: string;
  price: number;
}

export interface PartCategory {
  category: string;
  parts: AvailablePart[];
}

export interface Message {
  id: number;
  service_id: number;
  user_id?: number;
  message: string;
  is_from_customer: boolean;
  customer_phone?: string;
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
}
