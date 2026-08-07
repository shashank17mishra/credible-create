/* ==========================================================================
   CREDIBLE CREATE — SUPABASE JS CLIENT & API UTILITIES
   ========================================================================== */

// 1. Configure your Supabase Credentials via window.APP_CONFIG (injected by server)
const SUPABASE_URL = window.APP_CONFIG?.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.APP_CONFIG?.SUPABASE_ANON_KEY || '';

// Initialize Supabase Client instance (loaded via CDN script tag)
let supabaseClient = null;

if (window.supabase && SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const db = {
  client: supabaseClient,

  // ------------------------------------------------------------------------
  // AUTHENTICATION UTILITIES
  // ------------------------------------------------------------------------
  async signIn(email, password) {
    if (!supabaseClient) throw new Error("Supabase Client not configured.");
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!supabaseClient) return;
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    window.location.href = '/admin/login.html';
  },

  async getCurrentUser() {
    if (!supabaseClient) return null;
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  },

  // ------------------------------------------------------------------------
  // CERTIFICATES API
  // ------------------------------------------------------------------------
  async verifyCertificate(code) {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from('certificates')
      .select('*')
      .eq('certificate_code', code.trim())
      .single();
    if (error) return null;
    return data;
  },

  async getCertificates() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createCertificate(certData) {
    if (!supabaseClient) throw new Error("Supabase not initialized");
    const { data, error } = await supabaseClient
      .from('certificates')
      .insert([certData])
      .select();
    if (error) throw error;
    return data[0];
  },

  // ------------------------------------------------------------------------
  // DEMO REQUESTS API
  // ------------------------------------------------------------------------
  async submitDemoRequest(requestData) {
    if (!supabaseClient) throw new Error("Supabase not initialized");
    const { data, error } = await supabaseClient
      .from('demo_requests')
      .insert([requestData])
      .select();
    if (error) throw error;
    return data[0];
  },

  async getDemoRequests() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('demo_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  // ------------------------------------------------------------------------
  // BLOG POSTS API
  // ------------------------------------------------------------------------
  async getPublishedPosts() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getAllPosts() {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createPost(postData) {
    if (!supabaseClient) throw new Error("Supabase not initialized");
    const { data, error } = await supabaseClient
      .from('blog_posts')
      .insert([postData])
      .select();
    if (error) throw error;
    return data[0];
  }
};

window.CredibleDB = db;
