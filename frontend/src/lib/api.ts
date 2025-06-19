'use client';

import { supabase } from './supabase';
import { User, Customer, Device, Service, ServiceMessage, DevicePart, DevicePartPrice } from '@/types';


export const handleAuthError = (error: any, clearAuthCallback?: () => void) => {
  const errorMessage = error instanceof Error ? error.message : String(error);
  
  const isAuthError = errorMessage.includes('22P02') ||
                      errorMessage.includes('invalid input syntax') ||
                      errorMessage.includes('foreign key') ||
                      errorMessage.includes('does not exist') ||
                      errorMessage.includes('invalid user') ||
                      errorMessage.includes('authentication') ||
                      errorMessage.includes('unauthorized');
  
  if (isAuthError && clearAuthCallback) {
    console.warn('Authentication error detected, clearing localStorage...', errorMessage);
    clearAuthCallback();
    return true;
  }
  
  return false;
};

interface ServiceWithRelations extends Service {
  customer: Customer;
  device: Device;
  technician?: User;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}


export const auth = {
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Kullanıcı bulunamadı');

      return {
        token: 'dummy-token',
        user: data
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (email: string, password: string, name: string) => {
    try {

      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new Error('Bu email adresi zaten kullanımda');
      }


      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            email,
            password,
            name,
            role: 'TEKNISYEN'
          }
        ])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Kullanıcı oluşturulamadı');

      return {
        token: 'dummy-token',
        user: data
      };
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  },
};


export const customers = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*');
      
    if (error) throw error;
    return data as Customer[];
  },
  
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Customer;
  },
  
  create: async (data: Partial<Customer>) => {
    const { data: customer, error } = await supabase
      .from('customers')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (error) throw error;
    return customer as Customer;
  },
  
  update: async (id: number, data: Partial<Customer>) => {
    const { data: customer, error } = await supabase
      .from('customers')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return customer as Customer;
  },
  
  delete: async (id: number, forceDelete: boolean = false) => {
    if (!forceDelete) {
      const { data: existingServices, error: checkError } = await supabase
        .from('services')
        .select('id')
        .eq('customer_id', id)
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (existingServices && existingServices.length > 0) {
        throw new Error('Bu müşteriyi silemezsiniz çünkü aktif servis kayıtları bulunmaktadır. Önce servis kayıtlarını silin veya müşteriyi devre dışı bırakın.');
      }
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },

  deleteWithServices: async (id: number) => {
    const { data: relatedServices } = await supabase
      .from('services')
      .select('id')
      .eq('customer_id', id);

    if (relatedServices && relatedServices.length > 0) {
      for (const service of relatedServices) {
        await supabase
          .from('service_messages')
          .delete()
          .eq('service_id', service.id);
      }
      
      await supabase
        .from('services')
        .delete()
        .eq('customer_id', id);
    }

    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },

  getByPhone: async (phone: string) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone', phone);

    if (error) throw error;
    return data as Customer[];
  },
};


export const devices = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('devices')
      .select('*');
      
    if (error) throw error;
    return data as Device[];
  },
  
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('devices')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as Device;
  },
  
  create: async (data: Partial<Device>) => {
    const { data: device, error } = await supabase
      .from('devices')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (error) throw error;
    return device as Device;
  },
  
  update: async (id: number, data: Partial<Device>) => {
    const { data: device, error } = await supabase
      .from('devices')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return device as Device;
  },
  
  delete: async (id: number, forceDelete: boolean = false) => {
    if (!forceDelete) {
      const { data: existingServices, error: checkError } = await supabase
        .from('services')
        .select('id')
        .eq('device_id', id)
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (existingServices && existingServices.length > 0) {
        throw new Error('Bu cihazı silemezsiniz çünkü aktif servis kayıtları bulunmaktadır. Önce servis kayıtlarını silin.');
      }
    }

    await supabase
      .from('device_part_prices')
      .delete()
      .eq('device_id', id);

    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },

  deleteWithServices: async (id: number) => {
    const { data: relatedServices } = await supabase
      .from('services')
      .select('id')
      .eq('device_id', id);

    if (relatedServices && relatedServices.length > 0) {
      for (const service of relatedServices) {
        await supabase
          .from('service_messages')
          .delete()
          .eq('service_id', service.id);
      }
      
      await supabase
        .from('services')
        .delete()
        .eq('device_id', id);
    }

    await supabase
      .from('device_part_prices')
      .delete()
      .eq('device_id', id);

    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },
};


