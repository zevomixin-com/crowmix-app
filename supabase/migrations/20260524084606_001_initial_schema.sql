/*
  # Initialize Crowmix Database Schema

  1. New Tables
    - `users`: Store authenticated user profiles
      - `id` (uuid, primary key)
      - `firebase_uid` (text, unique) - Firebase authentication UID
      - `phone` (text) - User's phone number
      - `name` (text) - User's full name
      - `email` (text) - User's email address
      - `avatar_url` (text) - Profile picture URL
      - `created_at` (timestamptz) - Account creation timestamp

    - `products`: Store all available products (food and grocery)
      - `id` (uuid, primary key)
      - `title` (text) - Product name
      - `description` (text) - Product description
      - `price` (text) - Current price as string (e.g., "₹280")
      - `original_price` (text) - Original price before discount
      - `discount` (text) - Discount label (e.g., "20% OFF")
      - `image_url` (text) - Product image URL
      - `weight` (text) - Weight or size (e.g., "500g", "Full Plate")
      - `rating` (numeric) - Product rating (0-5)
      - `rating_count` (int) - Number of ratings
      - `category_name` (text) - Category name
      - `category_id` (text) - Category ID
      - `service_type` (text) - "food" or "grocery"
      - `is_veg` (boolean) - Vegetarian indicator
      - `is_active` (boolean) - Active/inactive status
      - `delivery_time` (text) - Estimated delivery time
      - `unit` (text) - Unit of measurement
      - `created_at` (timestamptz) - Creation timestamp

    - `orders`: Store customer orders
      - `id` (uuid, primary key)
      - `user_id` (text) - Firebase UID of the user
      - `items` (jsonb) - Array of ordered items with details
      - `total_amount` (numeric) - Total order amount
      - `payment_method` (text) - Payment method used
      - `status` (text) - Order status (placed/preparing/out_for_delivery/delivered)
      - `address` (jsonb) - Delivery address details
      - `created_at` (timestamptz) - Order creation timestamp

    - `user_addresses`: Store multiple delivery addresses per user
      - `id` (uuid, primary key)
      - `user_id` (text) - Firebase UID of the user
      - `label` (text) - Address label (Home/Work/Other)
      - `flat` (text) - Flat/house number
      - `building` (text) - Building name
      - `area` (text) - Area/locality name
      - `city` (text) - City name
      - `pincode` (text) - Postal code
      - `is_default` (boolean) - Default address indicator
      - `created_at` (timestamptz) - Creation timestamp

    - `banners`: Store promotional banners
      - `id` (uuid, primary key)
      - `image_url` (text) - Banner image URL
      - `title` (text) - Banner title
      - `link` (text) - Banner link/action
      - `is_active` (boolean) - Active status
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access control
    - Users can only view/modify their own data

  3. Indexes
    - Add indexes on frequently queried columns for performance
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  firebase_uid text UNIQUE NOT NULL,
  phone text NOT NULL,
  name text,
  email text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  price text NOT NULL,
  original_price text,
  discount text,
  image_url text,
  weight text,
  rating numeric DEFAULT 0,
  rating_count int DEFAULT 0,
  category_name text,
  category_id text,
  service_type text NOT NULL CHECK (service_type IN ('food', 'grocery')),
  is_veg boolean DEFAULT false,
  is_active boolean DEFAULT true,
  delivery_time text,
  unit text,
  created_at timestamptz DEFAULT now()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  payment_method text NOT NULL,
  status text DEFAULT 'placed' CHECK (status IN ('placed', 'preparing', 'out_for_delivery', 'delivered')),
  address jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_addresses table
CREATE TABLE IF NOT EXISTS user_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  label text NOT NULL,
  flat text NOT NULL,
  building text NOT NULL,
  area text NOT NULL,
  city text NOT NULL,
  pincode text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create banners table
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title text,
  link text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = firebase_uid);

CREATE POLICY "Public can insert user on signup"
  ON users FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = firebase_uid)
  WITH CHECK (auth.uid()::text = firebase_uid);

-- RLS Policies for products table (public read)
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- RLS Policies for orders table
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own orders"
  ON orders FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own orders"
  ON orders FOR UPDATE
  USING (user_id = auth.uid()::text);

-- RLS Policies for user_addresses table
CREATE POLICY "Users can view their own addresses"
  ON user_addresses FOR SELECT
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can insert their own addresses"
  ON user_addresses FOR INSERT
  WITH CHECK (user_id = auth.uid()::text);

CREATE POLICY "Users can update their own addresses"
  ON user_addresses FOR UPDATE
  USING (user_id = auth.uid()::text);

CREATE POLICY "Users can delete their own addresses"
  ON user_addresses FOR DELETE
  USING (user_id = auth.uid()::text);

-- RLS Policies for banners table (public read)
CREATE POLICY "Public can view active banners"
  ON banners FOR SELECT
  USING (is_active = true);

-- Create indexes for performance
CREATE INDEX idx_products_service_type ON products(service_type);
CREATE INDEX idx_products_category ON products(category_name);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_user_addresses_user_id ON user_addresses(user_id);
CREATE INDEX idx_banners_is_active ON banners(is_active);
