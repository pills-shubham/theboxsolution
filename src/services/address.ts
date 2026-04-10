import { supabase } from '@/lib/supabase';
import { Address } from './types';

export const addressService = {
  async listAddresses() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as Address[];
    } catch (err) {
      return [];
    }
  },

  async addAddress(address: Omit<Address, 'id' | 'user_id' | 'created_at'>) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('addresses')
      .insert({ ...address, user_id: user.id })
      .select()
      .single();
    
    if (error) throw error;
    return data as Address;
  },

  async deleteAddress(id: string) {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
