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

  function updateLobbyUI(state) {
    if (!state) return;

    if (adminSessionLabel) {
      adminSessionLabel.textContent = `SESI: ${state.session_title || 'Sesi 9B'}`;
    }

    if (state.is_started) {
      // Free / Unlocked state
      if (dlBtn) {
        dlBtn.classList.remove('disabled');
        dlBtn.style.pointerEvents = 'auto';
        dlBtn.removeAttribute('tabindex');
      }
      if (dlBtnText) {
        dlBtnText.textContent = 'DOWNLOAD CHALLENGE.HTML';
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

  // Initialize Backend Connection
  if (window.CTF_BACKEND) {
    // Check if Admin
    if (window.CTF_BACKEND.isAdmin() && adminDock) {
      adminDock.style.display = 'block';
    }

    // Fetch Initial State
    window.CTF_BACKEND.fetchState().then(state => {
      updateLobbyUI(state);
    });

    // Realtime Listener
    window.CTF_BACKEND.subscribeToState(newState => {
      updateLobbyUI(newState);
      playLaserSweep();
    });

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

        const newTitle = prompt('Masukkan Judul Sesi Baru:', 'Sesi Putri 9B') || 'Sesi Putri 9B';
        adminResetBtn.disabled = true;
        const res = await window.CTF_BACKEND.resetSession(newTitle);
        adminResetBtn.disabled = false;
        if (res.success) {
          alert('✅ Sesi berhasil di-reset menjadi: ' + newTitle + '. Seluruh IP Ban telah diangkat!');
        } else {
          alert('Gagal reset: ' + (res.error || 'Kunci Admin salah'));
        }
      });
    }
  }
});
