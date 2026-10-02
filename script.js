const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const yearEl = document.getElementById('year');
const themeToggle = document.getElementById('theme-toggle');
const musicToggle = document.getElementById('music-toggle');
const soundToggle = document.getElementById('sound-toggle');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const dailyVibes = [
  'Hari ini waktunya belajar satu hal baru. 🌱',
  'Pelan-pelan juga tetap sampai. ✨',
  'Ide kecil bisa jadi karya besar. 💡',
  'Jangan lupa istirahat di sela coding. 🍵',
  'Terus mencoba, terus bertumbuh. 🌷'
];
const dailyVibe = document.getElementById('daily-vibe');

if (dailyVibe) {
  dailyVibe.textContent = dailyVibes[Math.floor(Math.random() * dailyVibes.length)];
}

let savedTheme = 'day';

try {
  savedTheme = localStorage.getItem('portfolio-theme') || 'day';
} catch {
  savedTheme = 'day';
}

function setTheme(theme) {
  document.body.dataset.theme = theme;

  if (!themeToggle) {
    return;
  }

  const isNight = theme === 'night';
  themeToggle.setAttribute('aria-pressed', String(isNight));
  themeToggle.setAttribute('aria-label', isNight ? 'Aktifkan tema siang' : 'Aktifkan tema malam');
  themeToggle.title = isNight ? 'Tema malam aktif' : 'Tema siang aktif';
  themeToggle.querySelector('span').textContent = isNight ? '☀' : '☾';
}

setTheme(savedTheme === 'night' ? 'night' : 'day');

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.body.dataset.theme === 'night' ? 'day' : 'night';
  setTheme(nextTheme);

  try {
    localStorage.setItem('portfolio-theme', nextTheme);
  } catch {
    // Theme still works for this page even when storage is unavailable.
  }
});

let soundEnabled = Boolean(soundToggle);
let soundContext;
let musicContext;
let musicTimer;
let musicNoteIndex = 0;

function playSoftClick() {
  if (!soundEnabled) {
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  soundContext ||= new AudioContextClass();
  const oscillator = soundContext.createOscillator();
  const gain = soundContext.createGain();
  const now = soundContext.currentTime;

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(620, now);
  oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.07);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.035, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
  oscillator.connect(gain);
  gain.connect(soundContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.12);
}

soundToggle?.addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute('aria-pressed', String(soundEnabled));
  soundToggle.setAttribute('aria-label', soundEnabled ? 'Matikan efek suara' : 'Nyalakan efek suara');
  soundToggle.title = soundEnabled ? 'Efek suara aktif' : 'Efek suara mati';
  soundToggle.querySelector('span').textContent = soundEnabled ? '🔊' : '🔇';
});

document.addEventListener('click', (event) => {
  if (event.target.closest('button, a')) {
    playSoftClick();
  }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function spawnSparkle(x, y, className = 'cursor-sparkle') {
  const sparkle = document.createElement('span');
  sparkle.className = className;
  sparkle.setAttribute('aria-hidden', 'true');
  sparkle.textContent = ['✦', '✧', '♥', '✿'][Math.floor(Math.random() * 4)];
  sparkle.style.left = `${x}px`;
  sparkle.style.top = `${y}px`;
  document.body.appendChild(sparkle);
  window.setTimeout(() => sparkle.remove(), 850);
}

const supportsHoverCursor = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!prefersReducedMotion && supportsHoverCursor) {
  let lastTrailTime = 0;

  document.addEventListener('pointermove', (event) => {
    const currentTime = performance.now();

    if (currentTime - lastTrailTime < 85) {
      return;
    }

    lastTrailTime = currentTime;
    spawnSparkle(event.clientX, event.clientY);
  }, { passive: true });
}

document.addEventListener('click', (event) => {
  if (prefersReducedMotion || !event.isTrusted) {
    return;
  }

  for (let index = 0; index < 4; index += 1) {
    const angle = (Math.PI * 2 * index) / 4;
    const distance = 18 + Math.random() * 14;
    const sparkle = document.createElement('span');
    sparkle.className = 'click-sparkle';
    sparkle.setAttribute('aria-hidden', 'true');
    sparkle.textContent = ['✦', '✧', '♥', '✿'][index];
    sparkle.style.left = `${event.clientX}px`;
    sparkle.style.top = `${event.clientY}px`;
    sparkle.style.setProperty('--sparkle-x', `${Math.cos(angle) * distance}px`);
    sparkle.style.setProperty('--sparkle-y', `${Math.sin(angle) * distance}px`);
    document.body.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 700);
  }
});

function startMusic() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return false;
  }

  musicContext ||= new AudioContextClass();
  musicContext.resume();
  const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23];

  const playNote = () => {
    const oscillator = musicContext.createOscillator();
    const gain = musicContext.createGain();
    const now = musicContext.currentTime;

    oscillator.type = 'sine';
    oscillator.frequency.value = notes[musicNoteIndex % notes.length];
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.018, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
    oscillator.connect(gain);
    gain.connect(musicContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.58);
    musicNoteIndex += 1;
  };

  playNote();
  musicTimer = window.setInterval(playNote, 700);
  return true;
}

