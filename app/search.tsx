import { View, Text, TextInput, ScrollView, Pressable, Image, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { searchProducts } from '../services/products';
import { Product } from '../types/product';
import { useCartStore } from '../store/cartStore';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['Biryani', 'Milk', 'Pizza', 'Eggs']);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    if (searchQuery.length > 2) {
      const debounceTimer = setTimeout(async () => {
        setLoading(true);
        try {
          const data = await searchProducts(searchQuery);
          setResults(data);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  const ProductCard = ({ product }: { product: Product }) => (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={{
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
      }}
    >
      <Image
        source={{ uri: product.image_url }}
        style={{
          width: 60,
          height: 60,
          borderRadius: 8,
          marginRight: 12,
          backgroundColor: '#F9FAFB',
        }}
        resizeMode="cover"
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827' }}>
          {product.title}
        </Text>
        <Text style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter', marginTop: 4 }}>
          {product.weight}
        </Text>
        <Text style={{ fontSize: 11, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 4 }}>
          {product.price}
        </Text>
      </View>
      <Pressable
        onPress={() => addToCart(product)}
        style={{
          backgroundColor: '#059494',
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 6,
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white', fontSize: 11, fontFamily: 'Inter-Bold' }}>
          Add
        </Text>
      </Pressable>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header with Back Button */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB' }}>
          <Ionicons name="search" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Search for products"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 13,
              paddingVertical: 10,
              fontFamily: 'Inter',
              color: '#111827',
            }}
            placeholderTextColor="#9CA3AF"
            autoFocus
          />
          {searchQuery !== '' && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={18} color="#9CA3AF" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Search Results or Recent Searches */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {results.length > 0 ? (
          <>
            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#6B7280', marginTop: 12, marginBottom: 8 }}>
              Results for "{searchQuery}"
            </Text>
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </>
        ) : searchQuery === '' ? (
          <>
            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 16, marginBottom: 12 }}>
              Recent Searches
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {recentSearches.map((search, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSearchQuery(search)}
                  style={{
                    backgroundColor: '#F9FAFB',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                  }}
                >
                  <Text style={{ fontSize: 12, color: '#111827', fontFamily: 'Inter' }}>
                    {search}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
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
