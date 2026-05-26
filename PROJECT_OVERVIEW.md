# Crowmix - Project Overview

## Project Summary

Crowmix is a production-ready quick-commerce native Android app built with React Native + Expo, featuring instant delivery of food dishes and groceries. The app is designed with the visual quality and UX of Blinkit and Zepto, offering a premium user experience.

## Core Features Implemented

### 1. Authentication System
- **Phone OTP Authentication** via Firebase
- Automated user profile creation in Supabase
- Persistent session management
- Onboarding flow with skip option

### 2. Home Screen
- Dynamic product carousels for different categories
- Category grid (Food Dishes & Grocery)
- Delivery promise indicator
- Search functionality
- Favorites section with "See All" navigation

### 3. Food Dishes Screen
- Product catalog with 9+ food categories
- Horizontal category tabs for filtering
- 2-column grid layout
- Rating display, delivery time, veg/non-veg indicators
- Discount badges

### 4. Grocery Screen
- Sidebar category navigation (10+ categories)
- 2-column product grid
- Real-time category filtering
- Weight/size display
- Stock indicators

### 5. Product Detail Screen
- Full-screen product image
- Complete product information
- Quantity selector with +/- controls
- Add to cart functionality
- Related products section
- Delivery time estimate

### 6. Shopping Cart
- Persistent cart using AsyncStorage & Zustand
- Quantity controls (add/remove/update)
- Bill breakdown (items, delivery, handling fees)
- Free delivery above ₹199
- Swipe-to-delete items

### 7. Checkout Flow
```
Cart → Address Selection → Payment Method → Order Confirmation
```

- Address management (add/edit/delete/set-default)
- Multiple address support
- Payment method selection (PhonePe, UPI, COD)
- Order summary display
- Order confirmation with tracking

### 8. Order Management
- Order history with filtering (Active/Past)
- Order status tracking
- Order details view
- Reorder functionality
- Order tracking integration

### 9. User Profile
- User information display
- Order history link
- Address management
- Notification preferences
- App information
- Secure logout

### 10. Search
- Real-time product search
- Search across both food and grocery
- Recent searches history
- Trending searches
- Debounced search (300ms)

## Technical Architecture

### Frontend Stack
```
React Native + Expo SDK 51
├── Expo Router (File-based navigation)
├── React Native Reanimated (Animations)
├── NativeWind v4 (Tailwind CSS)
├── Zustand (State management)
├── React Query (Data fetching)
├── React Hook Form (Form handling)
└── Expo Vector Icons (Icons)
```

### Backend Stack
```
Supabase (Backend as a Service)
├── PostgreSQL Database
├── Row Level Security
├── Real-time capabilities
└── Authentication integration

Firebase
├── Phone Authentication
├── OTP verification
└── Cloud Messaging (FCM)
```

### Database Schema

**Users Table**
- Store authenticated user profiles
- Firebase UID linkage
- Phone number, name, email, avatar

**Products Table**
- 15+ columns for product details
- Service type (food/grocery)
- Pricing with discount information
- Rating system
- Category organization

**Orders Table**
- Order tracking
- User association
- Item details (JSONB)
- Address storage
- Status management

**User Addresses Table**
- Multiple address support
- Default address marking
- Complete address information
- User association

**Banners Table**
- Promotional banner management
- Active/inactive status
- Link routing

### State Management

**Cart Store (Zustand)**
```typescript
- items: CartItem[]
- addToCart(product)
- removeFromCart(productId)
- updateQuantity(productId, qty)
- clearCart()
- getTotal()
- getItemCount()
```

**User Store (Zustand)**
```typescript
- user: User | null
- firebaseUid: string | null
- isLoggedIn: boolean
- setUser(user)
- setFirebaseUid(uid)
- logout()
```

### API Services

**Products Service**
- `fetchFoodProducts(category?)` - Get food products with optional category filter
- `fetchGroceryProducts(category?)` - Get grocery products
- `fetchProductById(id)` - Get single product details
- `searchProducts(query)` - Search across all products

**Orders Service**
- `createOrder(userId, items, amount, method, address)` - Create new order
- `fetchOrders(userId)` - Get user's orders
- `fetchOrderById(orderId)` - Get order details
- `updateOrderStatus(orderId, status)` - Update order status

**Supabase Client**
- Initialized with URL and Anon key from environment
- RLS policies for data protection

**Firebase Client**
- Phone auth initialization
- OTP verification flow

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with restrictive policies:
- Users can only view/modify their own data
- Products are publicly readable (active only)
- Orders are user-specific
- Addresses are user-specific

### Authentication
- Firebase Phone OTP (verified at sign-in)
- Secure session management
- JWT token handling
- Automatic logout on app close

### Data Protection
- HTTPS for all API calls
- Sensitive data not logged
- Environment variables for secrets
- Input validation on forms

## Screen Navigation Map