function stopMusic() {
  window.clearInterval(musicTimer);
  musicTimer = undefined;

  if (musicContext) {
    musicContext.close();
    musicContext = undefined;
  }
}

musicToggle?.addEventListener('click', () => {
  const isPlaying = musicToggle.getAttribute('aria-pressed') === 'true';

  if (isPlaying) {
    stopMusic();
  } else if (!startMusic()) {
    musicToggle.title = 'Browser ini tidak mendukung audio';
    return;
  }

  musicToggle.setAttribute('aria-pressed', String(!isPlaying));
  musicToggle.setAttribute('aria-label', isPlaying ? 'Nyalakan musik' : 'Matikan musik');
  musicToggle.title = isPlaying ? 'Putar musik' : 'Musik sedang diputar';
});

function spawnConfetti(x, y) {
  if (prefersReducedMotion) {
    return;
  }

  const colors = ['#f478a6', '#ffd778', '#76bda5', '#b9a6f4', '#ffffff'];

  for (let index = 0; index < 28; index += 1) {
    const confetti = document.createElement('span');
    confetti.className = 'confetti-piece';
    confetti.setAttribute('aria-hidden', 'true');
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.setProperty('--confetti-x', `${(Math.random() - 0.5) * 260}px`);
    confetti.style.setProperty('--confetti-y', `${-50 - Math.random() * 220}px`);
    confetti.style.setProperty('--confetti-rotate', `${Math.random() * 540}deg`);
    confetti.style.setProperty('--confetti-color', colors[index % colors.length]);
    document.body.appendChild(confetti);
    window.setTimeout(() => confetti.remove(), 1200);
  }
}

document.querySelectorAll('.confetti-trigger').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    spawnConfetti(event.clientX, event.clientY);
  });
});

const guestbookForm = document.getElementById('guestbook-form');
const guestbookList = document.getElementById('guestbook-list');
const guestbookFeedback = document.getElementById('guestbook-feedback');
const guestbookStorageKey = 'masruroh-guestbook';

function getGuestbookEntries() {
  try {
    return JSON.parse(localStorage.getItem(guestbookStorageKey) || '[]');
  } catch {
    return [];
  }
}

function renderGuestbook() {
  if (!guestbookList) {
    return;
  }

  guestbookList.replaceChildren();

  getGuestbookEntries().slice(-4).reverse().forEach((entry) => {
    const item = document.createElement('li');
    const name = document.createElement('strong');
    const message = document.createElement('p');
    name.textContent = entry.name;
    message.textContent = entry.message;
    item.append(name, message);
    guestbookList.appendChild(item);
  });
}

renderGuestbook();

guestbookForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(guestbookForm);
  const entry = {
    name: String(formData.get('name') || '').trim(),
    message: String(formData.get('message') || '').trim()
  };

  if (!entry.name || !entry.message) {
    return;
  }

  try {
    const entries = getGuestbookEntries();
    entries.push(entry);
    localStorage.setItem(guestbookStorageKey, JSON.stringify(entries.slice(-20)));
    guestbookForm.reset();
    guestbookFeedback.textContent = 'Pesanmu tersimpan di browser ini. Terima kasih! 💌';
    renderGuestbook();
  } catch {
    guestbookFeedback.textContent = 'Penyimpanan browser tidak tersedia saat ini.';
  }
});

document.querySelectorAll('.draggable-sticker').forEach((sticker) => {
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;

  sticker.addEventListener('pointerdown', (event) => {
    const rect = sticker.getBoundingClientRect();
    pointerOffsetX = event.clientX - rect.left;
    pointerOffsetY = event.clientY - rect.top;
    sticker.classList.add('is-dragging');
    sticker.setPointerCapture(event.pointerId);
  });

  sticker.addEventListener('pointermove', (event) => {
    if (!sticker.classList.contains('is-dragging')) {
      return;
    }

    const maxLeft = window.innerWidth - sticker.offsetWidth;
    const maxTop = window.innerHeight - sticker.offsetHeight;
    sticker.style.left = `${Math.max(0, Math.min(maxLeft, event.clientX - pointerOffsetX))}px`;
    sticker.style.top = `${Math.max(0, Math.min(maxTop, event.clientY - pointerOffsetY))}px`;
    sticker.style.right = 'auto';
    sticker.style.bottom = 'auto';
  });

  sticker.addEventListener('pointerup', () => sticker.classList.remove('is-dragging'));
  sticker.addEventListener('pointercancel', () => sticker.classList.remove('is-dragging'));
});

const portfolioWindow = document.getElementById('portfolio-window');

portfolioWindow?.querySelectorAll('[data-window-action]').forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.windowAction;
    const restoreButton = portfolioWindow.querySelector('[data-window-action="restore"]');

    if (action === 'minimize') {
      portfolioWindow.classList.add('is-minimized');
      restoreButton.hidden = false;
    }

    if (action === 'maximize') {
      portfolioWindow.classList.toggle('is-maximized');
    }

    if (action === 'restore') {
      portfolioWindow.classList.remove('is-minimized');
      restoreButton.hidden = true;
    }
  });
});

const revealTargets = document.querySelectorAll(
  '.hero-content, .hero-visual, .section-heading, .about-grid, .skills-grid, .project-grid, .contact-box'
);
if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach((target) => target.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((target) => revealObserver.observe(target));
}

