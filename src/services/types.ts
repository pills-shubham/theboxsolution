export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_percent: number;
  created_at: string;
}

export interface ProductDimension {
  id: string;
  product_id: string;
  label: string;
  length: number;
  width: number;
  height: number;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  dimension_id: string;
  quantity: number;
  created_at: string;
  // Joined fields
  product?: Product;
  dimension?: ProductDimension;
}

export interface Order {
  id: string;
  user_id: string;
  address_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  created_at: string;
  // Joined fields
  address?: Address;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  dimension_id: string;
  quantity: number;
  price_at_time: number;
  discount_at_time: number;
  // Joined fields
  product?: Product;
  dimension?: ProductDimension;
}