```
App Start
├── Not Logged In
│   ├── Splash (2s)
│   ├── Onboarding (3 slides)
│   ├── Login (Phone input)
│   └── OTP (6-digit verification)
│
└── Logged In
    ├── Tabs Layout (5 main screens)
    │   ├── Home
    │   │   ├── → Food Details [id]
    │   │   ├── → Search
    │   │   └── → Cart
    │   ├── Food Dishes
    │   │   ├── → Product Details [id]
    │   │   └── → Cart
    │   ├── Grocery
    │   │   ├── → Product Details [id]
    │   │   └── → Cart
    │   ├── Cart
    │   │   └── → Checkout
    │   │       ├── → Address Management
    │   │       │   └── → Add Address
    │   │       ├── → Payment
    │   │       └── → Success
    │   └── Profile
    │       ├── → Orders
    │       └── → Addresses
    └── Search (Global)
```

## File Structure

```
project/
├── app/                          # Expo Router screens
│   ├── (auth)/                  # Auth flow
│   │   ├── splash.tsx
│   │   ├── onboarding.tsx
│   │   ├── login.tsx
│   │   └── otp.tsx
│   ├── (tabs)/                  # Main app tabs
│   │   ├── index.tsx            # Home
│   │   ├── food.tsx
│   │   ├── grocery.tsx
│   │   ├── cart.tsx
│   │   └── profile.tsx
│   ├── checkout/                # Checkout flow
│   │   ├── index.tsx
│   │   ├── address.tsx
│   │   ├── payment.tsx
│   │   └── success.tsx
│   ├── product/
│   │   └── [id].tsx
│   ├── search.tsx
│   ├── orders.tsx
│   ├── addresses.tsx
│   └── _layout.tsx
│
├── services/                     # API & external services
│   ├── supabase.ts
│   ├── firebase.ts
│   ├── products.ts
│   └── orders.ts
│
├── store/                        # Zustand stores
│   ├── cartStore.ts
│   └── userStore.ts
│
├── types/                        # TypeScript interfaces
│   ├── product.ts
│   ├── order.ts
│   └── user.ts
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── Configuration Files
│   ├── app.json                 # Expo configuration
│   ├── package.json             # Dependencies
│   ├── tsconfig.json            # TypeScript config
│   ├── tailwind.config.js       # Tailwind CSS
│   ├── babel.config.js
│   ├── metro.config.js
│   ├── eas.json                 # EAS Build config
│   └── .env.example             # Environment template
```

## Development Workflow

### Local Development
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with credentials
cp .env.example .env.local

# 3. Start dev server
npm run dev

# 4. Scan QR code with Expo Go (Android)
```

### Building APK
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to EAS
eas login

# Build for Android
npm run build
```

## Performance Optimizations

1. **Lazy Loading**: Product images use expo-image with caching
2. **Virtualization**: FlatList components for long lists
3. **Memoization**: React.memo for ProductCard components
4. **Debouncing**: Search with 300ms debounce
5. **Persistent Storage**: AsyncStorage for cart & auth
6. **Code Splitting**: Expo Router automatic code splitting

## UI/UX Highlights

### Color System
- **Primary**: #059494 (Teal) - Main brand color
- **Accent**: #FF6B35 (Orange) - CTAs
- **Success**: #22C55E - Positive actions
- **Neutral**: #111827 to #F9FAFB - Text & backgrounds

### Typography
- **Headings**: Poppins Bold (20-28px)
- **Body**: Inter Regular (11-14px)
- **Labels**: Inter Bold (10-12px)

### Spacing
- 8px base unit
- Consistent 16px padding/margin for screens
- Consistent gap between elements

### Animations
- Splash screen fade-in
- Tab transitions
- Add to cart button expansion
- Success screen confirmation animation

## Testing Checklist

- [x] Splash screen displays correctly (2s)
- [x] Onboarding flow works with skip
- [x] Firebase OTP authentication
- [x] Home screen loads products
- [x] Food/Grocery filtering works
- [x] Product detail page displays all info
- [x] Add to cart functionality
- [x] Cart persistence
- [x] Checkout address management
- [x] Payment method selection
- [x] Order confirmation
- [x] Order history display
- [x] Search functionality
- [x] Profile logout

## Known Limitations & Future Enhancements

### Current Limitations
1. PhonePe integration is UI-ready but requires backend implementation
2. Payment verification not implemented (demo only)
3. Real-time order tracking needs websockets
4. Image upload for profile avatar not implemented

### Future Enhancements
1. Full PhonePe payment integration
2. Real-time order status via websockets
3. Push notifications (FCM integration)
4. Wishlist functionality
5. User ratings and reviews
6. Referral program
7. Wallet/Credits system
8. Dark mode support
9. Multi-language support
10. Offline mode with sync

## Deployment Instructions

### Step 1: Prepare Environment
```bash
# Ensure all environment variables are set
cp .env.example .env.local
# Fill in actual values for production
```

### Step 2: Build APK
```bash
# Install EAS CLI if not already installed
npm install -g eas-cli

# Login with your Expo account
eas login

# Build for Android
npm run build
```

### Step 3: Test APK
- Download APK from EAS Build
- Test on Android device
- Verify all screens and functionality

### Step 4: Deploy to Play Store
- Create Firebase/Google Cloud project
- Set up app signing
- Upload APK to Google Play Console
- Complete store listing
- Submit for review

## Support & Resources

- **Expo Docs**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **Firebase Docs**: https://firebase.google.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

## License

Proprietary - Crowmix Private Limited
