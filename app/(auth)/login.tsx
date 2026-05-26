import { View, Text, Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import auth, { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { useUserStore } from '../../store/userStore';

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const setFirebaseUid = useUserStore((state) => state.setFirebaseUid);

  const handleSendOTP = async () => {
    if (!phone || phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (Platform.OS !== 'web') {
        const authInstance = getAuth();
        const phoneNumber = `+91${phone}`;

        // For React Native Firebase, we don't need RecaptchaVerifier
        const confirmationResult = await signInWithPhoneNumber(authInstance, phoneNumber);

        // Save confirmation result for OTP verification
        setFirebaseUid(confirmationResult.verificationId || '');

        router.push({
          pathname: '/(auth)/otp',
          params: { phone, verificationId: confirmationResult.verificationId || '' },
        });
      } else {
        // For web, navigate without auth for now (demo mode)
        router.push({
          pathname: '/(auth)/otp',
          params: { phone, verificationId: 'demo-verification-id' },
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 8 }}>
        Welcome to Crowmix
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Inter', marginBottom: 40 }}>
        Sign in with your phone number
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 12, color: '#111827', fontFamily: 'Inter-Bold', marginBottom: 8 }}>
          Phone Number
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 12 }}>
          <Text style={{ fontSize: 16, fontFamily: 'Inter', color: '#111827' }}>+91</Text>
          <TextInput
            placeholder="9876543210"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            maxLength={10}
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 12,
              marginLeft: 8,
              fontFamily: 'Inter',
              color: '#111827',
            }}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {error && (
        <Text style={{ fontSize: 12, color: '#EF4444', fontFamily: 'Inter', marginBottom: 16 }}>
          {error}
        </Text>
      )}

      <Pressable
        onPress={handleSendOTP}
        disabled={loading}
        style={{
          backgroundColor: '#059494',
          paddingVertical: 14,
          borderRadius: 8,
          alignItems: 'center',
          marginBottom: 16,
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: 'white', fontSize: 16, fontFamily: 'Poppins-Bold' }}>
            Send OTP
          </Text>
        )}
      </Pressable>

      <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', fontFamily: 'Inter' }}>
        By continuing, you agree to our Terms & Privacy Policy
      </Text>

      <View id="recaptcha-container" />
    </View>
  );
}
