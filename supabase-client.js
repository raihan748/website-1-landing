/**
 * SUPABASE-CLIENT.JS - NEXUS CTF STAGE 1 (LANDING)
 * Real-time state synchronization, encrypted endpoints & secure hash-based admin verification
 */

(function () {
  // Runtime Deobfuscation Helper (XOR + Base64)
  function _nxDec(b64, k = 0x5a) {
    try {
      const raw = atob(b64);
      let res = '';
      for (let i = 0; i < raw.length; i++) {
        res += String.fromCharCode(raw.charCodeAt(i) ^ (k + (i % 7)));
      }
      return res;
    } catch (e) {
      return '';
    }
  }

  // SHA-256 Helper (Web Crypto API)
  async function _sha256(text) {
    try {
      const msgBuffer = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return '';
    }
  }

  // Encrypted Supabase Configuration
  const _E_URL = "Mi8oLS1lT3UhJi0wLg09MyY2Py4XKjAsNSgvGnQoKS0/PQEpPnI+MQ==";
  const _E_KEY = "KTkDLSs9DDMoNDw8MwUFCQUCOwARbA4VBwgoEmgyZGUfPSIcGgNwPRMkCDwJMw==";

  // SHA-256 Hash of Administrator Secret Key
  const _ADMIN_HASH = "3721288bf35e73e380946957b491c4a80d827ff1b8338421e8008f4734cf93e1";

  window.CTF_BACKEND = {
    get client() {
      if (!this._client && window.supabase) {
        const u = _nxDec(_E_URL);
        const k = _nxDec(_E_KEY);
        this._client = window.supabase.createClient(u, k);
      }
      return this._client;
    },

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

    // Check if Current User is Admin via Hash Comparison
    async isAdmin() {
      const urlParams = new URLSearchParams(window.location.search);
      const inputSecret = urlParams.get("admin") || localStorage.getItem("nexus_admin_token");
      if (!inputSecret) return false;

      const inputHash = await _sha256(inputSecret.trim());
      const isValid = (inputHash === _ADMIN_HASH);
      if (isValid) {
        localStorage.setItem("nexus_admin_token", inputSecret.trim());
      }
      return isValid;
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
        console.error("Error fetching state:", error);
        return null;
      }
      return data;
    },

    // Admin Trigger: Start Competition (Free Students)
    async startCompetition() {
      const isAuth = await this.isAdmin();
      if (!isAuth) return { success: false, error: "Unauthorized" };

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

    // Admin Trigger: Reset Session for Next Day
    async resetSession(newTitle = "Sesi Putri 9B") {
      const isAuth = await this.isAdmin();
      if (!isAuth) return { success: false, error: "Unauthorized" };

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

        if (stateErr) return { success: false, error: stateErr.message };

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
})();
