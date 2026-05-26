import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user';

interface UserStore {
  user: User | null;
  firebaseUid: string | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  setFirebaseUid: (uid: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      firebaseUid: null,
      isLoggedIn: false,
      setUser: (user: User) => {
        set({
          user,
          isLoggedIn: true,
        });
      },
      setFirebaseUid: (uid: string) => {
        set({
          firebaseUid: uid,
        });
      },
      logout: () => {
        set({
          user: null,
          firebaseUid: null,
          isLoggedIn: false,
        });
      },
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
