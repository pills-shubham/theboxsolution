import { supabase } from '@/lib/supabase';
import { Order, OrderItem } from './types';

export const orderService = {
  async listOrders() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*, addresses(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(order => ({
        ...order,
        address: (order as any).addresses
      })) as Order[];
    } catch (err) {
      return [];
    }
  },

  async getOrderDetails(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, addresses(*), order_items(*, products(*), product_dimensions(*))')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    // Transform joined data
    return {
      ...data,
      address: (data as any).addresses,
      order_items: (data as any).order_items.map((item: any) => ({
        ...item,
        product: item.products,
        dimension: item.product_dimensions
      }))
    } as Order & { order_items: OrderItem[] };
  },

  async placeOrder(addressId: string) {
    const { data, error } = await supabase.rpc('place_order', {
      p_address_id: addressId
    });
    
    if (error) throw error;
    return data as string; // Returns the order ID
  }
};
