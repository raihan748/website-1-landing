/**
 * ====================================================================
 * SCRIPT.JS - NEXUS CTF 1000x INTERACTIVE GAME ENGINE
 * ====================================================================
 * Features:
 * 1. 3D Cyber Wireframe Grid & Starfield with Shockwave Ripples
 * 2. Cyber Reticle Custom Cursor with Spark Particle Trail
 * 3. 3-State Theme Engine (Cyber / Matrix / Synth)
 * 4. Polyphonic Web Audio API Synthesizer (Chords, sweeps, clicks)
 * 5. Interactive Cipher Testing Console (Live Decoder)
 * 6. 3D Card Tilt Physics & Download Celebration
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
    } catch (e) {
      // Audio fallback
    }
  }

  function playLaserSweep() {
    if (!sfxEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {}
  }

  function playCyberChord() {
    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    chord.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 'triangle', 0.3, 0.08), idx * 60);
    });
  }

  function playBlip() {
    playTone(920 + Math.random() * 200, 'square', 0.03, 0.07);
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

  // Attach hover sounds
  document.querySelectorAll('button, a, .hud-item, .helper-header').forEach(el => {
    el.addEventListener('mouseenter', () => playTone(1200, 'sine', 0.02, 0.05));
  });

  // 2. THEME SWITCHER (CYBER / MATRIX / SYNTH)
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

  // 3. LIVE CLOCK & NODE COUNTER
  const liveClock = document.getElementById('liveClock');
  function updateClock() {
    const now = new Date();
    liveClock.textContent = now.toUTCString().split(' ')[4] + ' UTC';
  }
  setInterval(updateClock, 1000);
  updateClock();

  const agentCounter = document.getElementById('agentCounter');
  setInterval(() => {
    const delta = Math.floor(Math.random() * 5) - 2;
    let curr = parseInt(agentCounter.textContent.replace(/\D/g, '')) || 4096;
    curr = Math.max(4000, Math.min(4200, curr + delta));
    agentCounter.textContent = curr.toLocaleString() + ' NODES';
  }, 2500);

  // 4. CUSTOM CYBER CURSOR WITH SPARK TRAIL
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

  document.querySelectorAll('a, button, input, .helper-header').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });

  // 5. 3D CARD TILT PHYSICS
  const heroCard = document.getElementById('heroCard');
  if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 16;
      heroCard.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    });

    document.addEventListener('mouseleave', () => {
      heroCard.style.transform = `rotateY(0deg) rotateX(0deg)`;
    });
  }

  // 6. INTERACTIVE CIPHER HELPER DRAWER
  const toggleHelperBtn = document.getElementById('toggleHelperBtn');
  const helperBody = document.getElementById('helperBody');
  const helperArrow = document.getElementById('helperArrow');

  toggleHelperBtn.addEventListener('click', () => {
    const isHidden = helperBody.style.display === 'none' || !helperBody.style.display;
    helperBody.style.display = isHidden ? 'block' : 'none';
    helperArrow.classList.toggle('open', isHidden);
    playBlip();
  });

  // Binary Decoder in Helper
  const binInput = document.getElementById('binInput');
  const binBtn = document.getElementById('binBtn');
  const binOutput = document.getElementById('binOutput');

  binBtn.addEventListener('click', () => {
    playBlip();
    const raw = binInput.value.trim().split(/\s+/);
    try {
      const decoded = raw.map(b => String.fromCharCode(parseInt(b, 2))).join('');
      binOutput.textContent = `> RESULT: ${decoded}`;
      binOutput.style.color = 'var(--green-pop)';
    } catch (e) {
      binOutput.textContent = '> ERROR: Invalid Binary Format';
      binOutput.style.color = 'var(--pink-pop)';
    }
  });

  // Hex Decoder in Helper
  const hexInput = document.getElementById('hexInput');
  const hexBtn = document.getElementById('hexBtn');
  const hexOutput = document.getElementById('hexOutput');

  hexBtn.addEventListener('click', () => {
    playBlip();
    let raw = hexInput.value.trim().replace(/^0x/i, '');
    try {
      let str = '';
      for (let i = 0; i < raw.length; i += 2) {
        str += String.fromCharCode(parseInt(raw.substr(i, 2), 16));
      }
      hexOutput.textContent = `> RESULT: ${str}`;
      hexOutput.style.color = 'var(--green-pop)';
    } catch (e) {
      hexOutput.textContent = '> ERROR: Invalid Hex String';
      hexOutput.style.color = 'var(--pink-pop)';
    }
  });

  // 7. DOWNLOAD BUTTON CELEBRATION
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadStatus = document.getElementById('downloadStatus');

  downloadBtn.addEventListener('click', () => {
    playCyberChord();
    downloadStatus.textContent = '⚡ Download initiated! Extracting 15-step cipher bundle...';
    downloadStatus.style.color = 'var(--green-pop)';
    downloadStatus.style.fontWeight = '800';

    triggerParticleBurst();

    setTimeout(() => {
      downloadStatus.textContent = '💡 Tip: Buka Developer Console (F12) untuk memulai dekripsi!';
      downloadStatus.style.color = 'var(--cyan-pop)';
    }, 2800);
  });

  function triggerParticleBurst() {
    const colors = ['#00f0ff', '#ff007a', '#ffe600', '#00ff66', '#ffffff', '#ffbe0b'];
    for (let i = 0; i < 45; i++) {
      const p = document.createElement('div');
      p.style.position = 'fixed';
      p.style.left = '50%';
      p.style.top = '65%';
      p.style.width = Math.random() * 8 + 4 + 'px';
      p.style.height = Math.random() * 8 + 4 + 'px';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.border = '2px solid #000';
      p.style.borderRadius = '2px';
      p.style.zIndex = '9999';
      p.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 280 + 120;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 120;

      document.body.appendChild(p);

      let posX = window.innerWidth / 2;
      let posY = window.innerHeight * 0.65;
      let opacity = 1;

      const anim = setInterval(() => {
        posX += vx * 0.02;
        posY += vy * 0.02 + 3.5;
        opacity -= 0.028;

        p.style.left = posX + 'px';
        p.style.top = posY + 'px';
        p.style.opacity = opacity;

        if (opacity <= 0) {
          clearInterval(anim);
          p.remove();
        }
      }, 20);
    }
  }

  // 8. 3D CYBER CANVAS WIREFRAME & RIPPLE SHOCKWAVE
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const ripples = [];
    document.addEventListener('click', (e) => {
      ripples.push({ x: e.clientX, y: e.clientY, radius: 0, opacity: 1 });
    });

    const particles = [];
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        size: Math.random() * 2.5 + 1.5,
        color: ['#00f0ff', '#ff007a', '#ffe600', '#00ff66'][Math.floor(Math.random() * 4)]
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 5;
        r.opacity -= 0.02;
        if (r.opacity <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.strokeStyle = `rgba(0, 240, 255, ${r.opacity})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw Particles & Connections
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.16 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        const mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (mouseDist < 170) {
          ctx.strokeStyle = `rgba(255, 0, 122, ${0.35 * (1 - mouseDist / 170)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }
    draw();
  }
});
