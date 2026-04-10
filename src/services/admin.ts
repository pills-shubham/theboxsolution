import { supabase } from '@/lib/supabase';
import { Order, Product, ProductDimension, User, FullProduct } from './types';

export const adminService = {
  // Check if current user is admin
  async checkAdminStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single();
    
    if (error) return false;
    return data.is_admin;
  },

  // Orders Management
  async getAllOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, users(*), addresses(*)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as (Order & { users: User })[];
  },

  async updateOrderStatus(orderId: string, status: string) {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId);
    
    if (error) throw error;
  },

  // Product/Stock Management
  async listAllProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_dimensions(*)');
    
    if (error) throw error;
    return data as (Product & { product_dimensions: ProductDimension[] })[];
  },

  async upsertProduct(product: Partial<FullProduct>) {
    const payload: any = {};
    const fields: (keyof Product)[] = ['title', 'description', 'price', 'discount_percent'];
    
    fields.forEach(field => {
      if (product[field] !== undefined) {
        payload[field] = product[field];
      }
    });

    if (product.id && product.id.trim() !== '') {
      payload.id = product.id;
    }

    const { data, error } = await supabase
      .from('products')
      .upsert(payload)
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  async upsertDimension(dimension: Partial<ProductDimension>) {
    const payload: any = {};
    const fields: (keyof ProductDimension)[] = ['product_id', 'label', 'length', 'width', 'height'];
    
    fields.forEach(field => {
      if (dimension[field] !== undefined) {
        payload[field] = dimension[field];
      }
    });

    if (dimension.id && dimension.id.trim() !== '') {
      payload.id = dimension.id;
    }

    const { data, error } = await supabase
      .from('product_dimensions')
      .upsert(payload)
      .select()
      .single();
    
    if (error) throw error;
    return data as ProductDimension;
  },

  async deleteDimension(id: string) {
    const { error } = await supabase
      .from('product_dimensions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};
