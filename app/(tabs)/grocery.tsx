import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchGroceryProducts } from '../../services/products';
import { Product } from '../../types/product';
import { useCartStore } from '../../store/cartStore';

const GROCERY_CATEGORIES = [
  'All',
  'Fruits & Veg',
  'Dairy & Eggs',
  'Snacks',
  'Beverages',
  'Bakery',
  'Staples',
  'Frozen',
  'Personal Care',
  'Household',
];

export default function GroceryScreen() {
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
      const data = await fetchGroceryProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading grocery products:', error);
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
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827' }}>
          Grocery
        </Text>
        <Pressable onPress={() => router.push('/search')}>
          <Ionicons name="search" size={20} color="#111827" />
        </Pressable>
      </View>

      <View style={{ flex: 1, flexDirection: 'row' }}>
        {/* Sidebar Categories */}
        <ScrollView
          style={{ width: 80, backgroundColor: '#F9FAFB', borderRightWidth: 1, borderRightColor: '#E5E7EB' }}
          showsVerticalScrollIndicator={false}
        >
          {GROCERY_CATEGORIES.map((category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 8,
                alignItems: 'center',
                borderLeftWidth: 3,
                borderLeftColor: selectedCategory === category ? '#059494' : 'transparent',
                backgroundColor: selectedCategory === category ? '#E6F7F7' : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 9,
                  fontFamily: 'Inter-Bold',
                  color: selectedCategory === category ? '#059494' : '#6B7280',
                  textAlign: 'center',
                }}
                numberOfLines={2}
              >
                {category}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Products Grid */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 12 }}
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
    </View>
  );
}
