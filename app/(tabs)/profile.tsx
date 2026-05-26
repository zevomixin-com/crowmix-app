import { View, Text, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../store/userStore';
import { useCartStore } from '../../store/cartStore';
import { getAuth, signOut } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const { clearCart } = useCartStore();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          try {
            const auth = getAuth();
            await signOut(auth);
            await AsyncStorage.clear();
            logout();
            clearCart();
            router.replace('/(auth)/login');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  const MenuItemButton = ({
    icon,
    label,
    onPress,
    color = '#111827',
  }: {
    icon: string;
    label: string;
    onPress: () => void;
    color?: string;
  }) => (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
      }}
    >
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={{ marginLeft: 12, fontSize: 14, fontFamily: 'Inter', color: color, flex: 1 }}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
    </Pressable>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#FFFFFF' }} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#059494',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 24, color: 'white', fontFamily: 'Poppins-Bold' }}>
              {user?.name ? user.name.charAt(0) : user?.phone?.charAt(9)}
            </Text>
          </View>
          <View style={{ marginLeft: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Bold', color: '#111827' }}>
              {user?.name || 'User'}
            </Text>
            <Text style={{ fontSize: 12, color: '#6B7280', fontFamily: 'Inter', marginTop: 4 }}>
              +91 {user?.phone}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View style={{ marginTop: 8 }}>
        <MenuItemButton
          icon="list"
          label="My Orders"
          onPress={() => router.push('/orders')}
        />
        <MenuItemButton
          icon="location"
          label="Saved Addresses"
          onPress={() => router.push('/addresses')}
        />
        <MenuItemButton
          icon="notifications"
          label="Notifications"
          onPress={() => {}}
        />
        <MenuItemButton
          icon="help-circle"
          label="Help & Support"
          onPress={() => {}}
        />
        <MenuItemButton
          icon="information"
          label="App Version 1.0.0"
          onPress={() => {}}
        />
      </View>

      {/* Logout Button */}
      <View style={{ marginTop: 20, paddingHorizontal: 16, marginBottom: 40 }}>
        <Pressable
          onPress={handleLogout}
          style={{
            backgroundColor: '#FEE2E2',
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#EF4444', fontSize: 14, fontFamily: 'Poppins-Bold' }}>
            Logout
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
