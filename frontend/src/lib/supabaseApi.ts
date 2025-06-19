import { supabase } from '@/lib/supabase';
import { DevicePart } from '@/types';


export const deviceParts = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('*');
      
    if (error) throw error;
    
    return data.map((part: any) => ({
      ...part,
      createdAt: part.created_at,
      updatedAt: part.updated_at
    })) as DevicePart[];
  },
  
  create: async (data: { name: string; category: string; device_id: number; price: number }) => {
    const { data: part, error } = await supabase
      .from('device_parts')
      .insert([data])
      .select()
      .single();
      
    if (error) throw error;
    
    return {
      ...part,
      createdAt: part.created_at,
      updatedAt: part.updated_at
    } as DevicePart;
  },
  
  update: async (id: number, data: { name?: string; category?: string; price?: number }) => {
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
    
    return {
      ...part,
      createdAt: part.created_at,
      updatedAt: part.updated_at
    } as DevicePart;
  },
  
  delete: async (id: number) => {
    const { error } = await supabase
      .from('device_parts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    return { success: true };
  },
  
  getPricesForDevice: async (deviceId: number) => {
    const { data, error } = await supabase
      .from('device_parts')
      .select('*')
      .eq('device_id', deviceId);
      
    if (error) throw error;
    
    const groupedPrices = data.reduce((acc: { [key: string]: any[] }, part: any) => {
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