export interface Order {
  id: string;
  user_id: string;
  items: CartItemData[];
  total_amount: number;
  payment_method: string;
  status: 'placed' | 'preparing' | 'out_for_delivery' | 'delivered';
  address: AddressData;
  created_at: string;
  delivery_time?: string;
}

export interface CartItemData {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
}

export interface AddressData {
  label: string;
  flat: string;
  building: string;
  area: string;
  city: string;
  pincode: string;
}
