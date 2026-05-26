import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchProductById } from '../../services/products';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const data = await fetchProductById(id as string);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      router.push('/(tabs)/cart');
    }
  };

  if (loading || !product) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 14, color: '#9CA3AF', fontFamily: 'Inter' }}>
          Loading...
        </Text>
      </View>
    );
  }

  const price = parseFloat(product.price.replace('₹', ''));
  const subtotal = price * quantity;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Pressable>
          <Ionicons name="heart-outline" size={24} color="#111827" />
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={{ width: '100%', height: 300, backgroundColor: '#F9FAFB', position: 'relative' }}>
          <Image
            source={{ uri: product.image_url }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          />
          {product.discount && (
            <View
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                backgroundColor: '#FF6B35',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
              }}
            >
              <Text style={{ fontSize: 12, color: 'white', fontFamily: 'Poppins-Bold' }}>
                {product.discount}
              </Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          {/* Veg/Non-veg */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                backgroundColor: product.is_veg ? '#22C55E' : '#EF4444',
                marginRight: 6,
              }}
            />
            <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
              {product.is_veg ? 'Vegetarian' : 'Non-Vegetarian'}
            </Text>
          </View>

          {/* Title */}
          <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 8 }}>
            {product.title}
          </Text>

          {/* Rating */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter', marginLeft: 6 }}>
              {product.rating} ({product.rating_count} ratings)
            </Text>
          </View>

          {/* Price */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827' }}>
              {product.price}
            </Text>
            {product.original_price && (
              <Text style={{ fontSize: 14, color: '#9CA3AF', textDecorationLine: 'line-through', marginLeft: 8, fontFamily: 'Inter' }}>
                {product.original_price}
              </Text>
            )}
          </View>

          {/* Delivery Time */}
          <View
            style={{
              marginTop: 12,
              backgroundColor: '#E6F7F7',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 6,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={14} color="#059494" />
            <Text style={{ marginLeft: 8, fontSize: 11, color: '#059494', fontFamily: 'Inter-Bold' }}>
              {product.delivery_time}
            </Text>
          </View>

          {/* Description */}
          <Text style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter', marginTop: 16, lineHeight: 20 }}>
            {product.description}
          </Text>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Quantity Controls */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginBottom: 12,
            justifyContent: 'center',
          }}
        >
          <Pressable onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', color: '#111827' }}>−</Text>
          </Pressable>
          <Text style={{ marginHorizontal: 20, fontSize: 14, fontFamily: 'Poppins-Bold', color: '#111827' }}>
            {quantity}
          </Text>
          <Pressable onPress={() => setQuantity(quantity + 1)}>
            <Text style={{ fontSize: 18, fontFamily: 'Inter-Bold', color: '#111827' }}>+</Text>
          </Pressable>
        </View>

        {/* Add to Cart Button */}
        <Pressable
          onPress={handleAddToCart}
          style={{
            backgroundColor: '#059494',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Inter-Bold' }}>
            Add to Cart
          </Text>
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Bold' }}>
            ₹{Math.round(subtotal)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
