/**
 * ====================================================================
 * SCRIPT.JS - NEXUS CYBER CTF ENGINE
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. WEB AUDIO SYNTHESIZER (SOFT AMBIENT TONES)
  let sfxEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playTone(freq, type = 'sine', duration = 0.06, gainVal = 0.03, decay = true) {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      if (decay) {
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      }

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playKeyClick() {
    playTone(800 + Math.random() * 200, 'sine', 0.015, 0.02);
  }

  function playLaserSweep() {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {}
  }

  function playCyberChord() {
    const freqs = [440, 554.37, 659.25];
    freqs.forEach((f, i) => {
      setTimeout(() => playTone(f, 'sine', 0.15, 0.02), i * 40);
    });
  }

  // Sound Toggle
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      sfxEnabled = !sfxEnabled;
      if (sfxEnabled) {
        soundIcon.textContent = '🔊';
        soundLabel.textContent = 'SFX: ON';
        playCyberChord();
      } else {
        soundIcon.textContent = '🔇';
        soundLabel.textContent = 'SFX: OFF';
      }
    });
  }

  // 2. THEME SWITCHER
  const themeButtons = document.querySelectorAll('.theme-btn');
  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      themeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const selectedTheme = btn.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', selectedTheme);
      playLaserSweep();
    });
  });

  // 3. LIVE UTC CLOCK & PING COUNTER
  const liveUtcClock = document.getElementById('liveUtcClock');
  const pingCounter = document.getElementById('pingCounter');

  function updateClock() {
    if (!liveUtcClock) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    liveUtcClock.textContent = `UTC ${utcHours}:${utcMinutes}:${utcSeconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  if (pingCounter) {
    setInterval(() => {
      const ping = Math.floor(Math.random() * 6) + 11;
      pingCounter.textContent = `PING: ${ping}ms`;
    }, 3500);
  }

  // 4. SUBTLE CURSOR
  const cursor = document.getElementById('cyberCursor');
  const cursorDot = document.getElementById('cursorDot');

  if (cursor && cursorDot) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.25;
      cursorY += (mouseY - cursorY) * 0.25;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    document.querySelectorAll('a, button, input, .helper-header, .tab-btn').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });
  }

  // 5. 3D PARALLAX TILT (GENTLE)
  const heroCard = document.getElementById('heroCard');
  if (window.innerWidth > 768 && heroCard) {
    document.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 6;
      const y = (e.clientY / innerHeight - 0.5) * 6;
      heroCard.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    document.addEventListener('mouseleave', () => {
      heroCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
  }

  // 6. MULTI-TAB CIPHER TESTING TOOLKIT
  const toggleHelperBtn = document.getElementById('toggleHelperBtn');
  const helperBody = document.getElementById('helperBody');
  const helperArrow = document.getElementById('helperArrow');

  if (toggleHelperBtn && helperBody && helperArrow) {
    toggleHelperBtn.addEventListener('click', () => {
      const isOpen = helperBody.style.display === 'block';
      helperBody.style.display = isOpen ? 'none' : 'block';
      helperArrow.classList.toggle('open', !isOpen);
      playKeyClick();
    });
  }

  // Tab Switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
      playKeyClick();
    });
  });

  // TAB 1: Binary Decoder
  const binInput = document.getElementById('binInput');
  const binDecodeBtn = document.getElementById('binDecodeBtn');
  const binOutput = document.getElementById('binOutput');

  if (binDecodeBtn) {
    binDecodeBtn.addEventListener('click', () => {
      playKeyClick();
      try {
        const cleaned = binInput.value.trim().split(/\s+/);
        const text = cleaned.map(b => String.fromCharCode(parseInt(b, 2))).join('');
        binOutput.textContent = text || 'N/A';
      } catch (e) {
        binOutput.textContent = 'Error parsing binary';
      }
    });
  }

  // TAB 2: Hex Decoder
  const hexInput = document.getElementById('hexInput');
  const hexDecodeBtn = document.getElementById('hexDecodeBtn');
  const hexOutput = document.getElementById('hexOutput');

  if (hexDecodeBtn) {
    hexDecodeBtn.addEventListener('click', () => {
      playKeyClick();
      try {
        let raw = hexInput.value.trim().replace(/^0x/i, '');
        let str = '';
        for (let i = 0; i < raw.length; i += 2) {
          str += String.fromCharCode(parseInt(raw.substr(i, 2), 16));
        }
        hexOutput.textContent = str || 'N/A';
      } catch (e) {
        hexOutput.textContent = 'Error parsing hex';
      }
    });
  }

  // TAB 3: Caesar Shifter
  const rotInput = document.getElementById('rotInput');
  const rotShift = document.getElementById('rotShift');
  const rotDecodeBtn = document.getElementById('rotDecodeBtn');
  const rotOutput = document.getElementById('rotOutput');

  if (rotDecodeBtn) {
    rotDecodeBtn.addEventListener('click', () => {
      playKeyClick();
      try {
        const text = rotInput.value;
        const shift = parseInt(rotShift.value) || 0;
        const shifted = text.split('').map(char => {
          const code = char.charCodeAt(0);
          if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
          }
          if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
          }
          return char;
        }).join('');
        rotOutput.textContent = shifted;
      } catch (e) {
        rotOutput.textContent = 'Error shifting';
      }
    });
  }

  // TAB 4: Checksum Math
  const sumBase = document.getElementById('sumBase');
  const sumMult = document.getElementById('sumMult');
  const sumCalcBtn = document.getElementById('sumCalcBtn');
  const sumOutput = document.getElementById('sumOutput');

  if (sumCalcBtn) {
    sumCalcBtn.addEventListener('click', () => {
      playKeyClick();
      const base = parseFloat(sumBase.value) || 0;
      const mult = parseFloat(sumMult.value) || 0;
      sumOutput.textContent = (base * mult).toString();
    });
  }

  // 7. AMBIENT PARTICLE CONSTELLATION CANVAS
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = Math.min(50, Math.floor((width * height) / 22000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 1.0
      });
    }

    const ripples = [];
    window.addEventListener('click', (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 120,
        opacity: 0.4
      });
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(96, 165, 250, 0.35)' : 'rgba(148, 163, 184, 0.25)';
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      // Update & Draw Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 3.0;
        rip.opacity -= 0.015;

        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(96, 165, 250, ${rip.opacity})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  // 8. SUPABASE REALTIME LOBBY & ADMIN TRIGGER ENGINE
  const dlBtn = document.getElementById('dlBtn');
  const dlBtnText = document.getElementById('dlBtnText');
  const lobbyNotice = document.getElementById('lobbyNotice');
  const lobbyStatusText = document.getElementById('lobbyStatusText');
  const adminDock = document.getElementById('adminDock');
  const adminStartBtn = document.getElementById('adminStartBtn');
  const adminResetBtn = document.getElementById('adminResetBtn');
  const adminSessionLabel = document.getElementById('adminSessionLabel');
  const adminSessionTypeBadge = document.getElementById('adminSessionTypeBadge');
  const adminSwitchSessionBtn = document.getElementById('adminSwitchSessionBtn');
  const adminTotalStudents = document.getElementById('adminTotalStudents');
  const toggleAdminDockBtn = document.getElementById('toggleAdminDockBtn');
  const adminDockBody = document.getElementById('adminDockBody');
  const adminRefreshRosterBtn = document.getElementById('adminRefreshRosterBtn');

  const ALL_CLASSES = [
    '7A', '7B', '7C', '8A', '8B', '9A', '9B',
    '7D', '7E', '7F', '8C', '8D', '8E', '8F', '9C', '9D', '9E', '9F'
  ];

  async function updateClassRosterCounts() {
    if (!window.CTF_BACKEND) return;
    const data = await window.CTF_BACKEND.fetchClassCounts();
    if (!data) return;

    if (adminTotalStudents) {
      adminTotalStudents.textContent = `${data.total} SISWA`;
    }

    ALL_CLASSES.forEach(cls => {
      const countEl = document.getElementById('count-' + cls);
      const cardEl = document.getElementById('card-' + cls);
      const count = data[cls] || 0;

      if (countEl) countEl.textContent = count;
      if (cardEl) {
        if (count > 0) {
          cardEl.classList.add('has-students');
        } else {
          cardEl.classList.remove('has-students');
        }
      }
    });
  }

  // Toggle Minimize / Expand Admin Dock
  if (toggleAdminDockBtn && adminDockBody) {
    toggleAdminDockBtn.addEventListener('click', () => {
      playKeyClick();
      const isCollapsed = adminDockBody.style.display === 'none';
      adminDockBody.style.display = isCollapsed ? 'flex' : 'none';
      toggleAdminDockBtn.textContent = isCollapsed ? '−' : '+';
      toggleAdminDockBtn.title = isCollapsed ? 'Minimize Box' : 'Expand Box';
    });
  }

  function updateLobbyUI(state) {
    if (!state) return;

    const sessionType = window.CTF_BACKEND ? window.CTF_BACKEND.getSessionType(state) : 'ikhwan';
    const isAkhwat = sessionType === 'akhwat';

    if (adminSessionLabel) {
      adminSessionLabel.textContent = `SESI: ${state.session_title || (isAkhwat ? 'Sesi Putri' : 'Sesi Putra')}`;
    }

    if (adminSessionTypeBadge) {
      if (isAkhwat) {
        adminSessionTypeBadge.textContent = '👧 AKHWAT';
        adminSessionTypeBadge.className = 'admin-session-badge akhwat';
      } else {
        adminSessionTypeBadge.textContent = '👦 IKHWAN';
        adminSessionTypeBadge.className = 'admin-session-badge';
      }
    }

    if (adminSwitchSessionBtn) {
      if (isAkhwat) {
        adminSwitchSessionBtn.innerHTML = '🔀 SWITCH KE SESI IKHWAN';
        adminSwitchSessionBtn.style.borderColor = 'rgba(0, 240, 255, 0.4)';
        adminSwitchSessionBtn.style.color = '#00f0ff';
      } else {
        adminSwitchSessionBtn.innerHTML = '🔀 SWITCH KE SESI AKHWAT';
        adminSwitchSessionBtn.style.borderColor = 'rgba(236, 72, 153, 0.4)';
        adminSwitchSessionBtn.style.color = '#f472b6';
      }
    }

    // Toggle Class Grids based on Active Session
    const gIkhwan = document.getElementById('gridIkhwan');
    const gAkhwat = document.getElementById('gridAkhwat');
    if (gIkhwan && gAkhwat) {
      if (isAkhwat) {
        gIkhwan.style.display = 'none';
        gAkhwat.style.display = 'flex';
      } else {
        gIkhwan.style.display = 'flex';
        gAkhwat.style.display = 'none';
      }
    }

    // Update Download Target File
    const targetChallengeFile = isAkhwat ? 'challenge-akhwat.html' : 'challenge.html';
    const targetChallengeLabel = isAkhwat ? 'DOWNLOAD CHALLENGE (AKHWAT)' : 'DOWNLOAD CHALLENGE.HTML';

    if (dlBtn) {
      dlBtn.setAttribute('href', targetChallengeFile);
      dlBtn.setAttribute('download', targetChallengeFile);
    }

    if (state.is_started) {
      // Free / Unlocked state
      if (dlBtn) {
        dlBtn.classList.remove('disabled');
        dlBtn.style.pointerEvents = 'auto';
        dlBtn.removeAttribute('tabindex');
      }
      if (dlBtnText) {
        dlBtnText.textContent = targetChallengeLabel;
      }
      if (lobbyNotice) {
        lobbyNotice.className = 'lobby-notice active';
      }
      if (lobbyStatusText) {
        lobbyStatusText.textContent = 'STATUS: KOMPETISI TELAH DIMULAI! SILAKAN UNDUH';
      }
      if (adminStartBtn) {
        adminStartBtn.textContent = '✅ KOMPETISI SEDANG BERJALAN';
        adminStartBtn.style.background = '#059669';
      }
    } else {
      // Locked / Waiting state
      if (dlBtn) {
        dlBtn.classList.add('disabled');
        dlBtn.style.pointerEvents = 'none';
      }
      if (dlBtnText) {
        dlBtnText.textContent = 'TERKUNCI (MENUNGGU GURU)';
      }
      if (lobbyNotice) {
        lobbyNotice.className = 'lobby-notice locked';
      }
      if (lobbyStatusText) {
        lobbyStatusText.textContent = 'STATUS: MENUNGGU SINYAL MULAI DARI GURU...';
      }
      if (adminStartBtn) {
        adminStartBtn.textContent = '⚡ START COMPETITION (RELEASE SISWA)';
        adminStartBtn.style.background = '#10b981';
      }
    }
  }

  // =========================================================================
  // IP BAN ENFORCEMENT & 1-WEEK LIVE STOPWATCH (WEBSITE 1)
  // =========================================================================
  const bannedOverlay = document.getElementById('bannedOverlay');
  const bannedReason = document.getElementById('bannedReason');
  const bannedExpiry = document.getElementById('bannedExpiry');
  const bannedStopwatch = document.getElementById('bannedStopwatch');
  let stopwatchInterval = null;

  function startLiveStopwatch(expiryIso) {
    if (stopwatchInterval) clearInterval(stopwatchInterval);

    const targetDate = expiryIso ? new Date(expiryIso) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    if (bannedExpiry) {
      bannedExpiry.textContent = "Berlaku hingga: " + targetDate.toLocaleString('id-ID');
    }

    function tick() {
      const now = Date.now();
      const diff = Math.max(0, targetDate.getTime() - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      if (bannedStopwatch) {
        bannedStopwatch.textContent = `${days} Hari, ${hours} Jam, ${minutes} Menit, ${seconds} Detik`;
      }
    }

    tick();
    stopwatchInterval = setInterval(tick, 1000);
  }

  function showBannedScreen(reason = null, expiry = null) {
    if (classModal) classModal.style.display = 'none';
    if (bannedOverlay) {
      bannedOverlay.style.display = 'flex';
      if (bannedReason && reason) {
        bannedReason.textContent = reason;
      }
      startLiveStopwatch(expiry);
    }
  }

  function hideBannedScreen() {
    if (stopwatchInterval) clearInterval(stopwatchInterval);
    if (bannedOverlay) {
      bannedOverlay.style.display = 'none';
    }
  }

  // Initialize Backend Connection
  if (window.CTF_BACKEND) {
    let isUserAdmin = false;

    // 1. Check if Admin asynchronously via SHA-256
    window.CTF_BACKEND.isAdmin().then(isAdminUser => {
      isUserAdmin = isAdminUser;
      if (isAdminUser && adminDock) {
        adminDock.style.display = 'block';
        updateClassRosterCounts();
      }
    });

    // 2. Scan Visitor IP and enforce 1-Week Ban Status
    window.CTF_BACKEND.scanVisitor().then(res => {
      if (res && res.banned && !isUserAdmin) {
        showBannedScreen(res.ban_reason, res.banned_until);
      }
    });

    // 3. Fetch Initial State
    window.CTF_BACKEND.fetchState().then(state => {
      updateLobbyUI(state);
      if (state && state.ban_triggered_at && !isUserAdmin) {
        const banExp = new Date(new Date(state.ban_triggered_at).getTime() + 7 * 24 * 60 * 60 * 1000);
        if (Date.now() < banExp.getTime()) {
          showBannedScreen(
            "Sesi kompetisi ini telah selesai dan hadiah Gemini Pro telah diklaim. Akses Anda telah di-ban selama 1 minggu di Website 1 (Portal) & Website 2 (Gateway).",
            banExp.toISOString()
          );
        }
      } else if (state && !state.ban_triggered_at) {
        hideBannedScreen();
      }
    });

    // 4. Realtime Listener for State, Participants, and Bans
    window.CTF_BACKEND.subscribeToState(
      newState => {
        updateLobbyUI(newState);
        playLaserSweep();
        if (newState && newState.ban_triggered_at && !isUserAdmin) {
          const banExp = new Date(new Date(newState.ban_triggered_at).getTime() + 7 * 24 * 60 * 60 * 1000);
          if (Date.now() < banExp.getTime()) {
            showBannedScreen(
              "Sesi kompetisi ini telah selesai dan hadiah Gemini Pro telah diklaim. Akses Anda telah di-ban selama 1 minggu di Website 1 (Portal) & Website 2 (Gateway).",
              banExp.toISOString()
            );
          }
        } else if (newState && !newState.ban_triggered_at) {
          // Admin me-reset sesi -> Buka kembali akses
          hideBannedScreen();
        }
      },
      (participantPayload) => {
        // Participant updated/registered
        updateClassRosterCounts();
        if (participantPayload && participantPayload.new && !isUserAdmin) {
          const record = participantPayload.new;
          window.CTF_BACKEND.getClientIP().then(myIp => {
            if (record.ip_address === myIp) {
              if (record.is_banned) {
                showBannedScreen(record.ban_reason, record.banned_until);
              } else {
                hideBannedScreen();
              }
            }
          });
        }
      }
    );

    // Switch Session Button Action
    if (adminSwitchSessionBtn) {
      adminSwitchSessionBtn.addEventListener('click', async () => {
        playKeyClick();
        const currentState = await window.CTF_BACKEND.fetchState();
        const currentType = window.CTF_BACKEND.getSessionType(currentState);
        const targetType = currentType === 'ikhwan' ? 'akhwat' : 'ikhwan';
        const targetLabel = targetType === 'akhwat' ? 'AKHWAT (PUTRI)' : 'IKHWAN (PUTRA)';

        const confirmSwitch = confirm(
          `Apakah Anda yakin ingin switch ke ${targetLabel}?\n\n` +
          `Sistem akan mengalihkan daftar kelas, mengubah file challenge, dan mereset status ban untuk sesi ${targetLabel}.`
        );
        if (!confirmSwitch) return;

        adminSwitchSessionBtn.disabled = true;
        adminSwitchSessionBtn.textContent = '⏳ Mengalihkan Sesi...';
        const res = await window.CTF_BACKEND.switchSession(targetType);
        adminSwitchSessionBtn.disabled = false;

        if (res.success) {
          playCyberChord();
          hideBannedScreen();
          alert(`✅ Berhasil beralih ke ${targetLabel}!\nLobby sekarang aktif untuk ${targetLabel}.`);
          updateLobbyUI({ ...currentState, session_title: res.session_title, is_started: false, ban_triggered_at: null });
          updateClassRosterCounts();
        } else {
          alert('Gagal switch sesi: ' + (res.error || 'Terjadi kesalahan'));
        }
      });
    }

    // Refresh Roster Button
    if (adminRefreshRosterBtn) {
      adminRefreshRosterBtn.addEventListener('click', () => {
        playKeyClick();
        updateClassRosterCounts();
      });
    }

    // Admin Seal Token Action
    const adminSealBtn = document.getElementById('adminSealBtn');
    if (adminSealBtn) {
      adminSealBtn.addEventListener('click', () => {
        playKeyClick();
        if (confirm('Apakah Anda ingin keluar dari mode Admin dan mengunci kembali token sesi ini?')) {
          window.CTF_BACKEND.sealAdmin();
        }
      });
    }

    // Admin Start Action
    if (adminStartBtn) {
      adminStartBtn.addEventListener('click', async () => {
        playKeyClick();
        adminStartBtn.disabled = true;
        adminStartBtn.textContent = '⏳ Memproses Start...';
        const res = await window.CTF_BACKEND.startCompetition();
        adminStartBtn.disabled = false;
        if (res.success) {
          playCyberChord();
          alert('🚀 Sukses! Tantangan Stage 1 telah dibuka untuk seluruh siswa!');
        } else {
          alert('Gagal memulai: ' + (res.error || 'Unknown error'));
        }
      });
    }

    // Admin Reset Action
    if (adminResetBtn) {
      adminResetBtn.addEventListener('click', async () => {
        const confirmReset = confirm('Apakah Anda yakin ingin me-reset sesi (membuka ban dan mengunci kembali lobby untuk sesi berikutnya)?');
        if (!confirmReset) return;

        const newTitle = prompt('Masukkan Judul Sesi Baru:', 'Sesi Putra 9B') || 'Sesi Putra 9B';
        adminResetBtn.disabled = true;
        const res = await window.CTF_BACKEND.resetSession(newTitle);
        adminResetBtn.disabled = false;
        if (res.success) {
          hideBannedScreen();
          alert('✅ Sesi berhasil di-reset menjadi: ' + newTitle + '. Seluruh Ban telah diangkat!');
          updateClassRosterCounts();
        } else {
          alert('Gagal reset: ' + (res.error || 'Kunci Admin salah'));
        }
      });
    }
  }

  // =========================================================================
  // MANDATORY STUDENT CLASS SELECTION MODAL
  // =========================================================================
  const classModal = document.getElementById('classModal');
  const tabIkhwan = document.getElementById('tabIkhwan');
  const tabAkhwat = document.getElementById('tabAkhwat');
  const gridIkhwan = document.getElementById('gridIkhwan');
  const gridAkhwat = document.getElementById('gridAkhwat');
  const selectedClassBadge = document.getElementById('selectedClassBadge');
  const confirmClassBtn = document.getElementById('confirmClassBtn');
  const userClassBadge = document.getElementById('userClassBadge');

  let currentSelectedClass = localStorage.getItem('nexus_student_class') || null;

  function updateClassBadgeUI(cls) {
    if (userClassBadge && cls) {
      userClassBadge.textContent = `KELAS: ${cls}`;
      userClassBadge.style.display = 'inline-flex';
    }
  }

  if (currentSelectedClass) {
    updateClassBadgeUI(currentSelectedClass);
    if (window.CTF_BACKEND) {
      window.CTF_BACKEND.registerStudentClass(currentSelectedClass);
    }
  } else {
    // Show modal if not selected yet
    if (classModal) {
      classModal.style.display = 'flex';
    }
  }

  // Toggle Tabs (Ikhwan / Akhwat)
  if (tabIkhwan && tabAkhwat) {
    tabIkhwan.addEventListener('click', () => {
      playKeyClick();
      tabIkhwan.classList.add('active');
      tabAkhwat.classList.remove('active');
      if (gridIkhwan) gridIkhwan.style.display = 'flex';
      if (gridAkhwat) gridAkhwat.style.display = 'none';
    });

    tabAkhwat.addEventListener('click', () => {
      playKeyClick();
      tabAkhwat.classList.add('active');
      tabIkhwan.classList.remove('active');
      if (gridAkhwat) gridAkhwat.style.display = 'flex';
      if (gridIkhwan) gridIkhwan.style.display = 'none';
    });
  }

  // Class Buttons Selection
  const allClassBtns = document.querySelectorAll('.class-btn');
  allClassBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playKeyClick();
      allClassBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const cls = btn.getAttribute('data-class');
      currentSelectedClass = cls;
      if (selectedClassBadge) {
        selectedClassBadge.textContent = cls;
      }
      if (confirmClassBtn) {
        confirmClassBtn.disabled = false;
      }
    });
  });

  // Confirm Class Button
  if (confirmClassBtn) {
    confirmClassBtn.addEventListener('click', () => {
      if (!currentSelectedClass) return;
      playCyberChord();
      localStorage.setItem('nexus_student_class', currentSelectedClass);
      updateClassBadgeUI(currentSelectedClass);

      if (window.CTF_BACKEND) {
        window.CTF_BACKEND.registerStudentClass(currentSelectedClass);
      }

      if (classModal) {
        classModal.style.display = 'none';
      }
    });
  }

  // Allow clicking badge to change class if needed before competition
  if (userClassBadge) {
    userClassBadge.addEventListener('click', () => {
      if (classModal) {
        classModal.style.display = 'flex';
      }
    });
  }
});
