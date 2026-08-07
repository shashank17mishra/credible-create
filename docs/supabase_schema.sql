-- ==============================================================================
-- CREDIBLE CREATE — COMPLETE SUPABASE DATABASE SCHEMA & RLS SECURITY POLICIES
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENUM TYPES
-- ------------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM ('admin', 'instructor', 'student');
CREATE TYPE public.cert_status AS ENUM ('verified', 'revoked', 'pending');
CREATE TYPE public.post_status AS ENUM ('published', 'draft', 'archived');
CREATE TYPE public.demo_status AS ENUM ('pending', 'contacted', 'scheduled', 'completed');
CREATE TYPE public.payment_status AS ENUM ('completed', 'pending', 'failed', 'refunded');

-- ------------------------------------------------------------------------------
-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
-- ------------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role public.user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 3. CERTIFICATES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_code TEXT UNIQUE NOT NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  program_name TEXT NOT NULL,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status public.cert_status NOT NULL DEFAULT 'verified',
  issued_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 4. BLOG POSTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL DEFAULT 'robotics',
  author_name TEXT NOT NULL DEFAULT 'Credible Team',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  cover_image TEXT,
  summary TEXT,
  content TEXT NOT NULL,
  read_time TEXT DEFAULT '5 min read',
  status public.post_status NOT NULL DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on blog_posts
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 5. DEMO REQUESTS & INQUIRIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  institution_name TEXT,
  program_interest TEXT NOT NULL DEFAULT 'General Inquiry',
  preferred_date DATE,
  message TEXT,
  status public.demo_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on demo_requests
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6. PAYMENTS / TRANSACTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id TEXT UNIQUE NOT NULL,
  payer_name TEXT NOT NULL,
  payer_email TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT DEFAULT 'UPI / Card',
  program_name TEXT NOT NULL,
  status public.payment_status NOT NULL DEFAULT 'completed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on payments
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;


-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper function to check if current user is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES POLICIES ---
CREATE POLICY "Public profiles reading" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- --- CERTIFICATES POLICIES ---
-- Public can search and view certificates (for /verify page lookup)
CREATE POLICY "Public certificate verification lookup" ON public.certificates 
  FOR SELECT USING (true);

-- Only Admins can issue, modify, or revoke certificates
CREATE POLICY "Admins manage certificates" ON public.certificates 
  FOR ALL USING (public.is_admin());

-- --- BLOG POSTS POLICIES ---
-- Public can view published blog posts
CREATE POLICY "Public view published blog posts" ON public.blog_posts 
  FOR SELECT USING (status = 'published' OR public.is_admin());

-- Only Admins can create, edit, or delete posts
CREATE POLICY "Admins manage blog posts" ON public.blog_posts 
  FOR ALL USING (public.is_admin());

-- --- DEMO REQUESTS POLICIES ---
-- Public can submit demo requests
CREATE POLICY "Public submit demo requests" ON public.demo_requests 
  FOR INSERT WITH CHECK (true);

-- Only Admins can view and manage demo leads
CREATE POLICY "Admins manage demo requests" ON public.demo_requests 
  FOR ALL USING (public.is_admin());

-- --- PAYMENTS POLICIES ---
-- Only Admins can view and manage payment transactions
CREATE POLICY "Admins view and manage payments" ON public.payments 
  FOR ALL USING (public.is_admin());


-- ==============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER (ON USER SIGNUP)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'student'::public.user_role),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ==============================================================================
-- 9. INITIAL SEED DATA FOR TESTING
-- ==============================================================================

-- Seed Certificates
INSERT INTO public.certificates (certificate_code, student_name, student_email, program_name, status) VALUES
('CC-2026-8921', 'Aarav Sharma', 'aarav@example.com', 'Autonomous Robotics & AI Pro', 'verified'),
('CC-2026-9042', 'Ananya Patel', 'ananya@example.com', 'Generative AI & IoT Studio', 'verified'),
('CC-2026-7419', 'Rohan Verma', 'rohan@example.com', 'Quadcopter Flight & Aerodynamics', 'verified');

-- Seed Blog Posts
INSERT INTO public.blog_posts (title, slug, category, summary, content, read_time, status) VALUES
('Getting Started with MicroPython on ESP32', 'micropython-esp32-setup', 'robotics', 'A beginner-friendly guide to installing MicroPython on ESP32 boards for autonomous rovers.', 'MicroPython makes hardware prototyping easy and fast...', '4 min read', 'published'),
('Prompt Engineering Strategies for Student Developers', 'prompt-engineering-students', 'ai', 'How young innovators can leverage Gemini and ChatGPT to vibe-code interactive web apps.', 'Generative AI is transforming technology education...', '6 min read', 'published');

-- Seed Demo Requests
INSERT INTO public.demo_requests (full_name, email, phone, institution_name, program_interest, message) VALUES
('Vikram Mehta', 'vikram@stxaviers.edu', '+91 98765 43210', 'St. Xaviers High School', 'Bot Barracks Robotics Lab', 'Interested in setting up a robotics lab cohort for grade 8-10 students.');

-- Seed Payments
INSERT INTO public.payments (transaction_id, payer_name, payer_email, amount, program_name, status) VALUES
('TXN-8849201', 'Aarav Sharma', 'aarav@example.com', 4999.00, 'Autonomous Robotics Cohort', 'completed'),
('TXN-8849202', 'Ananya Patel', 'ananya@example.com', 3499.00, 'AI Studio Workshop', 'completed');
