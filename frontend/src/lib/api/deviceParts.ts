import { DevicePart } from '@/types';
import { supabase } from '@/lib/supabase';

interface CreateDevicePartData {
  device_id: number;
  name: string;
  category: string;
  price: number;
}

interface GroupedPrices {
  [category: string]: {
    id: number;
    partName: string;
    price: number;
  }[];
}

export const deviceParts = {
  create: async (data: CreateDevicePartData) => {
    const { data: part, error } = await supabase
      .from('device_parts')
      .insert([data])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return part;
  },

  getPricesForDevice: async (deviceId: number): Promise<GroupedPrices> => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('*')
      .eq('device_id', deviceId);

    if (error) {
      throw error;
    }

    const grouped = (data || []).reduce<GroupedPrices>((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }

      acc[category].push({
        id: item.id,
        partName: item.name,
        price: item.price
      });

      return acc;
    }, {});

    return grouped;
  },

  updatePrice: async (partId: number, newPrice: number) => {
    const { data, error } = await supabase
      .from('device_parts')
      .update({ price: newPrice })
      .eq('id', partId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  deletePrice: async (partId: number) => {
    const { error } = await supabase
      .from('device_parts')
      .delete()
      .eq('id', partId);

    if (error) {
      throw error;
    }
  }
}; 