import { View, Text, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/userStore';
import { fetchOrders } from '../services/orders';
import { Order } from '../types/order';

export default function OrdersScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      if (user?.firebase_uid) {
        const data = await fetchOrders(user.firebase_uid);
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return '#3B82F6';
      case 'preparing':
        return '#F59E0B';
      case 'out_for_delivery':
        return '#8B5CF6';
      case 'delivered':
        return '#22C55E';
      default:
        return '#6B7280';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'placed':
        return 'Placed';
      case 'preparing':
        return 'Preparing';
      case 'out_for_delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const isActiveOrder = (status: Order['status']) => {
    return status !== 'delivered';
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'active') {
      return isActiveOrder(order.status);
    } else {
      return !isActiveOrder(order.status);
    }
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#111827" />
        </Pressable>
        <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827', marginLeft: 12 }}>
          My Orders
        </Text>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
        <Pressable
          onPress={() => setActiveTab('active')}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'active' ? 2 : 0,
            borderBottomColor: '#059494',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Inter-Bold',
              color: activeTab === 'active' ? '#059494' : '#9CA3AF',
            }}
          >
            Active
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setActiveTab('past')}
          style={{
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderBottomWidth: activeTab === 'past' ? 2 : 0,
            borderBottomColor: '#059494',
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Inter-Bold',
              color: activeTab === 'past' ? '#059494' : '#9CA3AF',
            }}
          >
            Past
          </Text>
        </Pressable>
      </View>

      {/* Orders List */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }} showsVerticalScrollIndicator={false}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <Pressable
              key={order.id}
              onPress={() => {}}
              style={{
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
                    Order #{order.id.slice(0, 8)}
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Inter-Bold', color: '#111827', marginTop: 4 }}>
                    {new Date(order.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: getStatusColor(order.status),
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 4,
                  }}
                >
                  <Text style={{ fontSize: 10, color: 'white', fontFamily: 'Inter-Bold' }}>
                    {getStatusLabel(order.status)}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: '#E5E7EB',
                  paddingTopWidth: 1,
                  paddingTop: 8,
                }}
              >
                <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
                  {order.items.length} items
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                  <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter' }}>
                    Total Amount
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                    ₹{Math.round(order.total_amount)}
                  </Text>
                </View>
              </View>

              {!isActiveOrder(order.status) && (
                <Pressable
                  style={{
                    marginTop: 12,
                    paddingVertical: 8,
                    backgroundColor: '#E6F7F7',
                    borderRadius: 6,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 11, fontFamily: 'Inter-Bold', color: '#059494' }}>
                    Reorder
                  </Text>
                </Pressable>
              )}
            </Pressable>
          ))
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 40 }}>📋</Text>
            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 12 }}>
              No orders yet
            </Text>
            <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter', marginTop: 6 }}>
              Start shopping to place your first order
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
