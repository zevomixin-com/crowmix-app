import { View, Text, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { supabase } from '../../services/supabase';

export default function AddAddressScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const [label, setLabel] = useState('Home');
  const [flat, setFlat] = useState('');
  const [building, setBuilding] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const handleSaveAddress = async () => {
    if (!flat || !building || !area || !city || !pincode) {
      Alert.alert('Complete Address', 'Please fill all address fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('user_addresses').insert({
        user_id: user?.firebase_uid,
        label,
        flat,
        building,
        area,
        city,
        pincode,
        is_default: isDefault,
      });

      if (error) throw error;

      Alert.alert('Success', 'Address saved successfully');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save address');
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
          Add Address
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }} showsVerticalScrollIndicator={false}>
        {/* Label Selection */}
        <Text style={{ fontSize: 12, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 8 }}>
          Address Label
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          {['Home', 'Work', 'Other'].map((option) => (
            <Pressable
              key={option}
              onPress={() => setLabel(option)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginRight: 8,
                borderRadius: 20,
                backgroundColor: label === option ? '#059494' : '#F9FAFB',
                borderWidth: label === option ? 0 : 1,
                borderColor: '#E5E7EB',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: 'Inter-Bold',
                  color: label === option ? 'white' : '#111827',
                }}
              >
                {option}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Form Fields */}
        {[
          { label: 'Flat/House No.', value: flat, onChange: setFlat, placeholder: '101' },
          { label: 'Building Name', value: building, onChange: setBuilding, placeholder: 'Sunrise Tower' },
          { label: 'Area/Locality', value: area, onChange: setArea, placeholder: 'Koramangala' },
          { label: 'City', value: city, onChange: setCity, placeholder: 'Bangalore' },
          { label: 'Pincode', value: pincode, onChange: setPincode, placeholder: '560034', keyboardType: 'number-pad' },
        ].map((field, index) => (
          <View key={index} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: '#111827', fontFamily: 'Inter-Bold', marginBottom: 6 }}>
              {field.label}
            </Text>
            <TextInput
              value={field.value}
              onChangeText={field.onChange}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType || 'default'}
              style={{
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 6,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 13,
                fontFamily: 'Inter',
                color: '#111827',
              }}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        ))}

        {/* Default Address Toggle */}
        <Pressable
          onPress={() => setIsDefault(!isDefault)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB',
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: isDefault ? '#059494' : '#E5E7EB',
              backgroundColor: isDefault ? '#059494' : 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {isDefault && <Ionicons name="checkmark" size={12} color="white" />}
          </View>
          <Text style={{ fontSize: 12, fontFamily: 'Inter', color: '#111827', marginLeft: 8 }}>
            Set as default address
          </Text>
        </Pressable>
      </ScrollView>

      {/* Save Button */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#E5E7EB' }}>
        <Pressable
          onPress={handleSaveAddress}
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
              Save Address
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
