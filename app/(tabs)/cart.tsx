import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCartStore } from '../../store/cartStore';

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();
  const deliveryFee = total > 199 ? 0 : 40;
  const handlingFee = 8;
  const grandTotal = total + deliveryFee + handlingFee;

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }
    router.push('/checkout');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 }}>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827' }}>
          My Cart
        </Text>
        <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter', marginTop: 4 }}>
          {items.length} items
        </Text>
      </View>

      {/* Delivery Promise */}
      {items.length > 0 && (
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
          <MaterialCommunityIcons name="lightning-bolt" size={14} color="#059494" />
          <Text style={{ marginLeft: 8, fontSize: 11, color: '#059494', fontFamily: 'Inter-Bold' }}>
            Delivery in 20-30 minutes
          </Text>
        </View>
      )}

      {items.length > 0 ? (
        <>
          {/* Cart Items */}
          <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
            {items.map((item) => (
              <View
                key={item.product.id}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#E5E7EB',
                }}
              >
                <Image
                  source={{ uri: item.product.image_url }}
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
                    {item.product.title}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Inter', marginTop: 4 }}>
                    {item.product.weight}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                      {item.product.price}
                    </Text>
                    <View
                      style={{
                        marginLeft: 'auto',
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F9FAFB',
                        borderRadius: 4,
                        paddingHorizontal: 6,
                        paddingVertical: 4,
                      }}
                    >
                      <Pressable onPress={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Text style={{ fontSize: 14, fontFamily: 'Inter-Bold', color: '#111827' }}>
                          −
                        </Text>
                      </Pressable>
                      <Text
                        style={{
                          marginHorizontal: 8,
                          fontSize: 12,
                          fontFamily: 'Inter-Bold',
                          color: '#111827',
                        }}
                      >
                        {item.quantity}
                      </Text>
                      <Pressable onPress={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Text style={{ fontSize: 14, fontFamily: 'Inter-Bold', color: '#111827' }}>
                          +
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                <Pressable
                  onPress={() => removeFromCart(item.product.id)}
                  style={{ marginLeft: 12 }}
                >
                  <Ionicons name="trash" size={18} color="#EF4444" />
                </Pressable>
              </View>
            ))}
          </ScrollView>

          {/* Bill Summary */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
            <View
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter' }}>
                  Items total
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'Inter-Bold', color: '#111827' }}>
                  ₹{Math.round(total)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter' }}>
                  Delivery fee
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'Inter-Bold', color: '#111827' }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTopWidth: 1, paddingTop: 8, borderTopColor: '#E5E7EB', borderTopWidth: 1 }}>
                <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter' }}>
                  Handling fee
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'Inter-Bold', color: '#111827' }}>
                  ₹{handlingFee}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 8,
                  paddingTop: 8,
                  borderTopWidth: 1,
                  borderTopColor: '#E5E7EB',
                }}
              >
                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                  Grand Total
                </Text>
                <Text style={{ fontSize: 13, fontFamily: 'Poppins-Bold', color: '#059494' }}>
                  ₹{Math.round(grandTotal)}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleCheckout}
              style={{
                backgroundColor: '#059494',
                paddingVertical: 14,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Bold' }}>
                Proceed to Checkout
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>🛒</Text>
          <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 12 }}>
            Your cart is empty
          </Text>
          <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter', marginTop: 8 }}>
            Add some items to get started
          </Text>
          <Pressable
            onPress={() => router.push('/(tabs)/food')}
            style={{
              marginTop: 24,
              backgroundColor: '#059494',
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Inter-Bold' }}>
              Start Shopping
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
