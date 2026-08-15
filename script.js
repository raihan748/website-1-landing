/**
 * ====================================================================
 * SCRIPT.JS - NEXUS CTF STAGE 1 INTERACTIVE ENGINE
 * ====================================================================
 * Features:
 * 1. Cyber Particle Node Grid (Canvas) with cursor attraction
 * 2. 8-Bit Web Audio API Sound Synthesizer
 * 3. 3D Card Perspective Tilt Engine
 * 4. Confetti & Download Action Handler
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SOUND SYNTHESIZER (WEB AUDIO API - ZERO EXTERNAL ASSETS)
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

  function playSynthSound(freq, type = 'sine', duration = 0.08, decay = true) {
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

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
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

  function playChime() {
    playSynthSound(523.25, 'triangle', 0.1);
    setTimeout(() => playSynthSound(659.25, 'triangle', 0.1), 80);
    setTimeout(() => playSynthSound(783.99, 'triangle', 0.15), 160);
    setTimeout(() => playSynthSound(1046.50, 'triangle', 0.25), 240);
  }

  function playBlip() {
    playSynthSound(880, 'square', 0.04);
  }

  function playDownloadSound() {
    playSynthSound(330, 'sawtooth', 0.1);
    setTimeout(() => playSynthSound(440, 'sawtooth', 0.1), 70);
    setTimeout(() => playSynthSound(554.37, 'sawtooth', 0.1), 140);
    setTimeout(() => playSynthSound(659.25, 'sawtooth', 0.1), 210);
    setTimeout(() => playSynthSound(880, 'sine', 0.3), 280);
  }

  // Sound Toggle Listener
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
      playBlip();
    } else {
      soundIcon.textContent = '🔇';
      soundLabel.textContent = 'SFX: OFF';
      soundToggleBtn.style.borderColor = '#555';
    }
  });

  // Attach hover sounds to interactive elements
  const interactiveElements = document.querySelectorAll('button, a, .step-badge, .hud-item');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      playSynthSound(1200, 'sine', 0.03);
    });
  });

  // 2. 3D CARD TILT ON MOUSE MOVE
  const tiltContainer = document.getElementById('tiltContainer');
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

  // 3. DOWNLOAD BUTTON HANDLER WITH CELEBRATION
  const downloadBtn = document.getElementById('downloadBtn');
  const downloadStatus = document.getElementById('downloadStatus');

  downloadBtn.addEventListener('click', () => {
    playDownloadSound();
    downloadStatus.textContent = '⚡ Download initiated! Extracting 15-step cipher bundle...';
    downloadStatus.style.color = 'var(--green-pop)';
    downloadStatus.style.fontWeight = '700';

    triggerParticleBurst();

    setTimeout(() => {
      downloadStatus.textContent = '💡 Tip: Buka Developer Console (F12) untuk memulai dekripsi!';
      downloadStatus.style.color = 'var(--cyan-pop)';
    }, 2500);
  });

  function triggerParticleBurst() {
    const colors = ['#00f0ff', '#ff007a', '#ffe600', '#00ff66', '#ffffff'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.style.position = 'fixed';
      p.style.left = '50%';
      p.style.top = '60%';
      p.style.width = Math.random() * 8 + 4 + 'px';
      p.style.height = Math.random() * 8 + 4 + 'px';
      p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      p.style.border = '2px solid #000';
      p.style.borderRadius = '2px';
      p.style.zIndex = '999';
      p.style.pointerEvents = 'none';

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 250 + 100;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 100;

      document.body.appendChild(p);

      let posX = window.innerWidth / 2;
      let posY = window.innerHeight * 0.6;
      let opacity = 1;

      const anim = setInterval(() => {
        posX += vx * 0.02;
        posY += vy * 0.02 + 3; // gravity
        opacity -= 0.03;

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

  // 4. CYBER PARTICLE CANVAS
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1.5,
        color: ['#00f0ff', '#ff007a', '#ffe600', '#00ff66'][Math.floor(Math.random() * 4)]
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // Draw particle nodes & connecting lines
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Connect particles within distance
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Mouse connection line
        const mouseDist = Math.hypot(p.x - mouseX, p.y - mouseY);
        if (mouseDist < 160) {
          ctx.strokeStyle = `rgba(255, 0, 122, ${0.35 * (1 - mouseDist / 160)})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }

        // Draw particle
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
