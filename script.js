// ============================================
// Footer year
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();

// ============================================
// Hero "typing" status animation
// ============================================
(function typeStatus() {
  const el = document.getElementById('typed-status');
  const word = "'open to junior developer roles'";
  let i = 0;

  function tick() {
    if (i <= word.length) {
      el.textContent = word.slice(0, i);
      i++;
      setTimeout(tick, 45);
    }
  }
  tick();
})();

// ============================================
// Tab bar: click-to-scroll + scrollspy underline
// ============================================
const tabs = Array.from(document.querySelectorAll('.tab'));
const underline = document.getElementById('tab-underline');
const tabBar = document.getElementById('tab-bar');
const sections = tabs.map(t => document.getElementById(t.dataset.target));

function moveUnderline(tab) {
  if (!tab) return;
  const barRect = tabBar.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();
  underline.style.left = (tabRect.left - barRect.left + tabBar.scrollLeft) + 'px';
  underline.style.width = tabRect.width + 'px';
}

function setActive(tab) {
  tabs.forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  moveUnderline(tab);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = document.getElementById(tab.dataset.target);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActive(tab);
  });
});

// Scrollspy via IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const idx = sections.indexOf(entry.target);
      if (idx !== -1) setActive(tabs[idx]);
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => { if (sec) observer.observe(sec); });

// Initialize underline position after fonts/layout settle
window.addEventListener('load', () => moveUnderline(document.querySelector('.tab.active')));
window.addEventListener('resize', () => moveUnderline(document.querySelector('.tab.active')));

// ============================================
// Contact form (demo — no backend wired up)
// ============================================
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = '';
  const btn = form.querySelector('.btn-run');
  const originalLabel = btn.textContent;
  btn.textContent = '▶ sending...';

  // TODO: replace this timeout with a real submission
  // (e.g. fetch() to Formspree, Netlify Forms, or your own API)
  setTimeout(() => {
    status.textContent = '✓ message sent — I\'ll get back to you soon.';
    btn.textContent = originalLabel;
    form.reset();
  }, 700);
});
