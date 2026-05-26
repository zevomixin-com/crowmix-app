import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { useCartStore } from '../../store/cartStore';
import { supabase } from '../../services/supabase';
import { UserAddress } from '../../types/user';
import * as WebBrowser from 'expo-web-browser';
import { createOrder } from '../../services/orders';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useUserStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [selectedPayment, setSelectedPayment] = useState<'phonepe' | 'upi' | 'cod'>('phonepe');
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<UserAddress | null>(null);

  useEffect(() => {
    loadAddress();
  }, []);

  const loadAddress = async () => {
    try {
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('id', params.addressId as string)
        .maybeSingle();

      if (!error && data) {
        setAddress(data);
      }
    } catch (error) {
      console.error('Error loading address:', error);
    }
  };

  const total = getTotal();
  const deliveryFee = total > 199 ? 0 : 40;
  const handlingFee = 8;
  const grandTotal = total + deliveryFee + handlingFee;

  const handlePayment = async () => {
    if (!user || !address) {
      Alert.alert('Error', 'Missing user or address information');
      return;
    }

    setLoading(true);

    try {
      const cartItems = items.map((item) => ({
        product_id: item.product.id,
        title: item.product.title,
        quantity: item.quantity,
        price: parseFloat(item.product.price.replace('₹', '')),
      }));

      // Create order
      const order = await createOrder(
        user.firebase_uid,
        cartItems,
        grandTotal,
        selectedPayment,
        {
          label: address.label,
          flat: address.flat,
          building: address.building,
          area: address.area,
          city: address.city,
          pincode: address.pincode,
        }
      );

      if (!order) {
        throw new Error('Failed to create order');
      }

      clearCart();

      // For demo purposes, navigate to success directly
      // In production, integrate PhonePe/UPI/COD payment gateway
      if (selectedPayment === 'cod') {
        router.push({
          pathname: '/checkout/success',
          params: { orderId: order.id },
        });
      } else {
        // For PhonePe and UPI, show a demo success screen after 2 seconds
        setTimeout(() => {
          router.push({
            pathname: '/checkout/success',
            params: { orderId: order.id },
          });
        }, 2000);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827', marginLeft: 12 }}>
          Payment
        </Text>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 8 }}>
              Order Summary
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
                Items: ₹{Math.round(total)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
                Delivery: {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </Text>
            </View>
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: '#E5E7EB',
                paddingTop: 8,
                marginTop: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                Total: ₹{Math.round(grandTotal)}
              </Text>
            </View>
          </View>

          {/* Delivery Address */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 8 }}>
              Delivery Address
            </Text>
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 8, padding: 12 }}>
              <Text style={{ fontSize: 11, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                {address?.label}
              </Text>
              <Text style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter', marginTop: 4 }}>
                {address?.flat}, {address?.building}
              </Text>
              <Text style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter' }}>
                {address?.area}, {address?.city} - {address?.pincode}
              </Text>
            </View>
          </View>

          {/* Payment Methods */}
          <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 8 }}>
            Payment Method
          </Text>

          {/* PhonePe */}
          <Pressable
            onPress={() => setSelectedPayment('phonepe')}
            style={{
              borderWidth: selectedPayment === 'phonepe' ? 2 : 1,
              borderColor: selectedPayment === 'phonepe' ? '#059494' : '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: selectedPayment === 'phonepe' ? '#E6F7F7' : '#FFFFFF',
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedPayment === 'phonepe' ? '#059494' : '#E5E7EB',
                backgroundColor: selectedPayment === 'phonepe' ? '#059494' : 'white',
              }}
            />
            <Text style={{ marginLeft: 12, fontSize: 13, fontFamily: 'Poppins-Bold', color: '#111827' }}>
              PhonePe
            </Text>
            <MaterialCommunityIcons name="phone-outline" size={18} color="#FF6B35" style={{ marginLeft: 'auto' }} />
          </Pressable>

          {/* UPI */}
          <Pressable
            onPress={() => setSelectedPayment('upi')}
            style={{
              borderWidth: selectedPayment === 'upi' ? 2 : 1,
              borderColor: selectedPayment === 'upi' ? '#059494' : '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: selectedPayment === 'upi' ? '#E6F7F7' : '#FFFFFF',
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedPayment === 'upi' ? '#059494' : '#E5E7EB',
                backgroundColor: selectedPayment === 'upi' ? '#059494' : 'white',
              }}
            />
            <Text style={{ marginLeft: 12, fontSize: 13, fontFamily: 'Poppins-Bold', color: '#111827' }}>
              UPI / Other Apps
            </Text>
          </Pressable>

          {/* Cash on Delivery */}
          <Pressable
            onPress={() => setSelectedPayment('cod')}
            style={{
              borderWidth: selectedPayment === 'cod' ? 2 : 1,
              borderColor: selectedPayment === 'cod' ? '#059494' : '#E5E7EB',
              borderRadius: 8,
              padding: 12,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: selectedPayment === 'cod' ? '#E6F7F7' : '#FFFFFF',
            }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: selectedPayment === 'cod' ? '#059494' : '#E5E7EB',
                backgroundColor: selectedPayment === 'cod' ? '#059494' : 'white',
              }}
            />
            <Text style={{ marginLeft: 12, fontSize: 13, fontFamily: 'Poppins-Bold', color: '#111827' }}>
              Cash on Delivery
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Pay Button */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <Pressable
          onPress={handlePayment}
          disabled={loading}
          style={{
            backgroundColor: '#059494',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Bold' }}>
              Pay ₹{Math.round(grandTotal)}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
