import { supabase } from '@/lib/supabase';
import { CartItem } from './types';

export const cartService = {
  async getCart() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('cart_items')
        .select('*, products(*), product_dimensions(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return (data || []).map(item => ({
        ...item,
        product: (item as any).products,
        dimension: (item as any).product_dimensions
      })) as CartItem[];
    } catch (err) {
      console.warn("Cart fetch failed (likely unauthenticated):", err);
      return [];
    }
  },

  async addToCart(productId: string, dimensionId: string, quantity: number) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        dimension_id: dimensionId,
        quantity
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as CartItem;
  },

  async updateQuantity(cartItemId: string, quantity: number) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select()
      .single();
    
    if (error) throw error;
    return data as CartItem;
  },

  async removeFromCart(cartItemId: string) {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);
    
    if (error) throw error;
  }
};
