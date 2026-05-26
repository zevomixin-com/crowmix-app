# Crowmix - Quick Commerce Native App - Setup Guide

## Prerequisites

- Node.js 16+ and npm
- Expo CLI: `npm install -g expo-cli`
- Android Studio or Android SDK tools
- Firebase project setup
- Supabase project setup

## Environment Setup

### 1. Create `.env.local` file

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

Fill in the following values:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_PHONEPE_MERCHANT_ID=your_merchant_id
EXPO_PUBLIC_PHONEPE_SALT_KEY=your_salt_key
EXPO_PUBLIC_PHONEPE_SALT_INDEX=1
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Supabase

- Create a Supabase project at https://supabase.com
- The database schema is automatically created via migrations in `supabase/migrations/`
- Ensure your Supabase credentials are in `.env.local`

### 4. Set up Firebase

- Go to https://firebase.google.com
- Create a new project or use existing
- Enable Phone Authentication under Authentication methods
- Copy API credentials to `.env.local`
- For Android, add your app package name: `com.crowmix.app`

### 5. Create Sample Data (Optional)

Run this SQL in your Supabase database to add sample products:

```sql
INSERT INTO products (title, description, price, discount, image_url, weight, rating, rating_count, category_name, service_type, is_veg, is_active, delivery_time) VALUES
('Biryani Combo', 'Delicious biryani with raita and pickle', '₹280', '20% OFF', 'https://images.unsplash.com/photo-1585937421456-de8e191203f0?w=300', 'Full Plate', 4.5, 120, 'Biryani', 'food', true, true, '20 mins'),
('Fresh Milk 1L', 'Pasteurized cow milk', '₹45', '', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300', '1 Liter', 4.2, 500, 'Dairy & Eggs', 'grocery', true, true, '10 mins'),
('Margherita Pizza', 'Classic margherita with fresh basil', '₹350', '15% OFF', 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300', 'Medium', 4.6, 300, 'Pizza', 'food', true, true, '25 mins'),
('Eggs (6 pieces)', 'Fresh farm eggs', '₹60', '', 'https://images.unsplash.com/photo-1585133271302-e4e3124b37d9?w=300', '6 pieces', 4.3, 600, 'Dairy & Eggs', 'grocery', true, true, '15 mins'),
('Tomatoes 500g', 'Fresh red tomatoes', '₹40', '', 'https://images.unsplash.com/photo-1592755251900-3fb4ee1666f1?w=300', '500g', 4.1, 400, 'Fruits & Veg', 'grocery', true, true, '10 mins');
```

## Running the App

### Development Mode

```bash
npm run dev
```

This will:
1. Start the Expo dev server
2. Show a QR code in terminal
3. Open Expo Go on your Android phone and scan the QR code
4. App will load and hot reload on code changes

### Building for Android

```bash
npm run build
```

This uses EAS Build for production APK builds. You'll need to:
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Run: `eas build --platform android`

## Project Structure

```
app/                    # Main app screens using Expo Router
  (auth)/              # Auth flow screens
  (tabs)/              # Main app screens
  checkout/            # Checkout flow
  product/             # Product detail
  orders.tsx           # Orders history
  search.tsx           # Product search
  addresses.tsx        # Saved addresses

services/              # API & external service integrations
  supabase.ts         # Supabase client
  firebase.ts         # Firebase config
  products.ts         # Product queries
  orders.ts           # Order operations

store/                 # Zustand state management
  cartStore.ts        # Shopping cart state
  userStore.ts        # User & auth state

types/                 # TypeScript interfaces
  product.ts
  order.ts
  user.ts
```

## Key Features Implemented

✓ Phone OTP Authentication via Firebase
✓ Splash, Onboarding, Login, OTP screens
✓ Home screen with product carousels
✓ Food Dishes & Grocery screens with filtering
✓ Product detail page
✓ Shopping cart with persistent storage
✓ Address management
✓ Checkout & payment method selection
✓ Order history tracking
✓ User profile management
✓ Search functionality
✓ Row Level Security in database
✓ Responsive design with Expo Router

## PhonePe Integration Notes

The current implementation shows a demo payment flow. To fully integrate PhonePe:

1. Get your Merchant credentials from PhonePe
2. Create a backend endpoint to generate payment checksums (for security)
3. Use `expo-web-browser` to open PhonePe payment URL
4. Handle payment callbacks via deep linking

See `app/checkout/payment.tsx` for the payment selection screen.

## Common Issues

**Issue:** Firebase auth not working
- Ensure Phone Authentication is enabled in Firebase Console
- Check that your Firebase credentials are correct in `.env.local`
- Verify Android package name matches in Firebase settings

**Issue:** Database queries returning no data
- Check that products have been inserted in your Supabase database
- Verify RLS policies are correctly configured
- Check Supabase connection in `services/supabase.ts`

**Issue:** Styling/fonts not loading
- Run `npm install` to ensure all dependencies are installed
- Check that font files are present in `assets/fonts/`
- Clear expo cache: `expo start --clear`

## Testing Credentials

For testing with Firebase Phone Auth:
- Use the test phone numbers provided in Firebase Console
- Or enable Firebase in Production mode and use real phone numbers

## Support

For issues or questions:
1. Check Expo documentation: https://docs.expo.dev
2. Check Firebase docs: https://firebase.google.com/docs
3. Check Supabase docs: https://supabase.com/docs
