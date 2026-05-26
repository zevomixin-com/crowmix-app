import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../store/userStore';
import { supabase } from '../services/supabase';
import { UserAddress } from '../types/user';

export default function AddressesScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, [])
  );

  const loadAddresses = async () => {
    setLoading(true);
    try {
      if (user?.firebase_uid) {
        const { data, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.firebase_uid)
          .order('is_default', { ascending: false });

        if (!error && data) {
          setAddresses(data);
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (addressId: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await supabase.from('user_addresses').delete().eq('id', addressId);
            loadAddresses();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete address');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      // Reset all addresses to non-default
      await supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', user?.firebase_uid);

      // Set selected address as default
      await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', addressId);

      loadAddresses();
    } catch (error) {
      Alert.alert('Error', 'Failed to set default address');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#111827" />
          </Pressable>
          <Text style={{ fontSize: 20, fontFamily: 'Poppins-Bold', color: '#111827', marginLeft: 12 }}>
            Saved Addresses
          </Text>
        </View>
      </View>

      {/* Addresses List */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }} showsVerticalScrollIndicator={false}>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <View
              key={address.id}
              style={{
                backgroundColor: '#F9FAFB',
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
                borderWidth: address.is_default ? 2 : 0,
                borderColor: address.is_default ? '#059494' : undefined,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827' }}>
                    {address.label}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter', marginTop: 6 }}>
                    {address.flat}, {address.building}
                  </Text>
                  <Text style={{ fontSize: 10, color: '#6B7280', fontFamily: 'Inter' }}>
                    {address.area}, {address.city} - {address.pincode}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {!address.is_default && (
                    <Pressable
                      onPress={() => handleSetDefault(address.id)}
                      style={{ padding: 6 }}
                    >
                      <Ionicons name="checkmark-outline" size={18} color="#059494" />
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => handleDeleteAddress(address.id)}
                    style={{ padding: 6 }}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </Pressable>
                </View>
              </View>
              {address.is_default && (
                <View
                  style={{
                    marginTop: 8,
                    backgroundColor: '#E6F7F7',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                    alignSelf: 'flex-start',
                  }}
                >
                  <Text style={{ fontSize: 9, color: '#059494', fontFamily: 'Inter-Bold' }}>
                    Default
                  </Text>
                </View>
              )}
            </View>
          ))
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 40 }}>📍</Text>
            <Text style={{ fontSize: 14, fontFamily: 'Poppins-Bold', color: '#111827', marginTop: 12 }}>
              No saved addresses
            </Text>
            <Text style={{ fontSize: 11, color: '#6B7280', fontFamily: 'Inter', marginTop: 6 }}>
              Add an address to get started
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add New Address Button */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <Pressable
          onPress={() => router.push('/checkout/address')}
          style={{
            backgroundColor: '#059494',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Ionicons name="add-circle-outline" size={18} color="white" />
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Poppins-Bold' }}>
            Add New Address
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