export const services = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        customer:customers(*),
        device:devices(*)
      `);
      
    if (error) throw error;
    return data as ServiceWithRelations[];
  },
  
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        customer:customers(*),
        device:devices(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as ServiceWithRelations;
  },
  
  getByPhone: async (phone: string) => {

    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', phone);

    if (customerError) throw customerError;
    if (!customers || customers.length === 0) {
      return [];
    }


    const { data: services, error: servicesError } = await supabase
      .from('services')
      .select(`
        *,
        customer:customers(*),
        device:devices(*)
      `)
      .eq('customer_id', customers[0].id)
      .order('created_at', { ascending: false });

    if (servicesError) throw servicesError;
    return services as ServiceWithRelations[];
  },
  
  create: async (data: {
    customer_id: number;
    device_id: number;
    technician_id: number;
    problem: string;
    status?: string;
  }) => {

    if (!data.customer_id || !data.device_id || !data.technician_id || !data.problem) {
      throw new Error('Müşteri, cihaz, teknisyen ve problem alanları gereklidir');
    }


    const serviceData = {
      customer_id: data.customer_id,
      device_id: data.device_id,
      technician_id: data.technician_id,
      problem: data.problem,
      status: data.status || 'BEKLEMEDE'
    };

    console.log('Final service data being sent to Supabase:', serviceData);

    const { data: service, error } = await supabase
      .from('services')
      .insert([serviceData])
      .select(`
        *,
        customer:customers(*),
        device:devices(*)
      `)
      .single();
      
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    if (!service) throw new Error('Servis kaydı oluşturulamadı');
    return service as Service;
  },
  
  update: async (id: number, data: Partial<Service>) => {
    const { data: service, error } = await supabase
      .from('services')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return service as Service;
  },
  
  delete: async (id: number) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },

  getMessages: async (serviceId: number) => {
    const { data, error } = await supabase
      .from('service_messages')
      .select('*')
      .eq('service_id', serviceId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data as ServiceMessage[];
  },

  sendMessage: async (serviceId: number, message: string, isFromCustomer: boolean = false) => {
    const { data, error } = await supabase
      .from('service_messages')
      .insert([{
        service_id: serviceId,
        message,
        is_from_customer: isFromCustomer,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    return data as ServiceMessage;
  },

  deleteMessage: async (messageId: number) => {
    const { error } = await supabase
      .from('service_messages')
      .delete()
      .eq('id', messageId);

    if (error) throw error;
    return { success: true };
  },


  getParts: async (serviceId: number) => {
    const { data, error } = await supabase
      .from('service_parts')
      .select(`
        *,
        part:device_parts(*)
      `)
      .eq('service_id', serviceId);

    if (error) throw error;
    return data;
  },

  addPart: async (serviceId: number, partId: number, quantity: number = 1) => {

    const { data: existingParts, error: checkError } = await supabase
      .from('service_parts')
      .select('*')
      .eq('service_id', serviceId)
      .eq('part_id', partId);

    if (checkError) throw checkError;

    if (existingParts && existingParts.length > 0) {

      const { data, error } = await supabase
        .from('service_parts')
        .update({
          quantity: existingParts[0].quantity + quantity
        })
        .eq('id', existingParts[0].id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {

      const { data, error } = await supabase
        .from('service_parts')
        .insert([{
          service_id: serviceId,
          part_id: partId,
          quantity
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  },

  removePart: async (serviceId: number, partId: number) => {
    const { error } = await supabase
      .from('service_parts')
      .delete()
      .eq('service_id', serviceId)
      .eq('part_id', partId);

    if (error) throw error;
    return { success: true };
  },

  updatePartQuantity: async (serviceId: number, partId: number, quantity: number) => {
    if (quantity <= 0) {

      return services.removePart(serviceId, partId);
    }

    const { data, error } = await supabase
      .from('service_parts')
      .update({ quantity })
      .eq('service_id', serviceId)
      .eq('part_id', partId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

export const deviceParts = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('*');
      
    if (error) throw error;
    return data as DevicePart[];
  },
  
  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as DevicePart;
  },
  
  create: async (data: Partial<DevicePart>) => {
    const { data: part, error } = await supabase
      .from('device_parts')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();
      
    if (error) throw error;
    return part as DevicePart;
  },
  
  update: async (id: number, data: Partial<DevicePart>) => {
    const { data: part, error } = await supabase
      .from('device_parts')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return part as DevicePart;
  },
  
  delete: async (id: number) => {
    const { error } = await supabase
      .from('device_parts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return { success: true };
  },
  
  getForDevice: async (deviceId: number) => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('*')
      .eq('device_id', deviceId);
      
    if (error) throw error;
    return data as DevicePart[];
  },
  
  getCategoriesForDevice: async (deviceId: number) => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('category')
      .eq('device_id', deviceId)
      .order('category', { ascending: true });
      
    if (error) throw error;
    

    const categories = Array.from(new Set(data.map(part => part.category || '')));
    return categories;
  },

  getPricesForDevice: async (deviceId: number) => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('*')
      .eq('device_id', deviceId);
      
    if (error) throw error;
    

    const groupedPrices = data.reduce((acc: { [key: string]: any[] }, part) => {
      const category = part.category || 'Diğer';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        id: part.id,
        partName: part.name,
        price: part.price
      });
      return acc;
    }, {});

    return groupedPrices;
  }
};

export default supabase; 