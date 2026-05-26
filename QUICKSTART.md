# Crowmix - Quick Start Guide

## 5-Minute Setup

### 1. Prerequisites Check
```bash
# Verify Node.js version (should be 16+)
node --version

# Install Expo CLI globally
npm install -g expo-cli

# Install Android SDK (for building APK)
# Download Android Studio from https://developer.android.com/studio
```

### 2. Clone & Install
```bash
cd project
npm install
```

### 3. Configure Environment
```bash
# Copy example env
cp .env.example .env.local

# Edit with your credentials
nano .env.local
```

**Required credentials:**
- Supabase URL & Anon Key (from https://supabase.com)
- Firebase API Key & Project ID (from https://firebase.google.com)
- PhonePe Merchant ID (for payments)

### 4. Start Development Server
```bash
npm run dev
```

You'll see:
```
Expo Go

✨ Press 'a' to open Android, 'w' to open web, or 'r' to refresh.
```

### 5. Test on Android
```
1. Install Expo Go from Google Play Store
2. Scan QR code from terminal
3. App opens automatically
```

## Project Structure at a Glance

```
app/                  → Screens (Expo Router)
├── (auth)           → Login/OTP flow
├── (tabs)           → Main app (5 tabs)
└── checkout/        → Payment flow

services/            → API calls (Supabase, Firebase)
store/              → State (Zustand)
types/              → TypeScript interfaces
```

## First Steps

### 1. Test Authentication Flow
```
Home → Tap Profile → Logout
→ Login Screen → Enter phone (+91 format)
→ OTP Screen → (Use test phone if in Firebase console)
```

### 2. Browse Products
```
Home → Food/Grocery tabs
→ Add items to cart
→ View cart → Checkout
```

### 3. Check Orders
```
Profile → My Orders
→ View order history
```

## Common Tasks

### Add Sample Products
1. Go to Supabase Dashboard
2. Go to SQL Editor
3. Run:
```sql
INSERT INTO products (
  title, price, image_url, service_type, is_active,
  category_name, is_veg, weight, delivery_time, rating
) VALUES
('Biryani', '₹280', 'https://via.placeholder.com/150', 'food', true,
 'Biryani', true, 'Full Plate', '20 mins', 4.5),
('Milk 1L', '₹45', 'https://via.placeholder.com/150', 'grocery', true,
 'Dairy', true, '1 Liter', '10 mins', 4.2);
```

### Test Payment Flow
1. Home → Add items → Cart
2. Click "Proceed to Checkout"
3. Add delivery address
4. Select payment method
5. Click "Pay" → See order confirmation

### Debug Issues
```bash
# Clear cache
expo start --clear

# Check logs
expo start --verbose

# Test build locally
npm run build
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `app/_layout.tsx` | App root & providers |
| `app/(tabs)/index.tsx` | Home screen |
| `services/supabase.ts` | Database client |
| `store/cartStore.ts` | Shopping cart state |
| `app/checkout/payment.tsx` | Payment selection |
| `.env.local` | Secrets (add to .gitignore) |

## Troubleshooting

### "Phone authentication not working"
```
Firebase Console → Authentication → Phone
→ Enable it → Add test phone (if development)
```

### "No products showing"
```
Supabase → SQL Editor → Check products table
INSERT sample data if empty
```

### "Build errors"
```bash
# Clear all caches
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "App won't start"
```
1. Check .env.local has all required keys
2. Run: expo start --clear
3. Check Firebase/Supabase console for errors
```

## Environment Variables

All variables go in `.env.local`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_PHONEPE_MERCHANT_ID=your_merchant_id
EXPO_PUBLIC_PHONEPE_SALT_KEY=your_salt_key
EXPO_PUBLIC_PHONEPE_SALT_INDEX=1
```

## Building for Production

### Build APK
```bash
# First time only
npm install -g eas-cli
eas login

# Build
npm run build

# Download from EAS Build dashboard
```

### Upload to Play Store
```
1. Create Google Play Developer account ($25)
2. Create app in Play Console
3. Upload APK
4. Fill app details
5. Submit for review (24-48 hours)
```

## Next Steps

1. **Customize branding**
   - Change colors in design tokens
   - Update app name in app.json
   - Add app logo in assets/

2. **Add more features**
   - Wishlist
   - Reviews & ratings
   - Referral program
   - Wallet system

3. **Optimize performance**
   - Implement image caching
   - Add offline support
   - Optimize bundle size

4. **Set up CI/CD**
   - GitHub Actions for testing
   - Automated EAS builds
   - Auto-deploy to Play Store

## Resources

- 📚 [Expo Docs](https://docs.expo.dev)
- 📱 [React Native Docs](https://reactnative.dev)
- 🔥 [Firebase](https://firebase.google.com)
- 📦 [Supabase](https://supabase.com)
- 🎨 [Design System](./PROJECT_OVERVIEW.md#ui-ux-highlights)

## Need Help?

1. Check `SETUP.md` for detailed setup
2. Check `PROJECT_OVERVIEW.md` for architecture
3. Read the code comments in key files
4. Check official docs for libraries

---

**You're ready to go!** Start the dev server and begin exploring Crowmix.

```bash
npm run dev
```
