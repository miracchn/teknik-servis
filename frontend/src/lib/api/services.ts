import { supabase } from '@/lib/supabase';
import { Service } from '@/types';

const transformService = (data: any): Service => {
  return {
    id: data.id,
    customer: {
      id: data.customer.id,
      name: data.customer.name,
      phone: data.customer.phone,
      email: data.customer.email,
      address: data.customer.address,
      created_at: data.customer.created_at,
      updated_at: data.customer.updated_at,
    },
    device: {
      id: data.device.id,
      customer_id: data.device.customer_id,
      brand: data.device.brand,
      model: data.device.model,
      type: data.device.type,
      serial_number: data.device.serial_number,
      created_at: data.device.created_at,
      updated_at: data.device.updated_at,
    },
    technician: data.technician ? {
      id: data.technician.id,
      name: data.technician.name,
      email: data.technician.email,
      role: data.technician.role,
      created_at: data.technician.created_at,
      updated_at: data.technician.updated_at,
    } : undefined,
    problem: data.problem,
    diagnosis: data.diagnosis,
    solution: data.solution,
    status: data.status,
    created_at: data.created_at,
    updated_at: data.updated_at,
    customer_id: data.customer_id,
    device_id: data.device_id,
    technician_id: data.technician_id,
    messages: data.messages,
  };
};

export const services = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        technician:users(id, name, email),
        messages:service_messages(*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(transformService);
  },

  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        technician:users(id, name, email),
        messages:service_messages(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return transformService(data);
  },

  create: async (data: { customerId: number; deviceId: number; problem: string }) => {
    const { data: service, error } = await supabase
      .from('services')
      .insert([{
        customer_id: data.customerId,
        device_id: data.deviceId,
        problem: data.problem,
        status: 'BEKLEMEDE'
      }])
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        technician:users(id, name, email)
      `)
      .single();

    if (error) throw error;
    return transformService(service);
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Servis kaydı başarıyla silindi.' };
  },

  updateStatus: async (id: number, data: { status: string }) => {
    const { data: service, error } = await supabase
      .from('services')
      .update({ status: data.status })
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        technician:users(id, name, email)
      `)
      .single();

    if (error) throw error;
    return service;
  },

  sendMessage: async (serviceId: number, data: { message: string, isFromCustomer: boolean }) => {
    try {
      const { error, data: insertedMessage } = await supabase
        .from('service_messages')
        .insert({
          service_id: serviceId,
          message: data.message,
          is_from_customer: data.isFromCustomer,
          created_at: new Date().toISOString()
        })
        .select('*')
        .single();

      if (error) throw error;
      
      return insertedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  update: async (id: number, data: Partial<Service>) => {
    const { data: service, error } = await supabase
      .from('services')
      .update(data)
      .eq('id', id)
      .select(`
        *,
        customer:customers(*),
        device:devices(*),
        technician:users(id, name, email)
      `)
      .single();

    if (error) throw error;
    return transformService(service);
  },
};