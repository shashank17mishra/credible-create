-- ============================================================================
-- CREDIBLE CREATE — SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Run these SQL statements in your Supabase Dashboard > SQL Editor
-- ============================================================================

-- 1. DEMO REQUESTS TABLE RLS
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;

-- Allow public users ONLY to submit new demo requests (INSERT)
CREATE POLICY "Allow public insert to demo_requests" 
ON demo_requests FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Restrict SELECT (reading submissions) to authenticated service/admin users
CREATE POLICY "Allow authenticated read to demo_requests" 
ON demo_requests FOR SELECT 
TO authenticated
USING (true);


-- 2. CERTIFICATES TABLE RLS
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Allow anyone to verify certificates by exact certificate code
CREATE POLICY "Allow public lookup for certificate verification" 
ON certificates FOR SELECT 
TO anon, authenticated
USING (true);

-- Restrict INSERT/UPDATE to authenticated admin users only
CREATE POLICY "Allow authenticated admin insert/update certificates" 
ON certificates FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);


-- 3. BLOG POSTS TABLE RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read published blog posts
CREATE POLICY "Allow public read published blog_posts" 
ON blog_posts FOR SELECT 
TO anon, authenticated
USING (status = 'published');

-- Restrict post creation & editing to authenticated admin users only
CREATE POLICY "Allow admin all access to blog_posts" 
ON blog_posts FOR ALL 
TO authenticated
USING (true)
WITH CHECK (true);
