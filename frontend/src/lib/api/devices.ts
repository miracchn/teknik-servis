import { Device, DevicePart } from '@/types';
import { supabase } from '@/lib/supabase';

interface CreateDeviceData {
  type: string;
  brand: string;
  model: string;
  serial_number?: string;
}

export const devices = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        device_parts (
          id,
          name,
          category,
          price
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  },

  getById: async (id: number) => {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        device_parts (
          id,
          name,
          category,
          price
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  create: async (deviceData: CreateDeviceData) => {
    const { data, error } = await supabase
      .from('devices')
      .insert([deviceData])
      .select(`
        *,
        device_parts (
          id,
          name,
          category,
          price
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  update: async (id: number, deviceData: Partial<CreateDeviceData>) => {
    const { data, error } = await supabase
      .from('devices')
      .update(deviceData)
      .eq('id', id)
      .select(`
        *,
        device_parts (
          id,
          name,
          category,
          price
        )
      `)
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('devices')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  },

  addPart: async (deviceId: number, part: Omit<DevicePart, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('device_parts')
      .insert([{
        device_id: deviceId,
        name: part.name,
        category: part.category,
        price: part.price
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  updatePart: async (partId: number, part: Partial<Omit<DevicePart, 'id' | 'created_at' | 'updated_at'>>) => {
    const { data, error } = await supabase
      .from('device_parts')
      .update(part)
      .eq('id', partId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  deletePart: async (partId: number) => {
    const { error } = await supabase
      .from('device_parts')
      .delete()
      .eq('id', partId);

    if (error) {
      throw error;
    }
  },

  getParts: async (deviceId: number) => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }
}; 