export interface User {
  id: number;
  email: string;
  name: string;
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
  customer_id?: number;
  brand: string;
  model: string;
  type: string;
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

export interface ServiceMessage {
  id: number;
  service_id: number;
  message: string;
  is_from_customer: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  customer_id: number;
  device_id: number;
  technician_id?: number;
  device: Device;
  customer: Customer;
  technician?: User;
  problem: string;
  status: string;
  diagnosis?: string;
  solution?: string;
  price?: number;
  messages?: ServiceMessage[];
  created_at: string;
  updated_at: string;
}

export interface DevicePartPrice {
  id: number;
  device_id: number;
  part_id: number;
  price: number;
  created_at: string;
  updated_at: string;
  part?: DevicePart;
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

export interface AuthResponse {
  user: User;
  token: string;
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