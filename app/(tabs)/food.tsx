import { View, Text, ScrollView, Pressable, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchFoodProducts } from '../../services/products';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';

const FOOD_CATEGORIES = [
  'All',
  'Biryani',
  'Thali',
  'Pizza',
  'Burgers',
  'South Indian',
  'Chinese',
  'North Indian',
  'Desserts',
  'Beverages',
];

export default function FoodScreen() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((p) => p.category_name === selectedCategory)
      );
    }
  }, [selectedCategory, products]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchFoodProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading food products:', error);
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ product }: { product: Product }) => (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={{
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E5E7EB',
      }}
    >
      <View style={{ backgroundColor: '#F9FAFB', height: 140, position: 'relative' }}>
        {product.image_url && (
          <Image
            source={{ uri: product.image_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
        )}
        {product.discount && (
          <View style={{
            position: 'absolute',
            top: 8,
            left: 8,
            backgroundColor: '#FF6B35',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 4,
          }}>
            <Text style={{ fontSize: 10, color: 'white', fontFamily: 'Inter-Bold' }}>
              {product.discount}
            </Text>
          </View>
        )}
        <View style={{
          position: 'absolute',
          bottom: 8,
          left: 8,
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 4,
        }}>
          <Text style={{ fontSize: 10, color: 'white', fontFamily: 'Inter-Bold' }}>
            {product.delivery_time}
          </Text>
        </View>
      </View>
      <View style={{ padding: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: product.is_veg ? '#22C55E' : '#EF4444',
              marginRight: 4,
            }}
          />
          <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
            {product.is_veg ? 'Veg' : 'Non-veg'}
          </Text>
        </View>
        <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 4, lineHeight: 16 }} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Ionicons name="star" size={12} color="#F59E0B" />
          <Text style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter', marginLeft: 4 }}>
            {product.rating} ({product.rating_count})
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <Text style={{ fontSize: 13, fontFamily: 'Poppins-Bold', color: '#111827' }}>
            {product.price}
          </Text>
          {product.original_price && (
            <Text style={{ fontSize: 10, color: '#9CA3AF', textDecorationLine: 'line-through', marginLeft: 4, fontFamily: 'Inter' }}>
              {product.original_price}
            </Text>
          )}
        </View>
        <Pressable
          onPress={() => addToCart(product)}
          style={{
            marginTop: 8,
            backgroundColor: '#059494',
            paddingVertical: 6,
            borderRadius: 6,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Inter-Bold' }}>
            + Add
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827' }}>
          Food Dishes
        </Text>
        <Pressable onPress={() => router.push('/search')}>
          <Ionicons name="search" size={20} color="#111827" />
        </Pressable>
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingHorizontal: 16, marginBottom: 12 }}
        scrollEventThrottle={16}
      >
        {FOOD_CATEGORIES.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginRight: 8,
              borderRadius: 20,
              backgroundColor: selectedCategory === category ? '#059494' : '#F9FAFB',
              borderWidth: selectedCategory === category ? 0 : 1,
              borderColor: '#E5E7EB',
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: 'Inter-Bold',
                color: selectedCategory === category ? 'white' : '#111827',
              }}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Products Grid */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
        {filteredProducts.length === 0 && !loading && (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 16, color: '#9CA3AF', fontFamily: 'Inter' }}>
              No products found
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
