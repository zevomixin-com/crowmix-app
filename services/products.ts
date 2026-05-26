import { supabase } from './supabase';
import { Product } from '../types/product';

export const fetchFoodProducts = async (category?: string): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('service_type', 'food')
    .eq('is_active', true);

  if (category && category !== 'All') {
    query = query.eq('category_name', category);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching food products:', error);
    return [];
  }

  return data || [];
};

export const fetchGroceryProducts = async (category?: string): Promise<Product[]> => {
  let query = supabase
    .from('products')
    .select('*')
    .eq('service_type', 'grocery')
    .eq('is_active', true);

  if (category && category !== 'All') {
    query = query.eq('category_name', category);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) {
    console.error('Error fetching grocery products:', error);
    return [];
  }

  return data || [];
};

export const fetchProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .eq('is_active', true)
    .limit(20);

  if (error) {
    console.error('Error searching products:', error);
    return [];
  }

  return data || [];
};
