import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useUserStore } from '../store/userStore';
import { Text, View } from 'react-native';

export default function RootRedirect() {
  const router = useRouter();
  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/splash');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isLoggedIn, router]);

  return (
    <View style={{ flex: 1, backgroundColor: '#059494' }}>
      <Text />
    </View>
  );
}
