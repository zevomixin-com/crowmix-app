import { supabase } from './supabase';
import { Order, AddressData, CartItemData } from '../types/order';

export const createOrder = async (
  userId: string,
  items: CartItemData[],
  totalAmount: number,
  paymentMethod: string,
  address: AddressData
): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      items,
      total_amount: totalAmount,
      payment_method: paymentMethod,
      address,
      status: 'placed',
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating order:', error);
    return null;
  }

  return data;
};

export const fetchOrders = async (userId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
};

export const fetchOrderById = async (orderId: string): Promise<Order | null> => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: Order['status']
): Promise<boolean> => {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order:', error);
    return false;
  }

  return true;
};
