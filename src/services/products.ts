import { supabase } from '@/lib/supabase';
import { Product, ProductDimension } from './types';

export const productService = {
  async listProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Product[];
  },

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, product_dimensions(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data as Product & { product_dimensions: ProductDimension[] };
  },

  async createProduct(product: Partial<Product>) {
    const { title, description, price, discount_percent } = product;
    const payload = {
      title,
      description,
      price,
      discount_percent: discount_percent ?? 0
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select()
      .single();
    
    if (error) throw error;
    return data as Product;
  },

  async addDimension(product_id: string, dimension: Partial<ProductDimension>) {
    const { data, error } = await supabase
      .from('product_dimensions')
      .insert({ ...dimension, product_id })
      .select()
      .single();
    
    if (error) throw error;
    return data as ProductDimension;
  }
};
