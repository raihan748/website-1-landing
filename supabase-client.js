/**
 * SUPABASE-CLIENT.JS - NEXUS CTF STAGE 1 (LANDING)
 * Encrypted endpoints, SHA-256 Admin verification, Session Sealing & Student Class Registration
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
    cachedIP: null,

    // Get Current Client Public IP Address
    async getClientIP() {
      if (this.cachedIP) return this.cachedIP;
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        this.cachedIP = data.ip || "127.0.0.1";
        return this.cachedIP;
      } catch (e) {
        this.cachedIP = "127.0.0.1";
        return this.cachedIP;
      }
    },

    // Check if Current User is Admin via Hash Comparison
    // Uses URL query or temporary sessionStorage (Seals out persistent localStorage)
    async isAdmin() {
      const urlParams = new URLSearchParams(window.location.search);
      const inputSecret = urlParams.get("admin") || sessionStorage.getItem("nexus_admin_session");
      
      // Clean persistent storage to keep token sealed
      localStorage.removeItem("nexus_admin_token");

      if (!inputSecret) return false;

      const inputHash = await _sha256(inputSecret.trim());
      const isValid = (inputHash === _ADMIN_HASH);
      if (isValid) {
        sessionStorage.setItem("nexus_admin_session", inputSecret.trim());
      } else {
        sessionStorage.removeItem("nexus_admin_session");
      }
      return isValid;
    },

    // Seal Token & Exit Admin Mode
    sealAdmin() {
      sessionStorage.removeItem("nexus_admin_session");
      localStorage.removeItem("nexus_admin_token");
      // Strip ?admin= parameter and reload clean
      window.location.href = window.location.pathname;
    },

    // Register Student Class to IP in Database
    async registerStudentClass(studentClass) {
      if (!studentClass) return;
      localStorage.setItem("nexus_student_class", studentClass);

      const sb = this.client;
      if (!sb) return;

      const ip = await this.getClientIP();
      const ua = `[CLASS:${studentClass}] ` + (navigator.userAgent || "Unknown Device");

      try {
        // Attempt with student_class column
        const { error } = await sb
          .from("ctf_participants")
          .upsert({
            ip_address: ip,
            student_class: studentClass,
            user_agent: ua
          }, { onConflict: "ip_address" });

        if (error) {
          // Fallback if student_class column not added yet
          await sb
            .from("ctf_participants")
            .upsert({
              ip_address: ip,
              user_agent: ua
            }, { onConflict: "ip_address" });
        }
      } catch (err) {
        console.warn("Class registration notice:", err);
      }
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

    // Admin Trigger: Start Competition (Release Students)
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

    // Admin Trigger: Reset Session
    async resetSession(newTitle = "Sesi Putra 9B") {
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

    // Fetch Count of Participants Grouped by Class
    async fetchClassCounts() {
      const sb = this.client;
      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from("ctf_participants")
          .select("ip_address, student_class, user_agent");

        if (error) {
          console.error("Error fetching class counts:", error);
          return null;
        }

        const counts = {
          "7A": 0, "7B": 0, "7C": 0,
          "8A": 0, "8B": 0,
          "9A": 0, "9B": 0,
          "7D": 0, "7E": 0, "7F": 0,
          "8C": 0, "8D": 0, "8E": 0, "8F": 0,
          "9C": 0, "9D": 0, "9E": 0, "9F": 0,
          total: 0
        };

        (data || []).forEach(p => {
          let cls = p.student_class;
          if (!cls && p.user_agent && p.user_agent.includes("[CLASS:")) {
            const m = p.user_agent.match(/\[CLASS:(.*?)\]/);
            if (m && m[1]) cls = m[1];
          }

          if (cls) {
            cls = cls.toUpperCase().trim();
            if (counts[cls] !== undefined) {
              counts[cls]++;
            }
            counts.total++;
          }
        });

        return counts;
      } catch (err) {
        console.error("Class count error:", err);
        return null;
      }
    },

    // Subscribe to Realtime Updates (State & Participants)
    subscribeToState(onStateChange, onParticipantChange) {
      const sb = this.client;
      if (!sb) return null;
      const channel = sb
        .channel("public:ctf_landing_channel")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "ctf_state", filter: "id=eq.1" },
          (payload) => {
            if (onStateChange) onStateChange(payload.new);
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "ctf_participants" },
          (payload) => {
            if (onParticipantChange) onParticipantChange(payload);
          }
        )
        .subscribe();
      return channel;
    }
  };
})();
