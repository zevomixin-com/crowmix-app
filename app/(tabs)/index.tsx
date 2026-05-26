import { View, Text, ScrollView, Pressable, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { fetchFoodProducts, fetchGroceryProducts } from '../../services/products';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';

export default function HomeScreen() {
  const router = useRouter();
  const [foodProducts, setFoodProducts] = useState<Product[]>([]);
  const [groceryProducts, setGroceryProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const cartCount = useCartStore((state) => state.getItemCount());
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const [food, grocery] = await Promise.all([
        fetchFoodProducts(),
        fetchGroceryProducts(),
      ]);
      setFoodProducts(food.slice(0, 8));
      setGroceryProducts(grocery.slice(0, 8));
    } catch (error) {
      console.error('Error loading products:', error);
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
        <Text style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter', marginTop: 2 }}>
          {product.weight}
        </Text>
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
    <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="location" size={20} color="#059494" />
          <Text style={{ fontSize: 14, fontFamily: 'Inter-Bold', color: '#111827', marginLeft: 4 }}>
            Your Location
          </Text>
        </View>
        <Ionicons name="notifications" size={20} color="#111827" />
      </View>

      {/* Search Bar */}
      <Pressable
        onPress={() => router.push('/search')}
        style={{
          marginHorizontal: 16,
          marginBottom: 12,
          backgroundColor: '#F9FAFB',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#E5E7EB',
        }}
      >
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <Text style={{ marginLeft: 8, fontSize: 13, color: '#9CA3AF', fontFamily: 'Inter' }}>
          Search for products
        </Text>
      </Pressable>

      {/* Delivery Promise */}
      <View
        style={{
          marginHorizontal: 16,
          marginBottom: 12,
          backgroundColor: '#E6F7F7',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <MaterialCommunityIcons name="lightning-bolt" size={16} color="#059494" />
        <Text style={{ marginLeft: 8, fontSize: 12, color: '#059494', fontFamily: 'Inter-Bold' }}>
          Delivery in 10 minutes
        </Text>
      </View>

      {/* Category Cards */}
      <View style={{ flexDirection: 'row', paddingHorizontal: 16, marginBottom: 20 }}>
        <Pressable
          onPress={() => router.push('/(tabs)/food')}
          style={{
            flex: 1,
            backgroundColor: '#FF6B35',
            borderRadius: 8,
            padding: 16,
            marginRight: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 32 }}>🍛</Text>
          <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: 'white', marginTop: 8 }}>
            Food Dishes
          </Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(tabs)/grocery')}
          style={{
            flex: 1,
            backgroundColor: '#059494',
            borderRadius: 8,
            padding: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 32 }}>🛒</Text>
          <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: 'white', marginTop: 8 }}>
            Grocery
          </Text>
        </Pressable>
      </View>

      {/* Sections */}
      <View style={{ paddingHorizontal: 16 }}>
        {foodProducts.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                Favorite Dishes
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/food')}>
                <Text style={{ fontSize: 12, color: '#059494', fontFamily: 'Inter-Bold' }}>See All</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {foodProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          </View>
        )}

        {groceryProducts.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                Daily Essentials
              </Text>
              <Pressable onPress={() => router.push('/(tabs)/grocery')}>
                <Text style={{ fontSize: 12, color: '#059494', fontFamily: 'Inter-Bold' }}>See All</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {groceryProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
