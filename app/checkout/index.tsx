import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../services/supabase';
import { UserAddress } from '../../types/user';

export default function CheckoutScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { items, getTotal } = useCartStore();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      if (user?.firebase_uid) {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.firebase_uid);

        if (!error && data) {
          setAddresses(data);
          const defaultAddress = data.find((addr) => addr.is_default);
          setSelectedAddress(defaultAddress || data[0] || null);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!selectedAddress) {
      Alert.alert('Select Address', 'Please select or add a delivery address');
      return;
    }

    router.push({
      pathname: '/checkout/payment',
      params: {
        addressId: selectedAddress.id,
      },
    });
  };

  const total = getTotal();
  const deliveryFee = total > 199 ? 0 : 40;
  const handlingFee = 8;
  const grandTotal = total + deliveryFee + handlingFee;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827', marginLeft: 12 }}>
          Checkout
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 8 }}>
              Order Summary
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
                {items.length} items
              </Text>
              <Text style={{ fontSize: 11, fontFamily: 'Inter-Bold', color: '#111827' }}>
                ₹{Math.round(total)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
                Delivery fee
              </Text>
              <Text style={{ fontSize: 11, fontFamily: 'Inter-Bold', color: '#111827' }}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
                Handling fee
              </Text>
              <Text style={{ fontSize: 11, fontFamily: 'Inter-Bold', color: '#111827' }}>
                ₹{handlingFee}
              </Text>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                paddingTop: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                Total
              </Text>
              <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#059494' }}>
                ₹{Math.round(grandTotal)}
              </Text>
            </View>
          </View>

          {/* Delivery Address */}
          <Text style={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 12 }}>
            Delivery Address
          </Text>

          {addresses.length > 0 ? (
            <>
              {addresses.map((address) => (
                <Pressable
                  key={address.id}
                  onPress={() => setSelectedAddress(address)}
                  style={{
                    borderWidth: selectedAddress?.id === address.id ? 2 : 1,
                    borderColor: selectedAddress?.id === address.id ? '#059494' : '#E5E7EB',
                    borderRadius: 8,
                    padding: 12,
                    marginBottom: 12,
                    backgroundColor: selectedAddress?.id === address.id ? '#E6F7F7' : '#FFFFFF',
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                      {address.label}
                    </Text>
                    {address.is_default && (
                      <View
                        style={{
                          backgroundColor: '#059494',
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 4,
                        }}
                      >
                        <Text style={{ fontSize: 9, color: 'white', fontFamily: 'Inter-Bold' }}>
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter', marginTop: 6 }}>
                    {address.flat}, {address.building}, {address.area}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter', marginTop: 2 }}>
                    {address.city} - {address.pincode}
                  </Text>
                </Pressable>
              ))}
            </>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <Text style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'Inter' }}>
                No addresses saved
              </Text>
            </View>
          )}

          <Pressable
            onPress={() => router.push('/checkout/address')}
            style={{
              borderWidth: 2,
              borderColor: '#059494',
              borderStyle: 'dashed',
              borderRadius: 8,
              padding: 12,
              alignItems: 'center',
            }}
          >
            <Ionicons name="add-circle-outline" size={20} color="#059494" />
            <Text style={{ fontSize: 12, fontFamily: 'Inter-Bold', color: '#059494', marginTop: 4 }}>
              Add New Address
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <Pressable
          onPress={handleContinue}
          style={{
            backgroundColor: '#059494',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Bold' }}>
            Continue to Payment
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
