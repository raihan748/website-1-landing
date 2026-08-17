/**
 * ====================================================================
 * SCRIPT.JS - NEXUS CYBER CTF 100.000x GAME ENGINE v6.0
 * ====================================================================
 * Features:
 * 1. 3D Gravitational Particle Constellation & Shockwave Ripple Canvas
 * 2. Polyphonic Web Audio API Synthesizer (Chords, sweeps & clicks)
 * 3. 3-State Dynamic Theme Engine (Cyber / Matrix / Synth)
 * 4. Specular Card Glare & 3D Magnetic Parallax Tilt
 * 5. Interactive Multi-Tab Cipher Testing Toolkit
 * 6. Live UTC Clock & Dynamic Latency Ping Monitor
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. POLYPHONIC WEB AUDIO SYNTHESIZER
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

  function playTone(freq, type = 'sine', duration = 0.08, gainVal = 0.12, decay = true) {
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
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      }

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playKeyClick() {
    playTone(1300 + Math.random() * 500, 'triangle', 0.02, 0.08);
  }

  function playLaserSweep() {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playCyberChord() {
    const freqs = [440, 554.37, 659.25, 880];
    freqs.forEach((f, i) => {
      setTimeout(() => playTone(f, 'sine', 0.2, 0.08), i * 35);
    });
  }

  // Sound Toggle
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');

  soundToggleBtn.addEventListener('click', () => {
    initAudio();
    sfxEnabled = !sfxEnabled;
    if (sfxEnabled) {
      soundIcon.textContent = '🔊';
      soundLabel.textContent = 'SFX: ON';
      soundToggleBtn.style.borderColor = 'var(--cyan-pop)';
      playCyberChord();
    } else {
      soundIcon.textContent = '🔇';
      soundLabel.textContent = 'SFX: OFF';
      soundToggleBtn.style.borderColor = '#555';
    }
  });

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
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, '0');
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, '0');
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, '0');
    liveUtcClock.textContent = `UTC ${utcHours}:${utcMinutes}:${utcSeconds}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  setInterval(() => {
    const ping = Math.floor(Math.random() * 6) + 11;
    pingCounter.textContent = `PING: ${ping}ms`;
  }, 3500);

  // 4. CUSTOM CYBER CURSOR
  const cursor = document.getElementById('cyberCursor');
  const cursorDot = document.getElementById('cursorDot');

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
    cursorX += (mouseX - cursorX) * 0.22;
    cursorY += (mouseY - cursorY) * 0.22;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  document.querySelectorAll('a, button, input, .helper-header, .tab-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      playTone(1200, 'sine', 0.02, 0.03);
    });
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });

  // 5. 3D SPECULAR GLARE & PARALLAX TILT
  const heroCard = document.getElementById('heroCard');
  const cardGlare = document.getElementById('cardGlare');

  if (window.innerWidth > 768 && heroCard) {
    document.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 14;
      const y = (e.clientY / innerHeight - 0.5) * 14;
      heroCard.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;

      const rect = heroCard.getBoundingClientRect();
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      heroCard.style.setProperty('--glare-x', `${glareX}%`);
      heroCard.style.setProperty('--glare-y', `${glareY}%`);
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

  // TAB 2: Hex Decoder
  const hexInput = document.getElementById('hexInput');
  const hexDecodeBtn = document.getElementById('hexDecodeBtn');
  const hexOutput = document.getElementById('hexOutput');

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

  // TAB 3: Caesar Shifter
  const rotInput = document.getElementById('rotInput');
  const rotShift = document.getElementById('rotShift');
  const rotDecodeBtn = document.getElementById('rotDecodeBtn');
  const rotOutput = document.getElementById('rotOutput');

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

  // TAB 4: Checksum Math
  const sumBase = document.getElementById('sumBase');
  const sumMult = document.getElementById('sumMult');
  const sumCalcBtn = document.getElementById('sumCalcBtn');
  const sumOutput = document.getElementById('sumOutput');

  sumCalcBtn.addEventListener('click', () => {
    playKeyClick();
    const base = parseFloat(sumBase.value) || 0;
    const mult = parseFloat(sumMult.value) || 0;
    sumOutput.textContent = (base * mult).toString();
  });

  // 7. 3D PARTICLE CONSTELLATION & SHOCKWAVE CANVAS
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
    const numParticles = Math.min(65, Math.floor((width * height) / 18000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2 + 1.2
      });
    }

    const ripples = [];
    window.addEventListener('click', (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 5,
        maxRadius: 180,
        opacity: 0.9
      });
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Draw Perspective Grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.04)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(0, 240, 255, 0.6)' : 'rgba(255, 0, 122, 0.6)';
        ctx.fill();

        // Connect lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.18 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      // Update & Draw Ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 4.5;
        rip.opacity -= 0.022;

        if (rip.opacity <= 0 || rip.radius >= rip.maxRadius) {
          ripples.splice(r, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 230, 0, ${rip.opacity})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }

      requestAnimationFrame(draw);
    }

    draw();
  }
});
