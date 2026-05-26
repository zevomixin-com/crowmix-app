export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  original_price?: string;
  discount?: string;
  image_url: string;
  weight: string;
  rating: number;
  rating_count: number;
  category_name: string;
  category_id: string;
  service_type: 'food' | 'grocery';
  is_veg: boolean;
  is_active: boolean;
  delivery_time: string;
  unit?: string;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductCarouselProps {
  title: string;
  products: Product[];
  onProductPress: (product: Product) => void;
}
