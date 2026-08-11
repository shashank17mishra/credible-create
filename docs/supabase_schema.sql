-- ==============================================================================
-- CREDIBLE CREATE — COMPLETE SUPABASE DATABASE SCHEMA & RLS SECURITY POLICIES
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ENUM TYPES
-- ------------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE public.user_role AS ENUM ('admin', 'instructor', 'student');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.cert_status AS ENUM ('verified', 'revoked', 'pending');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.post_status AS ENUM ('published', 'draft', 'archived');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.demo_status AS ENUM ('pending', 'contacted', 'scheduled', 'completed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_status AS ENUM ('completed', 'pending', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------------------------------------------------
-- 2. USER PROFILES TABLE (Linked with Supabase Auth)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'User',
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
CREATE TABLE IF NOT EXISTS public.certificates (
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
CREATE TABLE IF NOT EXISTS public.blog_posts (
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
CREATE TABLE IF NOT EXISTS public.demo_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  institution_name TEXT,
  program_interest TEXT NOT NULL DEFAULT 'General Inquiry',
  level TEXT,
  class_course TEXT,
  preferred_date DATE,
  message TEXT,
  status public.demo_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ensure newly added columns exist if table was previously created
ALTER TABLE public.demo_requests ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE public.demo_requests ADD COLUMN IF NOT EXISTS class_course TEXT;

-- Enable RLS on demo_requests
ALTER TABLE public.demo_requests ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 6. PAYMENTS / TRANSACTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
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
DROP POLICY IF EXISTS "Public profiles reading" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins manage all profiles" ON public.profiles;

CREATE POLICY "Public profiles reading" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- --- CERTIFICATES POLICIES ---
DROP POLICY IF EXISTS "Public certificate verification lookup" ON public.certificates;
DROP POLICY IF EXISTS "Admins manage certificates" ON public.certificates;

CREATE POLICY "Public certificate verification lookup" ON public.certificates 
  FOR SELECT USING (true);

CREATE POLICY "Admins manage certificates" ON public.certificates 
  FOR ALL USING (public.is_admin());

-- --- BLOG POSTS POLICIES ---
DROP POLICY IF EXISTS "Public view published blog posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Admins manage blog posts" ON public.blog_posts;

CREATE POLICY "Public view published blog posts" ON public.blog_posts 
  FOR SELECT USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins manage blog posts" ON public.blog_posts 
  FOR ALL USING (public.is_admin());

-- --- DEMO REQUESTS POLICIES ---
DROP POLICY IF EXISTS "Public submit demo requests" ON public.demo_requests;
DROP POLICY IF EXISTS "Admins manage demo requests" ON public.demo_requests;

CREATE POLICY "Public submit demo requests" ON public.demo_requests 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins manage demo requests" ON public.demo_requests 
  FOR ALL USING (public.is_admin());

-- --- PAYMENTS POLICIES ---
DROP POLICY IF EXISTS "Admins view and manage payments" ON public.payments;

CREATE POLICY "Admins view and manage payments" ON public.payments 
  FOR ALL USING (public.is_admin());


-- ==============================================================================
-- 8. FAIL-SAFE AUTOMATIC PROFILE CREATION TRIGGER (PREVENTS SIGNUP ERRORS)
-- ==============================================================================
DO $$
DECLARE
    trig RECORD;
BEGIN
    FOR trig IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_schema = 'auth' 
          AND event_object_table = 'users' 
          AND trigger_name NOT LIKE 'pg_%'
    LOOP
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(trig.trigger_name) || ' ON auth.users CASCADE;';
    END LOOP;
END $$;

DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  extracted_full_name TEXT;
  extracted_role public.user_role;
  raw_role_str TEXT;
BEGIN
  -- Extract full_name cleanly with safe fallback
  extracted_full_name := COALESCE(
    NULLIF(TRIM(new.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(new.raw_user_meta_data->>'name'), ''),
    split_part(new.email, '@', 1)
  );

  -- Safely convert role string without throwing invalid enum cast exceptions
  raw_role_str := LOWER(COALESCE(new.raw_user_meta_data->>'role', ''));
  IF raw_role_str = 'admin' THEN
    extracted_role := 'admin'::public.user_role;
  ELSIF raw_role_str = 'instructor' THEN
    extracted_role := 'instructor'::public.user_role;
  ELSE
    extracted_role := 'student'::public.user_role;
  END IF;

  -- Insert profile with conflict handling
  INSERT INTO public.profiles (id, full_name, email, role, avatar_url, status)
  VALUES (
    new.id,
    extracted_full_name,
    new.email,
    extracted_role,
    new.raw_user_meta_data->>'avatar_url',
    'active'
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = timezone('utc'::text, now());

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Catch any possible exception to guarantee auth.users signup NEVER fails
  RETURN NEW;
END;
$$;

-- Bind trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions to public schema for anon and authenticated roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;


-- ==============================================================================
-- 9. INITIAL SEED DATA FOR TESTING
-- ==============================================================================

-- Seed Certificates
INSERT INTO public.certificates (certificate_code, student_name, student_email, program_name, status) VALUES
('CC-2026-8921', 'Aarav Sharma', 'aarav@example.com', 'Autonomous Robotics & AI Pro', 'verified'),
('CC-2026-9042', 'Ananya Patel', 'ananya@example.com', 'Generative AI & IoT Studio', 'verified'),
('CC-2026-7419', 'Rohan Verma', 'rohan@example.com', 'Quadcopter Flight & Aerodynamics', 'verified')
ON CONFLICT (certificate_code) DO NOTHING;

-- Seed Blog Posts
INSERT INTO public.blog_posts (title, slug, category, summary, content, read_time, status) VALUES
('Getting Started with MicroPython on ESP32', 'micropython-esp32-setup', 'robotics', 'A beginner-friendly guide to installing MicroPython on ESP32 boards for autonomous rovers.', 'MicroPython makes hardware prototyping easy and fast...', '4 min read', 'published'),
('Prompt Engineering Strategies for Student Developers', 'prompt-engineering-students', 'ai', 'How young innovators can leverage Gemini and ChatGPT to vibe-code interactive web apps.', 'Generative AI is transforming technology education...', '6 min read', 'published')
ON CONFLICT (slug) DO NOTHING;

-- Seed Demo Requests
INSERT INTO public.demo_requests (full_name, email, phone, institution_name, program_interest, level, class_course, message) VALUES
('Vikram Mehta', 'vikram@stxaviers.edu', '+91 98765 43210', 'St. Xaviers High School', 'Bot Barracks Robotics Lab', 'school', 'Grade 8-10', 'Interested in setting up a robotics lab cohort for grade 8-10 students.');

-- Seed Payments
INSERT INTO public.payments (transaction_id, payer_name, payer_email, amount, program_name, status) VALUES
('TXN-8849201', 'Aarav Sharma', 'aarav@example.com', 4999.00, 'Autonomous Robotics Cohort', 'completed'),
('TXN-8849202', 'Ananya Patel', 'ananya@example.com', 3499.00, 'AI Studio Workshop', 'completed')
ON CONFLICT (transaction_id) DO NOTHING;

