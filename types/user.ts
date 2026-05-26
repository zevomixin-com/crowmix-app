export interface User {
  id: string;
  firebase_uid: string;
  phone: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
}

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  flat: string;
  building: string;
  area: string;
  city: string;
  pincode: string;
  is_default: boolean;
  created_at: string;
}
