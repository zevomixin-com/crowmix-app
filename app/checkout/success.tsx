import { View, Text, Pressable } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, BounceIn } from 'react-native-reanimated';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams();

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16 }}>
      <Animated.View entering={BounceIn.springify().damping(10)} style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#E6F7F7',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          <Ionicons name="checkmark-done" size={40} color="#059494" />
        </View>

        <Text style={{ fontSize: 24, fontFamily: 'Poppins-Bold', color: '#111827', textAlign: 'center' }}>
          Order Placed!
        </Text>

        <Text style={{ fontSize: 13, color: '#6B7280', fontFamily: 'Inter', textAlign: 'center', marginTop: 8 }}>
          Your order has been confirmed
        </Text>

        <View
          style={{
            backgroundColor: '#F9FAFB',
            borderRadius: 8,
            padding: 16,
            marginTop: 24,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>Order ID</Text>
          <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 4 }}>
            #{orderId?.toString().slice(0, 8).toUpperCase()}
          </Text>

          <View
            style={{
              marginTop: 12,
              paddingTopWidth: 1,
              paddingTop: 12,
              borderTopWidth: 1,
              borderTopColor: '#E5E7EB',
              width: '100%',
              alignItems: 'center',
            }}
          >
            <Ionicons name="time-outline" size={16} color="#059494" />
            <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter', marginTop: 6 }}>
              Estimated delivery in
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#059494', marginTop: 2 }}>
              20-30 minutes
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginTop: 32, gap: 8 }}>
          <Pressable
            onPress={() => router.push('/orders')}
            style={{
              flex: 1,
              backgroundColor: '#059494',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 12, fontFamily: 'Poppins-Bold' }}>
              Track Order
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/(tabs)')}
            style={{
              flex: 1,
              backgroundColor: '#E6F7F7',
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#059494', fontSize: 12, fontFamily: 'Poppins-Bold' }}>
              Continue Shopping
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}
