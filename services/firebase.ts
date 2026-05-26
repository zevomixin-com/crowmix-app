import { initializeApp } from '@react-native-firebase/app';
import auth, { getAuth } from '@react-native-firebase/auth';
import { Platform } from 'react-native';

// Initialize Firebase
let firebaseApp: any;
let firebaseAuth: any;

const initFirebase = () => {
  if (Platform.OS !== 'web') {
    const firebaseConfig = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
    };
    firebaseApp = initializeApp(firebaseConfig);
    firebaseAuth = getAuth(firebaseApp);
  }
};

initFirebase();

export { firebaseApp, firebaseAuth };

