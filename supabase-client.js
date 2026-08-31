/**
 * SUPABASE-CLIENT.JS - NEXUS CTF STAGE 1 (LANDING)
 * Real-time state synchronization, admin trigger & lobby management
 */

const SUPABASE_URL = "https://zzpnqmghzkaqwpkphvpz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_RY_e_q6UIZVwr2i88AbBFA_-cLDRgUn";
const DEFAULT_ADMIN_SECRET = "NEXUS_ADMIN_2026";

function initSupabase() {
  if (window.supabase && !window.CTF_BACKEND?.client) {
    return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return null;
}

window.CTF_BACKEND = {
  get client() {
    if (!this._client && window.supabase) {
      this._client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return this._client;
  },
  adminSecret: DEFAULT_ADMIN_SECRET,

  // Get Current Client Public IP Address
  async getClientIP() {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip || "127.0.0.1";
    } catch (e) {
      return "127.0.0.1";
    }
  },

  // Check if Current User is Admin (via URL Query Param ?admin=... or local storage)
  isAdmin() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get("admin") || localStorage.getItem("nexus_admin_token");
    return adminParam === this.adminSecret;
  },

  // Fetch Current CTF State
  async fetchState() {
    const sb = this.client;
    if (!sb) return null;
    const { data, error } = await sb
      .from("ctf_state")
      .select("*")
      .eq("id", 1)
      .single();
    if (error) {
      console.error("Error fetching ctf_state:", error);
      return null;
    }
    return data;
  },

  // Admin Trigger: Start Competition (Free Students)
  async startCompetition() {
    const sb = this.client;
    if (!sb) return { success: false, error: "No DB connection" };
    const { data, error } = await sb
      .from("ctf_state")
      .update({ is_started: true, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select()
      .single();
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  // Admin Trigger: Reset Session for Next Day (Unban all & close lobby)
  async resetSession(newTitle = "Sesi Putri 9B") {
    const sb = this.client;
    if (!sb) return { success: false, error: "No DB connection" };

    try {
      // 1. Reset CTF State
      const { error: stateErr } = await sb
        .from("ctf_state")
        .update({
          is_started: false,
          winner_name: null,
          winner_ip: null,
          winner_claimed: false,
          ban_triggered_at: null,
          session_title: newTitle,
          updated_at: new Date().toISOString()
        })
        .eq("id", 1);

      if (stateErr) {
        console.error("Error resetting state:", stateErr);
        return { success: false, error: stateErr.message };
      }

      // 2. Unban All Participants
      await sb
        .from("ctf_participants")
        .update({
          is_banned: false,
          banned_until: null,
          ban_reason: null,
          is_winner: false
        })
        .neq("ip_address", "PLACEHOLDER_NEVER_MATCH");

      return { success: true, session: newTitle };
    } catch (err) {
      return { success: false, error: err.message };
    }
  },

  // Subscribe to Realtime Updates
  subscribeToState(callback) {
    const sb = this.client;
    if (!sb) return null;
    const channel = sb
      .channel("public:ctf_state_stage1")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ctf_state", filter: "id=eq.1" },
        (payload) => {
          if (callback) callback(payload.new);
        }
      )
      .subscribe();
    return channel;
  }
};
