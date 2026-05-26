import { View, Text, Pressable, FlatList, Image } from 'react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';

interface OnboardingSlide {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Fresh Groceries in 10 Minutes',
    subtitle: 'Order essentials and get them delivered instantly',
    icon: '🛒',
  },
  {
    id: '2',
    title: 'Hot Food at Your Doorstep',
    subtitle: 'Your favorite dishes from top restaurants',
    icon: '🍛',
  },
  {
    id: '3',
    title: 'Delivered to You, Instantly',
    subtitle: 'Fast, reliable delivery every single time',
    icon: '🚴',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
        <Pressable onPress={handleSkip}>
          <Text style={{ fontSize: 16, color: '#059494', fontFamily: 'Inter-Bold' }}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
          setActiveIndex(index);
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 60 }}>
            <Text style={{ fontSize: 80 }}>{item.icon}</Text>
            <Text
              style={{
                fontSize: 24,
                fontFamily: 'Poppins-Bold',
                marginTop: 32,
                color: '#111827',
                textAlign: 'center',
                paddingHorizontal: 20,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: '#6B7280',
                marginTop: 12,
                textAlign: 'center',
                paddingHorizontal: 20,
                fontFamily: 'Inter',
              }}
            >
              {item.subtitle}
            </Text>
          </View>
        )}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
      />

      <View style={{ paddingBottom: 40, paddingHorizontal: 20 }}>
        {/* Dots Indicator */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 24 }}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                width: activeIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: activeIndex === index ? '#059494' : '#E5E7EB',
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        <Pressable
          onPress={handleNext}
          style={{
            backgroundColor: '#059494',
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Poppins-Bold' }}>
            {activeIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
