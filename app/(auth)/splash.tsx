import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: '#059494', justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View entering={FadeInDown.duration(800)}>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color: 'white', fontFamily: 'Poppins-Bold' }}>
          Crowmix
        </Text>
      </Animated.View>
      <Animated.View entering={FadeInUp.delay(400).duration(800)}>
        <Text style={{ fontSize: 16, color: 'white', marginTop: 16, fontFamily: 'Inter' }}>
          Delivered in Minutes
        </Text>
      </Animated.View>
    </View>
  );
}
