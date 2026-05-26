import { View, Text, Pressable, TextInput, ActivityIndicator, Platform } from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import auth, { getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { useUserStore } from '../../store/userStore';
import { supabase } from '../../services/supabase';

export default function OTPScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { phone, verificationId } = params as { phone: string; verificationId: string };
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const { setUser, setFirebaseUid } = useUserStore();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
    if (Platform.OS !== 'web') {
      const authInstance = getAuth();
      const credential = auth.PhoneAuthProvider.credential(verificationId, otp);
      const userCredential = await signInWithCredential(authInstance, credential);
      const firebaseUser = userCredential.user;

      setFirebaseUid(firebaseUser.uid);

      // Upsert user to Supabase
      const { data, error: supabaseError } = await supabase
        .from('users')
        .upsert(
          {
            firebase_uid: firebaseUser.uid,
            phone: phone,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'firebase_uid' }
        )
        .select()
        .maybeSingle();

      if (supabaseError) {
        throw supabaseError;
      }

      setUser({
        id: data?.id || '',
        firebase_uid: firebaseUser.uid,
        phone: phone,
        created_at: data?.created_at || new Date().toISOString(),
      });
    } else {
      // Demo mode for web - simulate successful login
      setUser({
        id: 'demo-user-id',
        firebase_uid: 'demo-firebase-uid',
        phone: phone,
        created_at: new Date().toISOString(),
      });
    }

    router.replace('/(tabs)');
  } catch (err: any) {
    setError(err.message || 'Failed to verify OTP. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20, justifyContent: 'center' }}>
      <Text style={{ fontSize: 28, fontFamily: 'Poppins-Bold', color: '#111827', marginBottom: 8 }}>
        Verify Your Number
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', fontFamily: 'Inter', marginBottom: 32 }}>
        We sent a code to +91 {phone?.slice(-4)}
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 12, color: '#111827', fontFamily: 'Inter-Bold', marginBottom: 8 }}>
          Enter OTP
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderWidth: 1,
            borderColor: '#E5E7EB',
            borderRadius: 8,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              maxLength={1}
              keyboardType="number-pad"
              value={otp[index] || ''}
              onChangeText={(text) => {
                const newOtp = otp.split('');
                newOtp[index] = text;
                setOtp(newOtp.join(''));
              }}
              style={{
                width: 40,
                height: 40,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                borderRadius: 4,
                textAlign: 'center',
                fontSize: 18,
                fontFamily: 'Inter-Bold',
                color: '#111827',
              }}
            />
          ))}
        </View>
      </View>

      {error && (
        <Text style={{ fontSize: 12, color: '#EF4444', fontFamily: 'Inter', marginBottom: 16 }}>
          {error}
        </Text>
      )}

      <Pressable
        onPress={handleVerifyOTP}
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
            Verify OTP
          </Text>
        )}
      </Pressable>

      <Text style={{ fontSize: 12, color: '#6B7280', textAlign: 'center', fontFamily: 'Inter' }}>
        {timer > 0 ? `Resend OTP in ${timer}s` : 'Didn\'t receive OTP?'}
        {timer === 0 && (
          <Text style={{ color: '#059494', fontFamily: 'Inter-Bold' }}>  Resend</Text>
        )}
      </Text>
    </View>
  );
}
