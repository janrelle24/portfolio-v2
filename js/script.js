// Preloader: counts 1% -> 100%, then reveals the site
(function preloader() {
  const loader = document.getElementById('loader');
  const countEl = document.getElementById('loader-count');
  const ringEl = document.getElementById('loader-ring-fill');
  if (!loader || !countEl || !ringEl) return;

  const CIRCUMFERENCE = 339.29;

  const finish = () => {
    document.body.classList.remove('is-loading');
    loader.classList.add('is-hidden');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 700);
  };

  let percent = 0;
  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - t, 1.5);
    percent = Math.floor(eased * 100);

    countEl.firstChild.textContent = String(percent);
    ringEl.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - eased));

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      countEl.firstChild.textContent = '100';
      ringEl.style.strokeDashoffset = '0';
      setTimeout(finish, 300);
    }
  }

  requestAnimationFrame(tick);
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

(function scrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(el => revealObserver.observe(el));
})();

(function addTechIcons() {
  const iconMap = {
    'javascript': 'javascript',
    'react': 'react',
    'node.js': 'nodedotjs',
    'express.js': 'express',
    'html5': 'html5',
    'css3': 'css',
    'tailwind css': 'tailwindcss',
    'mongodb': 'mongodb',
    'supabase' : 'supabase',
    'postgresql' : 'postgresql',
    'netlify' : 'netlify' ,
    'render' : 'render' ,
    'git' : 'git' ,
    'pwa' : 'pwa' ,
    'indexedDB' : 'indexedDB' , 
    'jwt authentication': 'jsonwebtokens',
    'jwt auth': 'jsonwebtokens',
    'postman': 'postman',
    'google gemini ai': 'googlegemini',
    'gemini ai': 'googlegemini',
    'github': 'github'
  };

  document.querySelectorAll('.chip, .tag').forEach(el => {
    const key = el.textContent.trim().toLowerCase();
    const slug = iconMap[key];
    if (!slug) return;

    const icon = document.createElement('img');
    icon.src = `https://cdn.simpleicons.org/${slug}`;
    icon.alt = '';
    icon.loading = 'lazy';
    icon.className = el.classList.contains('chip') ? 'chip-icon' : 'tag-icon';
    icon.onerror = () => icon.remove();
    el.prepend(icon);
  });
})();

// Scroll progress indicator
(function scrollProgress() {
  const fill = document.getElementById('scroll-progress-fill');
  if (!fill) return;

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    fill.style.height = pct + '%';
  }

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

// Light / dark theme toggle
(function themeToggle() {
  const root = document.documentElement;
  const toggles = document.querySelectorAll('.theme-toggle');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggles.forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
    try { localStorage.setItem('theme', theme); } catch (err) { /* storage unavailable, ignore */ }
  }

  let stored = null;
  try { stored = localStorage.getItem('theme'); } catch (err) { /* storage unavailable, ignore */ }
  applyTheme(stored || 'light');

  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');

      toggles.forEach(t => {
        t.classList.remove('switching');
        void t.offsetWidth;
        t.classList.add('switching');
      });
    });
  });
})();

// Live local time (Philippines, UTC+8)
(function localClock() {
  const el = document.getElementById('local-time');
  if (!el) return;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Manila',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  function tick() {
    el.innerHTML = `<span class="time-value">${formatter.format(new Date())}</span> local time (PH)`;
  }

  tick();
  setInterval(tick, 1000); 
})();

// Sidebar nav: click-to-scroll + scrollspy indicator
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const indicator = document.getElementById('nav-indicator');
const sideNav = document.getElementById('side-nav');
const sections = navLinks.map(l => document.getElementById(l.dataset.target));

function moveIndicator(link) {
  if (!link) return;
  const navRect = sideNav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  indicator.style.top = (linkRect.top - navRect.top) + 'px';
  indicator.style.height = linkRect.height + 'px';
}

function setActive(link) {
  navLinks.forEach(l => l.classList.remove('active'));
  link.classList.add('active');
  moveIndicator(link);
}

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(link);
    document.querySelector('.sidebar').classList.remove('open');
    const toggle = document.getElementById('mobile-toggle');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = sections.indexOf(entry.target);
      if (idx !== -1) setActive(navLinks[idx]);
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => { if (sec) observer.observe(sec); });

window.addEventListener('load', () => moveIndicator(document.querySelector('.nav-link.active')));
window.addEventListener('resize', () => moveIndicator(document.querySelector('.nav-link.active')));

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const sidebar = document.querySelector('.sidebar');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {  
    const isOpen = sidebar.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// Contact form — sends via EmailJS
(function contactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  emailjs.init('cVAUJcUEAEaw5o9_W');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '';
    status.classList.remove('success', 'error');

    const btn = form.querySelector('.btn-submit');
    const originalLabel = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;

    emailjs.sendForm(service_t75qy53, template_jikoxf8, form)
      .then(() => {
        status.textContent = "✓ Message sent — I'll get back to you soon.";
        status.classList.add('success');
        form.reset();
      })
      .catch((error) => {
        status.textContent = '✗ Failed to send. Please try again or email me directly.';
        status.classList.add('error');
        console.error('EmailJS error:', error);
      })
      .finally(() => {
        btn.textContent = originalLabel;
        btn.disabled = false;
        setTimeout(() => {
          status.textContent = '';
          status.classList.remove('success', 'error');
        }, 5000);
      });
  });
})();