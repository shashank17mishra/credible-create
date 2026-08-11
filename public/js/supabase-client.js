/* ==========================================================================
   CREDIBLE CREATE — SUPABASE JS CLIENT & API UTILITIES
   ========================================================================== */

let _supabaseClient = null;

function getSupabaseClient() {
  if (!_supabaseClient && window.supabase) {
    const url = window.APP_CONFIG?.SUPABASE_URL || '';
    const key = window.APP_CONFIG?.SUPABASE_ANON_KEY || '';
    if (url && key) {
      _supabaseClient = window.supabase.createClient(url, key);
    }
  }
  return _supabaseClient;
}

const db = {
  get client() {
    return getSupabaseClient();
  },

  // ------------------------------------------------------------------------
  // AUTHENTICATION UTILITIES
  // ------------------------------------------------------------------------
  async signUp(email, password, metadata = {}) {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase Client is not configured. Please check SUPABASE_URL and SUPABASE_ANON_KEY.");
    const fullName = metadata.full_name || email.split('@')[0];
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: metadata.role || 'student'
        }
      }
    });
    if (error) throw error;
    return data;
  },

  async signIn(email, password) {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase Client is not configured.");
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signInWithGoogle() {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase Client is not configured. Please check SUPABASE_URL and SUPABASE_ANON_KEY.");
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  async signInWithGithub() {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase Client is not configured. Please check SUPABASE_URL and SUPABASE_ANON_KEY.");
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(email) {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase Client is not configured. Please check SUPABASE_URL and SUPABASE_ANON_KEY.");
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/index.html`
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const client = getSupabaseClient();
    if (!client) return;
    const { error } = await client.auth.signOut();
    if (error) throw error;
    window.location.href = '/admin/login.html';
  },

  async getCurrentUser() {
    const client = getSupabaseClient();
    if (!client) return null;
    try {
      const { data: { user } } = await client.auth.getUser();
      return user;
    } catch (e) {
      return null;
    }
  },

  // ------------------------------------------------------------------------
  // CERTIFICATES API
  // ------------------------------------------------------------------------
  async verifyCertificate(code) {
    const client = getSupabaseClient();
    if (!client) return null;
    const { data, error } = await client
      .from('certificates')
      .select('*')
      .eq('certificate_code', code.trim())
      .single();
    if (error) return null;
    return data;
  },

  async getCertificates() {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createCertificate(certData) {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase not initialized");
    const { data, error } = await client
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
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase not initialized");
    const { data, error } = await client
      .from('demo_requests')
      .insert([requestData])
      .select();
    if (error) throw error;
    return data[0];
  },

  async getDemoRequests() {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
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
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getAllPosts() {
    const client = getSupabaseClient();
    if (!client) return [];
    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async createPost(postData) {
    const client = getSupabaseClient();
    if (!client) throw new Error("Supabase not initialized");
    const { data, error } = await client
      .from('blog_posts')
      .insert([postData])
      .select();
    if (error) throw error;
    return data[0];
  }
};

window.CredibleDB = db;

